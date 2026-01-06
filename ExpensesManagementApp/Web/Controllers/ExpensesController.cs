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
    [Authorize]
    public async Task<ActionResult<ExpenseResponseDto>> GetAllExpensesAsync(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var token = HttpContext.RequestAborted;
        
        var (userId, guestSessionId, _) = GetOwnerInfo();
        
        try
        { 
            var result = await _expensesService.GetAllExpensesPaginatedAsync(
                token, userId, guestSessionId, page, pageSize);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpGet("id/{id}")]
    [Authorize]
    public async Task<ActionResult<ExpenseResponseDto>> GetExpenseByIdAsync(CancellationToken token, int id)
    {
        var (userId, guestSessionId, _) = GetOwnerInfo();
        
        var result = await _expensesService.GetExpenseByIdAsync(token, id, userId, guestSessionId);

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
    [Authorize]
    public async Task<IActionResult> CreateExpenseAsync(CancellationToken token, [FromBody] ExpenseRequestDto dto)
    {
        var subClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value 
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(subClaim))
            return Unauthorized(new { Error = "Missing subject claim" });

        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        
        try
        {
            int? userId = null;
            Guid? guestSessionId = null;
            
            if (role == "Guest")
            {
                if (!Guid.TryParse(subClaim, out var guid))
                    return Unauthorized(new { Error = "Invalid guest session ID" });

                guestSessionId = guid;
            }
            else
            {
                if (!int.TryParse(subClaim, out var id))
                    return Unauthorized(new { Error = "Invalid user ID" });

                userId = id;
            }
            
            var expense = await _expensesService.CreateExpenseAsync(
                token, userId, guestSessionId, dto);
            
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
    [Authorize]
    public async Task<IActionResult> DeleteExpenseAsync(CancellationToken token, int id)
    {
        var (userId, guestSessionId, _) = GetOwnerInfo();
        
        try
        {
            var result = await _expensesService.DeleteExpenseAsync(token, id, userId, guestSessionId);

            if (result)
            {
                return Ok($"Expense with id {id} deleted successfully");
            }

            return NotFound(new { Error = "Expense not found or access denied" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("id/{id}")]
    [Authorize]
    public async Task<ActionResult<ExpenseResponseDto>> UpdateExpenseAsync(CancellationToken token, int id, ExpenseRequestDto dto)
    {
        var (userId, guestSessionId, _) = GetOwnerInfo();
        
        try
        {
            var res = await _expensesService.UpdateExpenseAsync(token, id, dto, userId, guestSessionId);
            
            return Ok(res);
        }
        catch (Exception ex)
        {
            return BadRequest("Could not update Expense: " + ex.Message);
        }
    }
    
    
    private (int? userId, Guid? guestSessionId, string role) GetOwnerInfo()
    {
        var subClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value 
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(subClaim))
            throw new UnauthorizedAccessException("Missing subject claim");
        
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";
        
        int? userId = null;
        Guid? guestSessionId = null;
        
        if (role == "Guest")
        {
            if (!Guid.TryParse(subClaim, out var guid))
                throw new UnauthorizedAccessException("Invalid guest session ID");
            guestSessionId = guid;
        }
        else 
        { 
            if (!int.TryParse(subClaim, out var id)) 
                throw new UnauthorizedAccessException("Invalid user ID"); 
            userId = id; 
        }
        
        return (userId, guestSessionId, role);
    }
}