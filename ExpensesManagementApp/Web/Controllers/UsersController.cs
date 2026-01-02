using System.Security.Claims;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Mvc;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using Microsoft.AspNetCore.Authorization;


namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUsersService _usersService;
    
    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateUserAsync(CancellationToken token, [FromBody] RegisterUserDto dto)
    {
        try
        {
            _usersService.CreateUserAsync(token, dto);
            return Ok(new { message = "User has been created" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }


    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsersAsync(CancellationToken token)
    {
        try
        {
            var users = await _usersService.GetAllUsersAsync(token);
            return Ok(users);    
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDetailedResponseDto>> GetInfoAboutCurrentUserAsync(CancellationToken token)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;


        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { Error = "Invalid user" });    
        }

        try
        {
            var user = await _usersService.getUserByIdAsync(token, userId);

            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpDelete]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult> DeleteUserAsync(CancellationToken token, int id)
    {
        try
        {
            var res = _usersService.DeleteUserAsync(token, id);
            if (res.Result)
            {
                return Ok($"User with id {id} deleted successfully");
            }

            return BadRequest("Could not delete user");
        }catch(Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}