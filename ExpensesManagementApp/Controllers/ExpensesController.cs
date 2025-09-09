using System.Security.Claims;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;

namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly IExpensesService _expensesService;

    public ExpensesController(IExpensesService expensesService)
    {
        _expensesService = expensesService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateExpenseAsync(CancellationToken token, [FromBody] ExpenseRequestDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out int userId) == false)
            return Unauthorized(new { Error = "Invalid user" });
        
        try
        {
            var expense = await _expensesService.CreateExpenseAsync(token, userId, dto);
            
            return Ok(new { Id = expense.Id, Message = "Expense created successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("unique") == true)
        {
            return BadRequest(new { Error = "Duplicate name detected—names must be unique" });
        }
        catch (Exception ex)
        {
            // Log ex (use ILogger if injected)
            return StatusCode(500, new { Error = "Internal server error" });
        }
    }
}