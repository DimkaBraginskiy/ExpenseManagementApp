using System.ComponentModel.DataAnnotations;
using ExpensesManagementApp.Core.Models;
using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class UsersService : IUsersService
{
    private readonly AppDbContext _context;

    public UsersService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync(CancellationToken token)
    {
        var users = await _context.Users.ToListAsync(token);

        List<UserResponseDto> response = new List<UserResponseDto>();

        foreach (var user in users)
        {
            UserResponseDto dto = new UserResponseDto()
            {
                Email = user.Email,
                AccountCreationDate = user.AccountCreationDate
            };
            response.Add(dto);
        }

        return response;
    }

    public async Task CreateUserAsync(CancellationToken token, RegisterUserDto dto)
    {
        //1. check if the data in dto exists and valid
        //2. convert dto to model
        //3. save the model data to context db

        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ValidationException("Email or Login or Password is incorrect or empty.");
        }

        var user = new User()
        {
            Email = dto.Email,
            PasswordHash = dto.Password,
            AccountCreationDate = DateTime.Now
        };

        
        _context.Users.Add(user);
        await _context.SaveChangesAsync(token);
    }
    
    
    public async Task<bool> DeleteUserAsync(CancellationToken token, int id)
    {
        var expense = await _context.Expenses.FindAsync(new object?[] { id }, token);
        if (expense == null)
        {
            return false;
        }

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync(token);
        return true;
    }
}