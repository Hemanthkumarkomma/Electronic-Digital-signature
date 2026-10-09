using System.Globalization;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using ElectronicSignature.API.Models;
using ElectronicSignature.API.Online.Services.Interfaces;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;

namespace ElectronicSignature.API.Online.Services.Implementations;

/// <summary>
/// Produces the completed consent PDF from the original DOCX templates in /Assets
/// (copied read-only to bin/Templates). The template is copied to a temp file, the
/// submitted values are written into the existing blank lines under each label,
/// existing ☐ boxes are ticked from stored booleans, the stored signature is inserted,
/// and Microsoft Word renders the result to PDF.
/// </summary>
public sealed partial class ConsentPdfService : IConsentPdfService
{
    public const string OpenTemplateFileName =
        "Texas_Youth_Animal_Showcase_Open_Exhibitor_Consent_Form_Template.docx";

    public const string JuniorTemplateFileName =
        "Texas_Youth_Animal_Showcase_Junior_Exhibitor_Consent_Form_Template.docx";

    private const int WdExportFormatPdf = 17;
    private const int WdDoNotSaveChanges = 0;
    private const int WdAlertsNone = 0;

    // Word automation is not thread-safe; render one document at a time.
    private static readonly SemaphoreSlim WordLock = new(1, 1);
    private static readonly TimeSpan ConversionTimeout = TimeSpan.FromSeconds(90);

    private readonly ILogger<ConsentPdfService> _logger;

    public ConsentPdfService(ILogger<ConsentPdfService> logger)
    {
        _logger = logger;
    }

    public async Task<byte[]> GenerateApprovedPdfAsync(
        ConsentForm form,
        CancellationToken cancellationToken = default)
    {
        var isJunior = form.ExhibitorType switch
        {
            "Junior" => true,
            "Open" => false,
            _ => throw new InvalidOperationException(
                $"Unsupported exhibitor type '{form.ExhibitorType}' for submission {form.Id}.")
        };

        var templatePath = Path.Combine(
            AppContext.BaseDirectory,
            "Templates",
            isJunior ? JuniorTemplateFileName : OpenTemplateFileName);

        if (!File.Exists(templatePath))
        {
            throw new FileNotFoundException("Consent form template not found.", templatePath);
        }

        var workDirectory = Path.Combine(
            Path.GetTempPath(),
            "tyas-consent-pdf",
            Guid.NewGuid().ToString("N"));

        Directory.CreateDirectory(workDirectory);

        var docxPath = Path.Combine(workDirectory, "consent.docx");
        var pdfPath = Path.Combine(workDirectory, "consent.pdf");

        try
        {
            File.Copy(templatePath, docxPath);

            using (var document = WordprocessingDocument.Open(docxPath, true))
            {
                var filler = new TemplateFiller(document, form, _logger);

                if (isJunior)
                {
                    filler.FillJunior();
                }
                else
                {
                    filler.FillOpen();
                }

                document.MainDocumentPart!.Document!.Save();
            }

            await WordLock.WaitAsync(cancellationToken);

            try
            {
                if (!OperatingSystem.IsWindows())
                {
                    throw new PlatformNotSupportedException(
                        "DOCX to PDF conversion requires Microsoft Word on Windows.");
                }

                await ConvertWithWordAsync(docxPath, pdfPath, cancellationToken);
            }
            finally
            {
                WordLock.Release();
            }

            return await File.ReadAllBytesAsync(pdfPath, cancellationToken);
        }
        finally
        {
            try
            {
                Directory.Delete(workDirectory, recursive: true);
            }
            catch (Exception cleanupError)
            {
                _logger.LogWarning(
                    cleanupError,
                    "Could not delete temporary PDF folder {Folder}",
                    workDirectory);
            }
        }
    }

    // =====================================================
    // DOCX -> PDF (Microsoft Word, late-bound COM on an STA thread)
    // =====================================================

    [System.Runtime.Versioning.SupportedOSPlatform("windows")]
    private static Task ConvertWithWordAsync(
        string docxPath,
        string pdfPath,
        CancellationToken cancellationToken)
    {
        var completion = new TaskCompletionSource(
            TaskCreationOptions.RunContinuationsAsynchronously);

        var thread = new Thread(() =>
        {
            object? word = null;
            object? document = null;
            Exception? failure = null;

            try
            {
                var wordType = Type.GetTypeFromProgID("Word.Application")
                    ?? throw new InvalidOperationException(
                        "Microsoft Word is not installed on this server.");

                word = Activator.CreateInstance(wordType)
                    ?? throw new InvalidOperationException(
                        "Microsoft Word could not be started.");

                dynamic wordApp = word;
                wordApp.Visible = false;
                wordApp.DisplayAlerts = WdAlertsNone;

                // FileName, ConfirmConversions, ReadOnly, AddToRecentFiles
                document = wordApp.Documents.Open(docxPath, false, true, false);

                dynamic doc = document!;
                doc.ExportAsFixedFormat(pdfPath, WdExportFormatPdf);
            }
            catch (Exception ex)
            {
                failure = ex;
            }
            finally
            {
                if (document is not null)
                {
                    try { ((dynamic)document).Close(WdDoNotSaveChanges); } catch { }
                    Marshal.FinalReleaseComObject(document);
                }

                if (word is not null)
                {
                    try { ((dynamic)word).Quit(WdDoNotSaveChanges); } catch { }
                    Marshal.FinalReleaseComObject(word);
                }
            }

            // Complete only after Word has quit, so no instance outlives the request.
            if (failure is null)
            {
                completion.TrySetResult();
            }
            else
            {
                completion.TrySetException(failure);
            }
        })
        {
            IsBackground = true,
            Name = "ConsentPdfWordExport"
        };

        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();

        return completion.Task.WaitAsync(ConversionTimeout, cancellationToken);
    }

    // =====================================================
    // TEMPLATE FILLING
    // =====================================================

    private sealed partial class TemplateFiller
    {
        private const string Unchecked = "☐";
        private const string Checked = "☑";
        private const string ValueFontSize = "18"; // half-points, same as template labels
        private const string TypedSignatureFont = "Brush Script MT"; // same as the signature pad preview

        private const long EmuPerPixel = 9525;
        private const long MaxSignatureWidthEmu = (long)(2.6 * 914400);
        private const long MaxSignatureHeightEmu = (long)(0.75 * 914400);

        private readonly MainDocumentPart _main;
        private readonly Body _body;
        private readonly ConsentForm _form;
        private readonly ILogger _logger;
        private readonly List<Table> _tables;
        private readonly Dictionary<int, List<Paragraph>> _sectionParagraphs = new();
        private readonly Dictionary<string, (string RelationshipId, long Width, long Height)> _signatureImages = new();

        private uint _nextDrawingId = 1000;

        public TemplateFiller(WordprocessingDocument document, ConsentForm form, ILogger logger)
        {
            _main = document.MainDocumentPart
                ?? throw new InvalidOperationException("Template has no main document part.");
            _body = _main.Document?.Body
                ?? throw new InvalidOperationException("Template has no document body.");
            _form = form;
            _logger = logger;
            _tables = _body.Elements<Table>().ToList();

            var currentSection = 0;

            foreach (var paragraph in _body.Elements<Paragraph>())
            {
                var match = SectionHeading().Match(TextOf(paragraph));

                if (match.Success)
                {
                    currentSection = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
                    continue;
                }

                if (!_sectionParagraphs.TryGetValue(currentSection, out var list))
                {
                    _sectionParagraphs[currentSection] = list = new List<Paragraph>();
                }

                list.Add(paragraph);
            }
        }

        // ---------------- OPEN ----------------

        public void FillOpen()
        {
            var f = _form;

            // 1. EVENT INFORMATION
            Cell(1, "Event Name", f.EventName);
            Cell(1, "Event Location, Texas", f.EventLocation);
            Cell(1, "Event Date", FormatDate(f.EventDate));
            Cell(1, "Organization / Event Sponsor", f.Organization);

            // 2. OPEN EXHIBITOR INFORMATION
            Cell(2, "Full Legal Name", f.ParticipantFullName);
            Cell(2, "Phone Number", f.ParticipantPhone);
            Cell(2, "Email Address", f.ParticipantEmail);
            Cell(2, "Address", f.ParticipantAddress);
            Cell(2, "City", f.ParticipantCity);
            Cell(2, "State", f.ParticipantState);
            Cell(2, "ZIP Code", f.ParticipantZip);
            Cell(2, "Exhibitor Role", f.ExhibitorRole);

            // 3. ANIMAL PARTICIPATION INFORMATION
            Cell(3, "Animal Type", f.AnimalTypes);
            Cell(3, "Other Animal Type", f.OtherAnimalType);
            Cell(3, "Animal Name / Identification", f.AnimalName);
            Cell(3, "Animal Type / Species", f.Species);
            Cell(3, "Exhibitor Role", f.ExhibitorRole);
            Cell(3, "Other Role", f.OtherRole);
            AnimalCheckboxes(3);

            // 5. MEDICAL / EMERGENCY INFORMATION
            Cell(4, "Allergies / Medical Conditions Staff Should Know About", f.Allergies);
            Cell(4, "Special Assistance Required", f.SpecialAssistance);
            Cell(4, "Emergency Contact Name", f.EmergencyContactName);
            Cell(4, "Emergency Contact Phone", f.EmergencyContactPhone);
            Cell(4, "Preferred Hospital / Medical Facility", f.PreferredHospital);

            // 6. EXHIBITOR CONSENT
            TickSection(6, f.ConsentAgreed);

            // 7. DIGITAL SIGNATURE
            SignatureMethodLine(7);
            SignatureUnderHeading("Open Exhibitor Digital Signature");
            SignatureBlock(5, f.ParticipantFullName, signed: true);

            // 8. FINAL CONSENT
            TickSection(8, f.FinalConsent);
            SignatureUnderHeading("Open Exhibitor Final Signature");
            SignatureBlock(6, f.ParticipantFullName, signed: true);

            // 9. SUBMISSION / EVENT ADMINISTRATION
            Administration(7);
        }

        // ---------------- JUNIOR ----------------

        public void FillJunior()
        {
            var f = _form;

            // 1. EVENT INFORMATION
            Cell(1, "Event Name", f.EventName);
            Cell(1, "Event Location, Texas", f.EventLocation);
            Cell(1, "Event Date", FormatDate(f.EventDate));
            Cell(1, "Organization / Event Sponsor", f.Organization);

            // 2. JUNIOR EXHIBITOR INFORMATION
            Cell(2, "Child / Participant Full Name", f.ParticipantFullName);
            Cell(2, "Date of Birth", FormatDate(f.DateOfBirth));
            Cell(2, "Age", f.Age?.ToString(CultureInfo.InvariantCulture));
            Cell(2, "Phone (if applicable)", f.ParticipantPhone);
            Cell(2, "Address", f.ParticipantAddress);
            Cell(2, "City / State / ZIP", CityStateZip(f.ParticipantCity, f.ParticipantState, f.ParticipantZip));

            // 3. JUNIOR ELIGIBILITY & CLUB INFORMATION
            Cell(3, "Club Affiliation *", f.ClubAffiliation);
            Cell(3, "Club Name *", f.ClubName);
            Cell(3, "Club / Chapter Number", f.ClubChapterNumber);
            Cell(3, "County / District", f.CountyDistrict);

            // 4. PARENT / LEGAL GUARDIAN INFORMATION
            Cell(4, "Parent / Legal Guardian Full Name", f.ParentGuardianName);
            Cell(4, "Relationship to Participant", f.ParentGuardianRelationship);
            Cell(4, "Phone Number", f.ParentGuardianPhone);
            Cell(4, "Email Address", f.ParentGuardianEmail);
            Cell(4, "Parent / Guardian Address", f.ParentGuardianAddress);
            Cell(4, "City / State / ZIP", CityStateZip(f.ParentGuardianCity, f.ParentGuardianState, f.ParentGuardianZip));

            // 6. ANIMAL PARTICIPATION INFORMATION
            AnimalCheckboxes(6);
            Cell(5, "Animal Name / Identification", f.AnimalName);
            Cell(5, "Animal Type / Species", f.Species);
            Cell(5, "Exhibitor Role", f.ExhibitorRole);
            Cell(5, "Other Role", f.OtherRole);

            // 7. SAFETY AND RESPONSIBLE ANIMAL HANDLING
            TickSection(7, f.SafetyAgreed && f.JuniorRulesAgreement == true);

            // 8. MEDICAL / EMERGENCY INFORMATION
            Cell(6, "Allergies or Medical Conditions Staff Should Know About", f.Allergies);
            Cell(6, "Special Assistance Required", f.SpecialAssistance);
            Cell(6, "Emergency Contact Name", f.EmergencyContactName);
            Cell(6, "Emergency Contact Phone", f.EmergencyContactPhone);
            Cell(6, "Preferred Hospital / Medical Facility", f.PreferredHospital);

            // 9. PARENT / GUARDIAN CONSENT
            TickSection(9, f.ParentGuardianConsent == true && f.ConsentAgreed);

            // 10. DIGITAL SIGNATURE
            SignatureMethodLine(10);
            SignatureBlock(
                7,
                f.ParticipantFullName,
                true,
                f.ParticipantSignatureMethod,
                f.ParticipantSignatureData);
            SignatureUnderHeading(
                "Junior / Participant Digital Signature",
                f.ParticipantSignatureMethod,
                f.ParticipantSignatureData);
            SignatureBlock(8, f.ParentGuardianName, signed: true);
            SignatureUnderHeading("Parent / Legal Guardian Electronic Signature");

            // 11. PARTICIPANT ACKNOWLEDGMENT
            Cell(9, "Participant Full Name", f.ParticipantFullName);

            // 12. FINAL CONSENT
            TickSection(12, f.FinalConsent);
            SignatureInCell(10, "Parent / Guardian Final Signature");
            Cell(10, "Signed By", f.ParentGuardianName);
            Cell(10, "Date", FormatDate(f.SubmittedAt));

            // 13. SUBMISSION / EVENT ADMINISTRATION
            Administration(11);
        }

        // ---------------- shared sections ----------------

        private void Administration(int table)
        {
            Cell(table, "Submission ID", _form.Id.ToString(CultureInfo.InvariantCulture));
            Cell(table, "Submitted Date / Time", FormatDateTime(_form.SubmittedAt));

            var status = FindCellParagraph(table, text => text.StartsWith("Status:", StringComparison.Ordinal));
            TickOption(status, "Approved");
        }

        private void AnimalCheckboxes(int section)
        {
            var selected = (_form.AnimalTypes ?? string.Empty)
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            foreach (var paragraph in CheckboxLines(section))
            {
                var option = TextOf(paragraph)[Unchecked.Length..].Trim();
                var name = option.Split(':')[0].Trim();

                if (!selected.Contains(name))
                {
                    continue;
                }

                TickOption(paragraph, name);

                if (name.Equals("Other", StringComparison.OrdinalIgnoreCase) &&
                    !string.IsNullOrWhiteSpace(_form.OtherAnimalType))
                {
                    ReplaceUnderscores(paragraph, _form.OtherAnimalType);
                }
            }
        }

        private void TickSection(int section, bool value)
        {
            if (!value)
            {
                return;
            }

            foreach (var paragraph in CheckboxLines(section))
            {
                ReplaceFirst(paragraph, Unchecked, Checked);
            }
        }

        private void SignatureMethodLine(int section)
        {
            var option = MethodOption(_form.SignatureMethod);

            if (option is null || !HasSignature(_form.SignatureMethod, _form.SignatureData))
            {
                return;
            }

            var line = SectionParagraphs(section)
                .FirstOrDefault(p => TextOf(p).StartsWith("Choose how you want to sign", StringComparison.Ordinal))
                ?? throw TemplateMismatch($"signature method line in section {section}");

            TickOption(line, option);
        }

        // Signature Method / Full Legal Name / Date / Time Signed table.
        private void SignatureBlock(
            int table,
            string? fullName,
            bool signed,
            string? signatureMethod = null,
            string? signatureData = null)
        {
            signatureMethod ??= _form.SignatureMethod;
            signatureData ??= _form.SignatureData;

            if (signed && HasSignature(signatureMethod, signatureData) &&
                MethodOption(signatureMethod) is { } option)
            {
                TickOption(ValueParagraph(table, "Signature Method"), option);
            }

            if (!string.IsNullOrWhiteSpace(fullName))
            {
                ReplaceUnderscores(ValueParagraph(table, "Full Legal Name"), fullName);
            }

            if (signed && HasSignature(signatureMethod, signatureData))
            {
                ReplaceUnderscores(ValueParagraph(table, "Date / Time Signed"), FormatDateTime(_form.SubmittedAt));
            }
        }

        private void SignatureUnderHeading(
            string headingText,
            string? signatureMethod = null,
            string? signatureData = null)
        {
            signatureMethod ??= _form.SignatureMethod;
            signatureData ??= _form.SignatureData;
            var heading = _body.Elements<Paragraph>()
                .FirstOrDefault(p => TextOf(p) == headingText)
                ?? throw TemplateMismatch($"signature heading '{headingText}'");

            var signature = BuildSignatureRun(signatureMethod, signatureData);

            if (signature is null)
            {
                return;
            }

            heading.AppendChild(new Run(new Break()));
            heading.AppendChild(signature);
        }

        private void SignatureInCell(
            int table,
            string label,
            string? signatureMethod = null,
            string? signatureData = null)
        {
            signatureMethod ??= _form.SignatureMethod;
            signatureData ??= _form.SignatureData;
            var signature = BuildSignatureRun(signatureMethod, signatureData);

            if (signature is not null)
            {
                var paragraph = FindCellParagraph(table, text => text == label);
                InsertIntoLabelCell(paragraph, signature);

                // Keep the label and the signature image on the same page.
                if (paragraph.Ancestors<TableRow>().FirstOrDefault() is { } row)
                {
                    var rowProperties = row.TableRowProperties ??= new TableRowProperties();

                    if (!rowProperties.Elements<CantSplit>().Any())
                    {
                        rowProperties.AppendChild(new CantSplit());
                    }
                }
            }
        }

        // ---------------- signature ----------------

        private static string? MethodOption(string? signatureMethod) =>
            (signatureMethod ?? string.Empty).Trim().ToLowerInvariant() switch
            {
                "draw" => "Draw",
                "type" => "Type",
                "upload" => "Upload",
                _ => null
            };

        private static bool IsImageSignature(string? signatureData) =>
            (signatureData ?? string.Empty).StartsWith("data:image/", StringComparison.OrdinalIgnoreCase);

        private static bool HasSignature(string? signatureMethod, string? signatureData) =>
            IsImageSignature(signatureData) ||
            (MethodOption(signatureMethod) == "Type" && !string.IsNullOrWhiteSpace(signatureData));

        private Run? BuildSignatureRun(string? signatureMethod, string? signatureData)
        {
            if (IsImageSignature(signatureData))
            {
                var (relationshipId, width, height) = EnsureSignatureImage(signatureData!);

                var id = _nextDrawingId++;

                return new Run(BuildInlineImage(relationshipId, width, height, id, $"Signature {id}"));
            }

            if (MethodOption(signatureMethod) == "Type" && !string.IsNullOrWhiteSpace(signatureData))
            {
                return new Run(
                    new RunProperties(
                        new RunFonts { Ascii = TypedSignatureFont, HighAnsi = TypedSignatureFont, ComplexScript = TypedSignatureFont },
                        new FontSize { Val = "40" }),
                    new Text(signatureData.Trim()) { Space = SpaceProcessingModeValues.Preserve });
            }

            _logger.LogWarning(
                "Submission {Id} has no usable stored signature (method '{Method}', {Length} chars); signature area left blank.",
                _form.Id,
                signatureMethod,
                signatureData?.Length ?? 0);

            return null;
        }

        private (string RelationshipId, long Width, long Height) EnsureSignatureImage(string signatureData)
        {
            if (_signatureImages.TryGetValue(signatureData, out var cached))
            {
                return cached;
            }

            var match = DataUrl().Match(signatureData.Trim());

            if (!match.Success)
            {
                throw new InvalidOperationException(
                    $"Submission {_form.Id} has an unsupported signature image format.");
            }

            var bytes = Convert.FromBase64String(match.Groups["data"].Value);
            var isPng = match.Groups["type"].Value.Equals("png", StringComparison.OrdinalIgnoreCase);

            var (pixelWidth, pixelHeight) = isPng ? ReadPngSize(bytes) : ReadJpegSize(bytes);

            var widthEmu = pixelWidth * EmuPerPixel;
            var heightEmu = pixelHeight * EmuPerPixel;
            var scale = Math.Min(
                (double)MaxSignatureWidthEmu / widthEmu,
                (double)MaxSignatureHeightEmu / heightEmu);

            var imagePart = _main.AddImagePart(isPng ? ImagePartType.Png : ImagePartType.Jpeg);

            using (var stream = new MemoryStream(bytes))
            {
                imagePart.FeedData(stream);
            }

            var image = (
                RelationshipId: _main.GetIdOfPart(imagePart),
                Width: (long)(widthEmu * scale),
                Height: (long)(heightEmu * scale));
            _signatureImages.Add(signatureData, image);
            return image;
        }

        private static Drawing BuildInlineImage(string relationshipId, long cx, long cy, uint id, string name) =>
            new(
                new DW.Inline(
                    new DW.Extent { Cx = cx, Cy = cy },
                    new DW.EffectExtent { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L },
                    new DW.DocProperties { Id = id, Name = name },
                    new DW.NonVisualGraphicFrameDrawingProperties(new A.GraphicFrameLocks { NoChangeAspect = true }),
                    new A.Graphic(
                        new A.GraphicData(
                            new PIC.Picture(
                                new PIC.NonVisualPictureProperties(
                                    new PIC.NonVisualDrawingProperties { Id = 0U, Name = name },
                                    new PIC.NonVisualPictureDrawingProperties()),
                                new PIC.BlipFill(
                                    new A.Blip { Embed = relationshipId },
                                    new A.Stretch(new A.FillRectangle())),
                                new PIC.ShapeProperties(
                                    new A.Transform2D(
                                        new A.Offset { X = 0L, Y = 0L },
                                        new A.Extents { Cx = cx, Cy = cy }),
                                    new A.PresetGeometry(new A.AdjustValueList()) { Preset = A.ShapeTypeValues.Rectangle })))
                        { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" }))
                {
                    DistanceFromTop = 0U,
                    DistanceFromBottom = 0U,
                    DistanceFromLeft = 0U,
                    DistanceFromRight = 0U
                });

        private static (long Width, long Height) ReadPngSize(byte[] bytes)
        {
            if (bytes.Length < 24 || bytes[0] != 0x89 || bytes[1] != 0x50)
            {
                throw new InvalidOperationException("Signature image is not a valid PNG.");
            }

            return (ReadBigEndian32(bytes, 16), ReadBigEndian32(bytes, 20));
        }

        private static (long Width, long Height) ReadJpegSize(byte[] bytes)
        {
            var i = 2;

            while (i + 9 < bytes.Length)
            {
                if (bytes[i] != 0xFF)
                {
                    i++;
                    continue;
                }

                var marker = bytes[i + 1];
                var length = (bytes[i + 2] << 8) | bytes[i + 3];

                // SOF0..SOF15 except DHT(C4), JPG(C8), DAC(CC)
                if (marker is >= 0xC0 and <= 0xCF and not 0xC4 and not 0xC8 and not 0xCC)
                {
                    var height = (bytes[i + 5] << 8) | bytes[i + 6];
                    var width = (bytes[i + 7] << 8) | bytes[i + 8];
                    return (width, height);
                }

                i += 2 + length;
            }

            throw new InvalidOperationException("Signature image is not a valid JPEG.");
        }

        private static long ReadBigEndian32(byte[] bytes, int offset) =>
            ((long)bytes[offset] << 24) | ((long)bytes[offset + 1] << 16) | ((long)bytes[offset + 2] << 8) | bytes[offset + 3];

        // ---------------- low-level template helpers ----------------

        // Label cells are "<b>Label</b><br/><br/>": the value goes on the blank line.
        private void Cell(int table, string label, string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return;
            }

            var paragraph = FindCellParagraph(table, text => text == label);
            var run = new Run(new RunProperties(new FontSize { Val = ValueFontSize }));
            var lines = value.Trim().Replace("\r\n", "\n").Split('\n');

            for (var index = 0; index < lines.Length; index++)
            {
                if (index > 0)
                {
                    run.AppendChild(new Break());
                }

                run.AppendChild(new Text(lines[index]) { Space = SpaceProcessingModeValues.Preserve });
            }

            InsertIntoLabelCell(paragraph, run);
        }

        private static void InsertIntoLabelCell(Paragraph paragraph, Run content)
        {
            var lastBreak = paragraph.Descendants<Break>().LastOrDefault();

            if (lastBreak?.Parent is Run breakRun)
            {
                // Split the label run at its trailing <w:br/> so the value sits on the blank line.
                var tail = new Run();

                if (breakRun.RunProperties is not null)
                {
                    tail.RunProperties = (RunProperties)breakRun.RunProperties.CloneNode(true);
                }

                lastBreak.Remove();
                tail.AppendChild(new Break());
                breakRun.InsertAfterSelf(content);
                content.InsertAfterSelf(tail);
            }
            else
            {
                paragraph.AppendChild(content);
            }
        }

        private Paragraph FindCellParagraph(int table, Func<string, bool> predicate)
        {
            var paragraph = GetTable(table)
                .Descendants<TableCell>()
                .Select(cell => cell.Elements<Paragraph>().FirstOrDefault())
                .FirstOrDefault(p => p is not null && predicate(TextOf(p)));

            return paragraph ?? throw TemplateMismatch($"label cell in table {table}");
        }

        // Second cell of the row whose first cell has the given label.
        private Paragraph ValueParagraph(int table, string rowLabel)
        {
            var row = GetTable(table)
                .Elements<TableRow>()
                .FirstOrDefault(r => TextOf(r.Elements<TableCell>().First()) == rowLabel)
                ?? throw TemplateMismatch($"row '{rowLabel}' in table {table}");

            return row.Elements<TableCell>().ElementAt(1).Elements<Paragraph>().First();
        }

        private Table GetTable(int table) =>
            table >= 1 && table <= _tables.Count
                ? _tables[table - 1]
                : throw TemplateMismatch($"table {table}");

        private IEnumerable<Paragraph> SectionParagraphs(int section) =>
            _sectionParagraphs.TryGetValue(section, out var list)
                ? list
                : throw TemplateMismatch($"section {section}");

        private IEnumerable<Paragraph> CheckboxLines(int section) =>
            SectionParagraphs(section).Where(p => TextOf(p).StartsWith(Unchecked, StringComparison.Ordinal));

        private static void TickOption(Paragraph paragraph, string option)
        {
            if (!ReplaceFirst(paragraph, $"{Unchecked} {option}", $"{Checked} {option}"))
            {
                throw TemplateMismatch($"checkbox '{option}'");
            }
        }

        private static void ReplaceUnderscores(Paragraph paragraph, string value)
        {
            foreach (var text in paragraph.Descendants<Text>())
            {
                var replaced = Underscores().Replace(text.Text, value.Trim(), 1);

                if (replaced != text.Text)
                {
                    text.Text = replaced;
                    text.Space = SpaceProcessingModeValues.Preserve;
                    return;
                }
            }
        }

        private static bool ReplaceFirst(Paragraph paragraph, string search, string replacement)
        {
            foreach (var text in paragraph.Descendants<Text>())
            {
                var index = text.Text.IndexOf(search, StringComparison.Ordinal);

                if (index >= 0)
                {
                    text.Text = string.Concat(text.Text.AsSpan(0, index), replacement, text.Text.AsSpan(index + search.Length));
                    text.Space = SpaceProcessingModeValues.Preserve;
                    return true;
                }
            }

            return false;
        }

        private static string TextOf(OpenXmlElement element) =>
            string.Concat(element.Descendants<Text>().Select(t => t.Text)).Trim();

        private static string? FormatDate(DateTime? value) =>
            value?.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture);

        private static string FormatDateTime(DateTime value) =>
            value.ToString("MM/dd/yyyy hh:mm tt", CultureInfo.InvariantCulture) + " UTC";

        private static string? CityStateZip(string? city, string? state, string? zip)
        {
            var cityState = string.Join(", ", new[] { city, state }.Where(v => !string.IsNullOrWhiteSpace(v)).Select(v => v!.Trim()));
            var result = string.Join(" ", new[] { cityState, zip?.Trim() }.Where(v => !string.IsNullOrWhiteSpace(v)));
            return string.IsNullOrWhiteSpace(result) ? null : result;
        }

        private static InvalidOperationException TemplateMismatch(string what) =>
            new($"Consent template structure changed: could not find {what}.");

        [GeneratedRegex(@"^(\d+)\.\s+\S")]
        private static partial Regex SectionHeading();

        [GeneratedRegex(@"^data:image/(?<type>png|jpe?g);base64,(?<data>.+)$", RegexOptions.IgnoreCase | RegexOptions.Singleline)]
        private static partial Regex DataUrl();

        [GeneratedRegex("_{5,}")]
        private static partial Regex Underscores();
    }
}
