using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterUserAsync(RegisterUserDto dto, CancellationToken token)
    {
        try
        {
            var result = await _authService.RegisterUserAsync(dto, token);
            return Ok(result);
        }catch (InvalidOperationException ex)
        {
            return BadRequest(new { Error = ex.Message });
        }

    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LoginUserAsync([FromBody] LoginUserDto dto, CancellationToken token)
    {
        try
        {
            var result = await _authService.LoginUserAsync(dto, token);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }

    }

    [HttpPost("guest")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateGuestSession()
    {
        try
        {
            var result = await _authService.CreateGuestSessionAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = "failed to create guest session: " + ex.Message });
        }
    }
    
    

}