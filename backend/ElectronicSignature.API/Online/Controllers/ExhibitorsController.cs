using System.Security.Claims;
using ElectronicSignature.API.Online.DTOs.Exhibitor;
using ElectronicSignature.API.Online.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectronicSignature.API.Online.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExhibitorsController : ControllerBase
{
    private readonly IExhibitorService _exhibitorService;

    public ExhibitorsController(IExhibitorService exhibitorService)
    {
        _exhibitorService = exhibitorService;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ExhibitorProfileResponse>> GetProfile()
    {
        if (!TryGetExhibitorId(out var exhibitorId))
        {
            return Unauthorized(new { message = "Logged-in user could not be identified." });
        }

        var profile = await _exhibitorService.GetProfileAsync(exhibitorId);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<ActionResult<ExhibitorProfileResponse>> UpdateProfile(
        [FromBody] UpdateExhibitorProfileRequest request)
    {
        if (!TryGetExhibitorId(out var exhibitorId))
        {
            return Unauthorized(new { message = "Logged-in user could not be identified." });
        }

        var result = await _exhibitorService.UpdateProfileAsync(exhibitorId, request);
        if (result.EmailAlreadyExists)
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        if (!result.Success)
        {
            return BadRequest(new { message = result.ErrorMessage ?? "Profile could not be updated." });
        }

        return Ok(result.Profile);
    }

    private bool TryGetExhibitorId(out int exhibitorId)
    {
        var value = User.FindFirstValue("userId");
        return int.TryParse(value, out exhibitorId);
    }
}
