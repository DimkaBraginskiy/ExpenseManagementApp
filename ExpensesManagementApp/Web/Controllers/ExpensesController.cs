using System.Security.Claims;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
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

    [HttpGet("")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetAllExpensesByUserIdAsync(CancellationToken token)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;


        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { Error = "Invalid user" });    
        }

        
        try
        {
            var expenses = await _expensesService.GetAllExpensesByUserIdAsync(token, userId);

            return Ok(expenses);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpGet("id/{id}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<ExpenseResponseDto>> GetExpenseByIdAsync(CancellationToken token, int id)
    {
        var result = await _expensesService.GetUserByIdAsync(token, id);

        if (result.Equals(null))
        {
            throw new ArgumentException($"No Expense found with id {id}");
        }

        return Ok(result);
    }
    
        

    [HttpGet("category/{categoryName}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetExpensesByCategoryNameAsync(
        CancellationToken token, string categoryName)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { Error = "Invalid user" });    
        }
        
        Console.WriteLine($"User id :{userId}");
        
        try
        {
            if (string.IsNullOrEmpty(categoryName))
            {
                throw new ArgumentException("Category name can not be null or empty");
            }

            var result = await _expensesService.GetExpensesByCategoryNameAndUserIdAsync(token, categoryName, userId);

            if (!result.Any())
            {
                throw new ArgumentException($"No expenses found by category {categoryName}");
            }

            return Ok(result);
        }catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("dateRange")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetExpensesByDateRangeAsync(
        CancellationToken token,
        [FromQuery] DateTimeOffset startDate,
        [FromQuery] DateTimeOffset endDate)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { Error = "Invalid user" });    
        }
        
        try
        {
            if(startDate.Equals(null) || endDate.Equals(null))
            {
                throw new ArgumentException("Start of End date can not be null");
            }

            var startDateTime = startDate.Date.ToUniversalTime();
            var endDateTime = endDate.Date.ToUniversalTime();

            var result = await _expensesService.GetExpensesByDateRangeAsync(token, startDateTime, endDateTime);

            if (!result.Any())
            {
                throw new ArgumentException($"No expenses found for time range from {startDate} to {endDate}");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }



    }
    
    [HttpGet("issuer/{issuerName}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetExpensesByIssuerAsync(CancellationToken token, string issuerName)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { Error = "Invalid user" });    
        }

        if (string.IsNullOrEmpty(issuerName))
        {
            throw new ArgumentException("Issuer name can not be null or empty");
        }

        try
        {
            var result = await _expensesService.GetExpensesByIssuerAsync(token, issuerName);

            if (!result.Any())
            {
                throw new ArgumentException($"Could not found any expenses related to issuer name: {issuerName} ");
            }
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateExpenseAsync(CancellationToken token, [FromBody] ExpenseRequestDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"userIdClaim: {userIdClaim}");
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

    [HttpDelete("id/{id}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> DeleteExpenseAsync(CancellationToken token, int id)
    {
        try
        {
            var result = await _expensesService.DeleteExpenseAsync(token, id);

            if (result)
            {
                return Ok($"Expense with id {id} deleted successfully");
            }

            return BadRequest($"Could not delete expense with id {id}");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}