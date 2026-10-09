using ElectronicSignature.API.Data.Repositories.Interfaces;
using ElectronicSignature.API.Models;
using ElectronicSignature.API.Online.DTOs.Exhibitor;
using ElectronicSignature.API.Online.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace ElectronicSignature.API.Online.Services.Implementations;

public class ExhibitorService : IExhibitorService
{
    private readonly IExhibitorRepository _exhibitorRepository;
    private readonly PasswordHasher<Exhibitor> _passwordHasher = new();
    private static readonly HashSet<string> AllowedExhibitorTypes = new(StringComparer.Ordinal)
    {
        "Junior",
        "Open"
    };

    public ExhibitorService(IExhibitorRepository exhibitorRepository)
    {
        _exhibitorRepository = exhibitorRepository;
    }

    public async Task<ExhibitorRegistrationResult> RegisterAsync(RegisterExhibitorRequest request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
        if (string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(normalizedEmail) ||
            string.IsNullOrWhiteSpace(request.Phone) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return new ExhibitorRegistrationResult(false, false, null, "All required fields must be provided.");
        }

        if (!AllowedExhibitorTypes.Contains(request.ExhibitorType))
        {
            return new ExhibitorRegistrationResult(false, false, null, "Exhibitor type must be Junior or Open.");
        }

        var existingExhibitor = await _exhibitorRepository.GetByEmailAsync(normalizedEmail);
        if (existingExhibitor != null)
        {
            return new ExhibitorRegistrationResult(false, true, null, null);
        }

        var exhibitor = new Exhibitor
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            Phone = request.Phone.Trim(),
            ExhibitorType = request.ExhibitorType,
            Organization = request.Organization?.Trim(),
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        exhibitor.PasswordHash = _passwordHasher.HashPassword(exhibitor, request.Password);

        await _exhibitorRepository.AddAsync(exhibitor);
        await _exhibitorRepository.SaveChangesAsync();

        var response = new RegisterExhibitorResponse
        {
            Message = "Exhibitor registered successfully.",
            ExhibitorId = exhibitor.Id
        };

        return new ExhibitorRegistrationResult(true, false, response, null);
    }

    public async Task<ExhibitorProfileResponse?> GetProfileAsync(int exhibitorId)
    {
        var exhibitor = await _exhibitorRepository.GetByIdAsync(exhibitorId);
        return exhibitor is null ? null : MapProfile(exhibitor);
    }

    public async Task<ExhibitorProfileUpdateResult> UpdateProfileAsync(
        int exhibitorId,
        UpdateExhibitorProfileRequest request)
    {
        var exhibitor = await _exhibitorRepository.GetByIdAsync(exhibitorId);
        if (exhibitor is null)
        {
            return new ExhibitorProfileUpdateResult(false, false, null, "Profile was not found.");
        }

        var fullName = request.FullName.Trim();
        var nameParts = fullName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        if (nameParts.Length < 2)
        {
            return new ExhibitorProfileUpdateResult(
                false,
                false,
                null,
                "Full name must include a first and last name.");
        }

        var normalizedEmail = NormalizeEmail(request.Email);
        var existingExhibitor = await _exhibitorRepository.GetByEmailAsync(normalizedEmail);
        if (existingExhibitor is not null && existingExhibitor.Id != exhibitorId)
        {
            return new ExhibitorProfileUpdateResult(false, true, null, null);
        }

        exhibitor.FirstName = nameParts[0];
        exhibitor.LastName = nameParts[1];
        exhibitor.Email = normalizedEmail;
        exhibitor.Phone = request.Phone.Trim();
        exhibitor.Address = request.Address.Trim();
        exhibitor.City = request.City.Trim();
        exhibitor.State = request.State.Trim();
        exhibitor.Zip = request.Zip.Trim();

        if (string.Equals(exhibitor.ExhibitorType, "Junior", StringComparison.Ordinal))
        {
            exhibitor.DateOfBirth = request.DateOfBirth;
            exhibitor.Age = request.Age;
            exhibitor.ClubAffiliation = NormalizeOptional(request.ClubAffiliation);
            exhibitor.ClubName = NormalizeOptional(request.ClubName);
            exhibitor.ClubChapterNumber = NormalizeOptional(request.ClubChapterNumber);
            exhibitor.CountyDistrict = NormalizeOptional(request.CountyDistrict);
            exhibitor.ParentGuardianName = NormalizeOptional(request.ParentGuardianName);
            exhibitor.ParentGuardianRelationship = NormalizeOptional(request.ParentGuardianRelationship);
            exhibitor.ParentGuardianPhone = NormalizeOptional(request.ParentGuardianPhone);
            exhibitor.ParentGuardianEmail = NormalizeOptional(request.ParentGuardianEmail)?.ToLowerInvariant();
        }

        await _exhibitorRepository.SaveChangesAsync();

        return new ExhibitorProfileUpdateResult(true, false, MapProfile(exhibitor), null);
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static ExhibitorProfileResponse MapProfile(Exhibitor exhibitor)
    {
        var isJunior = string.Equals(exhibitor.ExhibitorType, "Junior", StringComparison.Ordinal);

        return new ExhibitorProfileResponse
        {
            FullName = $"{exhibitor.FirstName} {exhibitor.LastName}".Trim(),
            Email = exhibitor.Email,
            Phone = exhibitor.Phone,
            ExhibitorType = exhibitor.ExhibitorType,
            Address = exhibitor.Address,
            City = exhibitor.City,
            State = exhibitor.State,
            Zip = exhibitor.Zip,
            DateOfBirth = isJunior ? exhibitor.DateOfBirth : null,
            Age = isJunior ? exhibitor.Age : null,
            ClubAffiliation = isJunior ? exhibitor.ClubAffiliation : null,
            ClubName = isJunior ? exhibitor.ClubName : null,
            ClubChapterNumber = isJunior ? exhibitor.ClubChapterNumber : null,
            CountyDistrict = isJunior ? exhibitor.CountyDistrict : null,
            ParentGuardianName = isJunior ? exhibitor.ParentGuardianName : null,
            ParentGuardianRelationship = isJunior ? exhibitor.ParentGuardianRelationship : null,
            ParentGuardianPhone = isJunior ? exhibitor.ParentGuardianPhone : null,
            ParentGuardianEmail = isJunior ? exhibitor.ParentGuardianEmail : null
        };
    }
}
