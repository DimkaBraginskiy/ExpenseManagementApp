using System.ComponentModel.DataAnnotations;
using ExpensesManagementApp.Core.Models;
using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Infrastructure.Mapper;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class UsersService : IUsersService
{
    private readonly AppDbContext _context;
    private readonly UserManager<User> _userManager;

    public UsersService(AppDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IEnumerable<UserDetailedResponseDto>> GetAllUsersAsync(CancellationToken token)
    {
        var users = await _context.Users
            .Where(u => !u.IsDeleted)
            .ToListAsync(token);

        List<UserDetailedResponseDto> response = new List<UserDetailedResponseDto>();

        foreach (var user in users)
        {
            var dto = new UserDetailedResponseDto()
            {
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                AccountCreationDate = user.AccountCreationDate
            };
            response.Add(dto);
        }

        return response;
    }

    public async Task<UserDetailedResponseDto> getUserByIdAsync(CancellationToken token, int userId)
    {
        if (userId.Equals(null))
        {
            throw new ArgumentException("userId can not be null");
        }

        var user = await _context.Users.Where(u => u.Id == userId).FirstOrDefaultAsync(token);

        if (user.Equals(null))
        {
            throw new ArgumentException("User not found");
        }

        var userDto = UserMapper.toDto(token, user);

        return userDto;
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
    
    
    public async Task<bool> DeleteUserByIdAsync(CancellationToken token, int id)
    {
        var user = await _context.Users.
            Where(u => u.Id == id).
            FirstOrDefaultAsync(token);
        
        if (user == null)
        {
            return false;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(token);
        return true;
    }

    public async Task<bool> DeleteUserByEmailAsync(CancellationToken token, string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), token);

        if (user == null) return false;

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(token);
        return true;
    }

    public async Task<UserDetailedResponseDto> UpdateUserByEmailAsync(CancellationToken token, string email,
        RegisterUserDto dto)
    { 
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), token);
        if (user == null) 
        { 
            throw new ArgumentException($"User with email {email} not found.");
        }
        
        if (dto.Email.ToLower() != email.ToLower()) 
        { 
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != user.Id, token);

            if (emailExists)
            {
                throw new ArgumentException($"Email {dto.Email} already exists.");
            }
        }
        
        if (dto.UserName != user.UserName) 
        {
            var usernameExists = await _context.Users
                .AnyAsync(u => u.UserName.ToLower() == dto.UserName.ToLower() && u.Id != user.Id, token);

            if (usernameExists) 
            { 
                throw new ArgumentException($"Username '{dto.UserName}' is already taken.");
            }
        }
        user.Email = dto.Email; 
        user.UserName = dto.UserName;
        user.NormalizedEmail = dto.Email.ToUpper();
        user.NormalizedUserName = dto.UserName.ToUpper();

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to update user: {errors}");
        }
            
        return new UserDetailedResponseDto
        {
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            AccountCreationDate = user.AccountCreationDate
        };
    }

    public async Task<UserDetailedResponseDto> GetUserByEmailAsync(CancellationToken token, string email)
    {
        var res = await _context.Users
            .Where(u => u.Email.ToLower() == email.ToLower())
            .FirstOrDefaultAsync(token);

        if (res == null)
        {
            throw new ArgumentException($"User with email {email} not found");
        }

        var dto = new UserDetailedResponseDto()
        {
            Email = res.Email,
            UserName = res.UserName,
            PhoneNumber = res.PhoneNumber,
            AccountCreationDate = res.AccountCreationDate
        };

        return dto;
    }

    public async Task<IEnumerable<UserRegistrationStatsResponseDto>> GetAllUserRegistrationStatAsync(
        CancellationToken token)
    {
        var currentYear =  DateTime.UtcNow.Year;
        
        var years = await _context.Users
            .Where(u => !u.IsDeleted
                        && u.AccountCreationDate != DateTime.MinValue
                        && u.AccountCreationDate != DateTime.MaxValue
                        && u.AccountCreationDate.Year >= 2000
                        && u.AccountCreationDate.Year <= currentYear + 10)
            .GroupBy(u => new
            {
                Year = u.AccountCreationDate.Year,
                Month = u.AccountCreationDate.Month
            })
            .Select(g => new UserRegistrationStatsResponseDto()
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Registrations = g.Count()
            }).ToListAsync(token);

        return years;
    }
}