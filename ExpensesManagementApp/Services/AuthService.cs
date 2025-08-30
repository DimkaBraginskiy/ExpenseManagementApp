using System.ComponentModel.DataAnnotations;
using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly UserManager<User> _userManager;

    public AuthService(AppDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> RegisterUserAsync(RegisterUserDto dto, CancellationToken token)
    {
        //1. Validate data - validated in dto
        
        //2. Check whether email already exists
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email, token))
        {
            throw new InvalidOperationException("Email already exists in the system!");
        }
        //3. Save to db
        var user = new User()
        {
            Email = dto.Email,
            UserName = dto.Email
        };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return new BadRequestObjectResult(result.Errors);
        }
        return new OkObjectResult("User registered successfully!");
    }
}