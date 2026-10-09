using ElectronicSignature.API.Models;

namespace ElectronicSignature.API.Online.Services.Interfaces;

public interface IConsentPdfService
{
    /// <summary>
    /// Fills the Open or Junior DOCX template (selected by ExhibitorType) with the
    /// stored submission and signature, and returns the rendered PDF bytes.
    /// The record is rendered as Approved.
    /// </summary>
    Task<byte[]> GenerateApprovedPdfAsync(ConsentForm form, CancellationToken cancellationToken = default);
}
