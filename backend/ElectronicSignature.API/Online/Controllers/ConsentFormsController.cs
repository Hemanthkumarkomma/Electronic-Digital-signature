using ElectronicSignature.API.Data;
using ElectronicSignature.API.Models;
using ElectronicSignature.API.Online.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace ElectronicSignature.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConsentFormsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ConsentFormsController> _logger;
    private readonly IWebHostEnvironment _environment;
    private readonly IConsentPdfService _consentPdfService;

    public ConsentFormsController(
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<ConsentFormsController> logger,
        IWebHostEnvironment environment,
        IConsentPdfService consentPdfService)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _environment = environment;
        _consentPdfService = consentPdfService;
    }

    [HttpGet("junior-eligibility")]
    public IActionResult GetJuniorEligibility()
    {
        var minimumAge =
            _configuration.GetValue<int?>("JuniorEligibility:MinAge");
        var maximumAge =
            _configuration.GetValue<int?>("JuniorEligibility:MaxAge");

        if (minimumAge is null ||
            maximumAge is null ||
            minimumAge < 0 ||
            maximumAge < minimumAge)
        {
            _logger.LogError(
                "Junior age eligibility is not configured correctly. " +
                "Set JuniorEligibility:MinAge and JuniorEligibility:MaxAge in appsettings " +
                "(or env vars JuniorEligibility__MinAge / JuniorEligibility__MaxAge). " +
                "Current values: MinAge={MinAge}, MaxAge={MaxAge}",
                minimumAge,
                maximumAge);

            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                new
                {
                    code = "JUNIOR_ELIGIBILITY_NOT_CONFIGURED",
                    message = "Junior eligibility could not be verified. Please contact the administrator."
                });
        }

        return Ok(new { minAge = minimumAge, maxAge = maximumAge });
    }

    // =====================================================
    // POST
    // Save consent form
    // =====================================================

    [HttpPost]
    public async Task<IActionResult> CreateConsentForm(
        [FromBody] ConsentForm consentForm)
    {
        if (consentForm == null)
        {
            return BadRequest(new
            {
                message = "Consent form data is required."
            });
        }

        // Get logged-in user ID from JWT
        var userId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new
            {
                message =
                    "Logged-in user could not be identified."
            });
        }

        // NEVER trust UserId from Angular
        consentForm.UserId = userId;

        var authenticatedType =
            User.FindFirst("exhibitorType")?.Value;

        var exhibitorType =
            string.Equals(authenticatedType, "Junior", StringComparison.OrdinalIgnoreCase)
                ? "Junior"
                : string.Equals(authenticatedType, "Open", StringComparison.OrdinalIgnoreCase)
                    ? "Open"
                    : null;

        if (exhibitorType is null)
        {
            return Forbid();
        }

        if (!string.Equals(
                consentForm.ExhibitorType,
                exhibitorType,
                StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "The submitted exhibitor type does not match the authenticated account."
            });
        }

        consentForm.ExhibitorType = exhibitorType;

        if (exhibitorType == "Junior")
        {
            var minimumAge =
                _configuration.GetValue<int?>("JuniorEligibility:MinAge");

            var maximumAge =
                _configuration.GetValue<int?>("JuniorEligibility:MaxAge");

            if (minimumAge is null ||
                maximumAge is null ||
                minimumAge < 0 ||
                maximumAge < minimumAge)
            {
                _logger.LogError(
                    "Junior age eligibility is not configured correctly. " +
                    "Set JuniorEligibility:MinAge and JuniorEligibility:MaxAge in appsettings " +
                    "(or env vars JuniorEligibility__MinAge / JuniorEligibility__MaxAge). " +
                    "Current values: MinAge={MinAge}, MaxAge={MaxAge}. UserId={UserId}",
                    minimumAge,
                    maximumAge,
                    userId);

                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable,
                    new
                    {
                        code = "JUNIOR_ELIGIBILITY_NOT_CONFIGURED",
                        message =
                            "Junior eligibility could not be verified. Please contact the administrator."
                    });
            }

            var validationErrors =
                ValidateJuniorSubmission(
                    consentForm,
                    minimumAge.Value,
                    maximumAge.Value);

            if (validationErrors.Count > 0)
            {
                return BadRequest(new
                {
                    message = "The Junior consent form is incomplete or contains invalid information.",
                    errors = validationErrors
                });
            }
        }
        else
        {
            ClearJuniorOnlyFields(consentForm);
        }

        NormalizeRequiredStrings(consentForm);

        consentForm.SubmittedAt =
            DateTime.UtcNow;

        consentForm.Status =
            "Submitted";

        try
        {
            _context.ConsentForms.Add(
                consentForm
            );

            await _context.SaveChangesAsync();

            Console.WriteLine(
                $"CONSENT SAVED - UserId: {userId}, Id: {consentForm.Id}"
            );

            return Ok(new
            {
                message =
                    "Consent form submitted successfully.",

                id = consentForm.Id,

                userId = userId
            });
        }
        catch (Exception ex)
        {
            LogPersistenceError(
                "CONSENT SAVE ERROR",
                ex,
                userId,
                consentForm.ExhibitorType,
                consentForm);

            return StatusCode(
                500,
                BuildErrorResponse(
                    "Unable to save your consent form. Please try again.",
                    ex));
        }
    }

    // Common NOT NULL columns: a JSON null from the client must not break the INSERT.
    private static void NormalizeRequiredStrings(ConsentForm form)
    {
        form.EventName ??= string.Empty;
        form.EventLocation ??= string.Empty;
        form.Organization ??= string.Empty;
        form.ParticipantFullName ??= string.Empty;
        form.ParticipantPhone ??= string.Empty;
        form.ParticipantEmail ??= string.Empty;
        form.ParticipantAddress ??= string.Empty;
        form.ParticipantCity ??= string.Empty;
        form.ParticipantState ??= string.Empty;
        form.ParticipantZip ??= string.Empty;
        form.AnimalTypes ??= string.Empty;
        form.OtherAnimalType ??= string.Empty;
        form.AnimalName ??= string.Empty;
        form.Species ??= string.Empty;
        form.ExhibitorRole ??= string.Empty;
        form.OtherRole ??= string.Empty;
        form.Allergies ??= string.Empty;
        form.SpecialAssistance ??= string.Empty;
        form.EmergencyContactName ??= string.Empty;
        form.EmergencyContactPhone ??= string.Empty;
        form.PreferredHospital ??= string.Empty;
        form.SignatureMethod ??= string.Empty;
        form.SignatureData ??= string.Empty;
    }

    private void LogPersistenceError(
        string title,
        Exception ex,
        string? userId,
        string? exhibitorType,
        ConsentForm? entity = null)
    {
        Console.WriteLine(title);
        Console.WriteLine($"UserId: {userId}");
        Console.WriteLine($"ExhibitorType: {exhibitorType}");

        if (entity is not null)
        {
            Console.WriteLine(
                $"Entity: Event='{entity.EventName}', Participant='{entity.ParticipantFullName}', " +
                $"EventDate={entity.EventDate:O}, DOB={entity.DateOfBirth:O}, Age={entity.Age}, " +
                $"SignatureMethod='{entity.SignatureMethod}', SignatureLength={entity.SignatureData?.Length ?? 0}, " +
                $"ParticipantSignatureMethod='{entity.ParticipantSignatureMethod}', " +
                $"ParticipantSignatureLength={entity.ParticipantSignatureData?.Length ?? 0}");
        }

        Console.WriteLine(ex.ToString());

        if (ex.InnerException is not null)
        {
            Console.WriteLine("INNER EXCEPTION:");
            Console.WriteLine(ex.InnerException.ToString());
        }

        if (FindSqlException(ex) is { } sqlEx)
        {
            Console.WriteLine(
                $"SQL EXCEPTION: Number={sqlEx.Number}, State={sqlEx.State}, Message={sqlEx.Message}");
        }

        _logger.LogError(
            ex,
            "{Title}. UserId={UserId}, ExhibitorType={ExhibitorType}",
            title,
            userId,
            exhibitorType);
    }

    private object BuildErrorResponse(string message, Exception ex)
    {
        if (!_environment.IsDevelopment())
        {
            return new { message };
        }

        return new
        {
            message,
            detail = FindSqlException(ex)?.Message
                ?? ex.InnerException?.Message
                ?? ex.Message
        };
    }

    private static SqlException? FindSqlException(Exception? ex)
    {
        while (ex is not null)
        {
            if (ex is SqlException sqlException)
            {
                return sqlException;
            }

            ex = ex.InnerException;
        }

        return null;
    }

    private static Dictionary<string, string[]> ValidateJuniorSubmission(
        ConsentForm form,
        int minimumAge,
        int maximumAge)
    {
        var errors = new Dictionary<string, string[]>();

        void AddError(string field, string message)
        {
            errors[field] = [message];
        }

        if (form.DateOfBirth is null)
        {
            AddError(nameof(form.DateOfBirth), "Date of birth is required.");
        }
        else if (form.DateOfBirth.Value.Date > DateTime.UtcNow.Date)
        {
            AddError(nameof(form.DateOfBirth), "Date of birth cannot be in the future.");
        }

        if (form.EventDate is null)
        {
            AddError(nameof(form.EventDate), "Event date is required to verify Junior age eligibility.");
        }

        if (form.Age is null)
        {
            AddError(nameof(form.Age), "Age is required.");
        }
        else if (form.Age < minimumAge || form.Age > maximumAge)
        {
            AddError(
                nameof(form.Age),
                $"Age must be between {minimumAge} and {maximumAge}.");
        }

        if (form.DateOfBirth is not null && form.EventDate is not null)
        {
            if (form.DateOfBirth.Value.Date > form.EventDate.Value.Date)
            {
                AddError(nameof(form.DateOfBirth), "Date of birth must be on or before the event date.");
            }
            else
            {
                var calculatedAge = CalculateAgeOnDate(
                    form.DateOfBirth.Value.Date,
                    form.EventDate.Value.Date);

                if (form.Age is not null && form.Age != calculatedAge)
                {
                    AddError(
                        nameof(form.Age),
                        "Age must match the participant's date of birth on the event date.");
                }
                else if (calculatedAge < minimumAge || calculatedAge > maximumAge)
                {
                    AddError(
                        nameof(form.Age),
                        $"Participant must be between {minimumAge} and {maximumAge} years old on the event date.");
                }
            }
        }

        AddRequired(form.ClubAffiliation, nameof(form.ClubAffiliation), "Club affiliation is required.");
        AddRequired(form.ClubName, nameof(form.ClubName), "Club name is required.");
        AddRequired(form.ParentGuardianName, nameof(form.ParentGuardianName), "Parent / legal guardian name is required.");
        AddRequired(form.ParentGuardianRelationship, nameof(form.ParentGuardianRelationship), "Relationship to the Junior exhibitor is required.");

        if (string.IsNullOrWhiteSpace(form.ParentGuardianPhone))
        {
            AddError(nameof(form.ParentGuardianPhone), "Parent / legal guardian phone is required.");
        }
        else if (!Regex.IsMatch(form.ParentGuardianPhone.Trim(), "^[0-9]{10}$"))
        {
            AddError(nameof(form.ParentGuardianPhone), "Enter a valid 10-digit phone number.");
        }

        if (string.IsNullOrWhiteSpace(form.ParentGuardianEmail))
        {
            AddError(nameof(form.ParentGuardianEmail), "Parent / legal guardian email is required.");
        }
        else if (!MailAddress.TryCreate(form.ParentGuardianEmail.Trim(), out var email) ||
                 !string.Equals(
                     email.Address,
                     form.ParentGuardianEmail.Trim(),
                     StringComparison.OrdinalIgnoreCase))
        {
            AddError(nameof(form.ParentGuardianEmail), "Enter a valid email address.");
        }

        if (!string.IsNullOrWhiteSpace(form.ParentGuardianZip) &&
            !Regex.IsMatch(form.ParentGuardianZip.Trim(), "^[0-9]{5}$"))
        {
            AddError(nameof(form.ParentGuardianZip), "Enter a valid 5-digit ZIP code.");
        }

        if (form.ParentGuardianConsent != true)
        {
            AddError(nameof(form.ParentGuardianConsent), "Parent / guardian consent is required.");
        }

        if (form.JuniorParticipationAgreement != true)
        {
            AddError(nameof(form.JuniorParticipationAgreement), "Junior participation agreement is required.");
        }

        if (form.JuniorRulesAgreement != true)
        {
            AddError(nameof(form.JuniorRulesAgreement), "Safety / rules agreement is required.");
        }

        if (!form.SafetyAgreed)
        {
            AddError(nameof(form.SafetyAgreed), "The safety agreement is required.");
        }

        if (!form.ConsentAgreed)
        {
            AddError(nameof(form.ConsentAgreed), "The consent agreement is required.");
        }

        if (!form.FinalConsent)
        {
            AddError(nameof(form.FinalConsent), "Final consent is required.");
        }

        if (string.IsNullOrWhiteSpace(form.SignatureMethod) ||
            string.IsNullOrWhiteSpace(form.SignatureData))
        {
            AddError(nameof(form.SignatureData), "A saved parent / legal guardian digital signature is required.");
        }

        if (string.IsNullOrWhiteSpace(form.ParticipantSignatureMethod) ||
            string.IsNullOrWhiteSpace(form.ParticipantSignatureData))
        {
            AddError(
                nameof(form.ParticipantSignatureData),
                "A saved participant digital signature is required.");
        }

        return errors;

        void AddRequired(string? value, string field, string message)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                AddError(field, message);
            }
        }
    }

    private static int CalculateAgeOnDate(DateTime dateOfBirth, DateTime referenceDate)
    {
        var birthdayMonth = dateOfBirth.Month;
        var birthdayDay = dateOfBirth.Day;

        if (birthdayMonth == 2 &&
            birthdayDay == 29 &&
            !DateTime.IsLeapYear(referenceDate.Year))
        {
            birthdayDay = 28;
        }

        var age = referenceDate.Year - dateOfBirth.Year;
        if (referenceDate.Month < birthdayMonth ||
            (referenceDate.Month == birthdayMonth && referenceDate.Day < birthdayDay))
        {
            age--;
        }

        return age;
    }

    private static void ClearJuniorOnlyFields(ConsentForm form)
    {
        form.ClubAffiliation = null;
        form.ClubName = null;
        form.ClubChapterNumber = null;
        form.CountyDistrict = null;
        form.ParentGuardianName = null;
        form.ParentGuardianRelationship = null;
        form.ParentGuardianPhone = null;
        form.ParentGuardianEmail = null;
        form.ParentGuardianAddress = null;
        form.ParentGuardianCity = null;
        form.ParentGuardianState = null;
        form.ParentGuardianZip = null;
        form.ParentGuardianConsent = null;
        form.ParticipantSignatureMethod = null;
        form.ParticipantSignatureData = null;
        form.JuniorParticipationAgreement = null;
        form.JuniorRulesAgreement = null;
    }

    // =====================================================
    // GET
    // Get logged-in user's submissions
    // =====================================================

    [HttpGet("my-submissions")]
    public async Task<IActionResult> GetMySubmissions()
    {
        // Get the SAME user ID from JWT
        var userId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        Console.WriteLine(
            $"GET MY SUBMISSIONS - UserId: {userId}"
        );

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new
            {
                message =
                    "Logged-in user could not be identified."
            });
        }

        try
        {
            var submissions =
                await _context.ConsentForms
                    .AsNoTracking()
                    .Where(x =>
                        x.UserId == userId
                    )
                    .OrderByDescending(
                        x => x.SubmittedAt
                    )
                    .ToListAsync();

            Console.WriteLine(
                $"SUBMISSIONS FOUND: {submissions.Count}"
            );

            return Ok(submissions);
        }
        catch (Exception ex)
        {
            LogPersistenceError(
                "GET SUBMISSIONS ERROR",
                ex,
                userId,
                exhibitorType: User.FindFirst("exhibitorType")?.Value);

            return StatusCode(
                500,
                BuildErrorResponse(
                    "Unable to load your submissions. Please try again.",
                    ex));
        }
    }

    // =====================================================
    // POST
    // Approve own submission and download the completed
    // consent PDF (same endpoint re-downloads once Approved)
    // =====================================================

    [HttpPost("{id:int}/approve")]
    public async Task<IActionResult> ApproveSubmission(
        int id,
        CancellationToken cancellationToken)
    {
        const string pdfErrorMessage =
            "Unable to generate the consent form PDF. Please try again.";

        var userId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new
            {
                message =
                    "Logged-in user could not be identified."
            });
        }

        // Ownership is part of the query: another user's submission is simply "not found".
        var consentForm =
            await _context.ConsentForms
                .FirstOrDefaultAsync(
                    x => x.Id == id && x.UserId == userId,
                    cancellationToken);

        if (consentForm is null)
        {
            return NotFound(new
            {
                message = "Submission not found."
            });
        }

        byte[] pdf;

        try
        {
            pdf = await _consentPdfService.GenerateApprovedPdfAsync(
                consentForm,
                cancellationToken);
        }
        catch (Exception ex)
        {
            Console.WriteLine("CONSENT PDF GENERATION ERROR");
            Console.WriteLine($"SubmissionId: {id}, UserId: {userId}, ExhibitorType: {consentForm.ExhibitorType}");
            Console.WriteLine(ex.ToString());

            _logger.LogError(
                ex,
                "Consent PDF generation failed. SubmissionId={SubmissionId}, UserId={UserId}, ExhibitorType={ExhibitorType}",
                id,
                userId,
                consentForm.ExhibitorType);

            // Status is not changed when the PDF cannot be produced.
            return StatusCode(500, new { message = pdfErrorMessage });
        }

        if (!string.Equals(consentForm.Status, "Approved", StringComparison.OrdinalIgnoreCase))
        {
            consentForm.Status = "Approved";

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                LogPersistenceError(
                    "CONSENT APPROVE SAVE ERROR",
                    ex,
                    userId,
                    consentForm.ExhibitorType);

                return StatusCode(500, new { message = pdfErrorMessage });
            }
        }

        var fileName =
            $"Texas_Youth_Animal_Showcase_{consentForm.ExhibitorType}_{consentForm.Id}.pdf";

        return File(pdf, "application/pdf", fileName);
    }
}