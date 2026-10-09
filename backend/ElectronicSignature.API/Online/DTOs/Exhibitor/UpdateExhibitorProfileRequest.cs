using System.ComponentModel.DataAnnotations;

namespace ElectronicSignature.API.Online.DTOs.Exhibitor;

public class UpdateExhibitorProfileRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[0-9]{10}$")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    public string State { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^[0-9]{5}$")]
    public string Zip { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    [Range(0, 120)]
    public int? Age { get; set; }

    public string? ClubAffiliation { get; set; }

    public string? ClubName { get; set; }

    public string? ClubChapterNumber { get; set; }

    public string? CountyDistrict { get; set; }

    public string? ParentGuardianName { get; set; }

    public string? ParentGuardianRelationship { get; set; }

    [RegularExpression(@"^$|^[0-9]{10}$")]
    public string? ParentGuardianPhone { get; set; }

    [EmailAddress]
    public string? ParentGuardianEmail { get; set; }
}
