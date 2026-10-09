using ElectronicSignature.API.Online.DTOs.Exhibitor;

namespace ElectronicSignature.API.Online.Services.Interfaces;

public interface IExhibitorService
{
    Task<ExhibitorRegistrationResult> RegisterAsync(RegisterExhibitorRequest request);
    Task<ExhibitorProfileResponse?> GetProfileAsync(int exhibitorId);
    Task<ExhibitorProfileUpdateResult> UpdateProfileAsync(
        int exhibitorId,
        UpdateExhibitorProfileRequest request);
}

public record ExhibitorRegistrationResult(
    bool Success,
    bool EmailAlreadyExists,
    RegisterExhibitorResponse? Response,
    string? ErrorMessage);

public record ExhibitorProfileUpdateResult(
    bool Success,
    bool EmailAlreadyExists,
    ExhibitorProfileResponse? Profile,
    string? ErrorMessage);
