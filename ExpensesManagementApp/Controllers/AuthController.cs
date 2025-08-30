using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> RegisterUserAsync(RegisterUserDto dto, CancellationToken token)
    {
        var result = await _authService.RegisterUserAsync(dto, token);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginUserAsync(LoginUserDto dto, CancellationToken token)
    {
        var result = await _authService.LoginUserAsync(dto, token);
        return Ok(result);
    }

}