using ElectronicSignature.API.Online.DTOs.Auth;
using ElectronicSignature.API.Online.DTOs.Exhibitor;
using ElectronicSignature.API.Online.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectronicSignature.API.Online.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IExhibitorService _exhibitorService;

    public AuthController(IAuthService authService, IExhibitorService exhibitorService)
    {
        _authService = authService;
        _exhibitorService = exhibitorService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var result = await _authService.LoginAsync(request.Email, request.Password);
        if (result is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterExhibitorRequest request)
    {
        var result = await _exhibitorService.RegisterAsync(request);

        if (!result.Success && !string.IsNullOrWhiteSpace(result.ErrorMessage))
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        if (result.EmailAlreadyExists)
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        return Ok(result.Response);
    }
}
