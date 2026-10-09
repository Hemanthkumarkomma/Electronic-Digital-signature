using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ElectronicSignature.API.Data.Repositories.Interfaces;
using ElectronicSignature.API.Models;
using ElectronicSignature.API.Online.DTOs.Auth;
using ElectronicSignature.API.Online.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace ElectronicSignature.API.Online.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IExhibitorRepository _exhibitorRepository;
    private readonly PasswordHasher<Exhibitor> _passwordHasher = new();

    public AuthService(IConfiguration configuration, IExhibitorRepository exhibitorRepository)
    {
        _configuration = configuration;
        _exhibitorRepository = exhibitorRepository;
    }

    public async Task<LoginResponse?> LoginAsync(string email, string password)
    {
        var normalizedEmail = NormalizeEmail(email);
        if (string.IsNullOrWhiteSpace(normalizedEmail) || string.IsNullOrWhiteSpace(password))
        {
            return null;
        }

        var exhibitor = await _exhibitorRepository.GetByEmailAsync(normalizedEmail);
        if (exhibitor is null)
        {
            return null;
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(exhibitor, exhibitor.PasswordHash, password);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return null;
        }

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = jwtSettings["Key"] ?? "TexasAnimalShowcaseDevelopmentKey1234567890";
        var issuer = jwtSettings["Issuer"] ?? "TexasAnimalShowcase";
        var audience = jwtSettings["Audience"] ?? "TexasAnimalShowcaseClients";
        var expiryMinutes = int.TryParse(jwtSettings["ExpiryMinutes"], out var minutes) ? minutes : 120;

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, exhibitor.Email),
            new Claim(ClaimTypes.Email, exhibitor.Email),
            new Claim(ClaimTypes.Name, GetFullName(exhibitor)),
            new Claim(ClaimTypes.Role, "Exhibitor"),
            new Claim("userId", exhibitor.Id.ToString()),
            new Claim("exhibitorType", exhibitor.ExhibitorType)
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: signingCredentials);

        return new LoginResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAtUtc = token.ValidTo,
            Email = exhibitor.Email,
            FullName = GetFullName(exhibitor),
            Role = "Exhibitor",
            ExhibitorType = exhibitor.ExhibitorType
        };
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static string GetFullName(Exhibitor exhibitor)
    {
        return $"{exhibitor.FirstName} {exhibitor.LastName}".Trim();
    }
}
