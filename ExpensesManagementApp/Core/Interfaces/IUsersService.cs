using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Services;

public interface IUsersService
{
    public Task<IEnumerable<UserDetailedResponseDto>> GetAllUsersAsync(CancellationToken token);
    public Task<UserDetailedResponseDto> getUserByIdAsync(CancellationToken token, int userId);
    public Task CreateUserAsync(CancellationToken token, RegisterUserDto dto);
    public Task<bool> DeleteUserByIdAsync(CancellationToken token, int id);
    public Task<bool> DeleteUserByEmailAsync(CancellationToken token, string email);

    public Task<UserDetailedResponseDto> UpdateUserByEmailAsync(CancellationToken token, string email, RegisterUserDto dto);
}