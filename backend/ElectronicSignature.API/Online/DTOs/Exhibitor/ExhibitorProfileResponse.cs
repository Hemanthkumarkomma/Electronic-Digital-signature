namespace ElectronicSignature.API.Online.DTOs.Exhibitor;

public class ExhibitorProfileResponse
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string ExhibitorType { get; set; } = string.Empty;

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Zip { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public int? Age { get; set; }

    public string? ClubAffiliation { get; set; }

    public string? ClubName { get; set; }

    public string? ClubChapterNumber { get; set; }

    public string? CountyDistrict { get; set; }

    public string? ParentGuardianName { get; set; }

    public string? ParentGuardianRelationship { get; set; }

    public string? ParentGuardianPhone { get; set; }

    public string? ParentGuardianEmail { get; set; }
}
