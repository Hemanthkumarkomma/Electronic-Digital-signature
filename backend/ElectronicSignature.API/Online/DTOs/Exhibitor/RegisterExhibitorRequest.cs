namespace ElectronicSignature.API.Online.DTOs.Exhibitor;

public class RegisterExhibitorRequest
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string ExhibitorType { get; set; } = string.Empty;

    public string? Organization { get; set; }

    public string Password { get; set; } = string.Empty;
}
