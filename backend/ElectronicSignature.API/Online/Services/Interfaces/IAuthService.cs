using ElectronicSignature.API.Online.DTOs.Auth;

namespace ElectronicSignature.API.Online.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(string email, string password);
}
