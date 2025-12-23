using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;

namespace ExpensesManagementApp.Services;

public interface IUsersService
{
    public Task<IEnumerable<UserResponseDto>> GetAllUsersAsync(CancellationToken token);
    public Task CreateUserAsync(CancellationToken token, RegisterUserDto dto);
    public Task<bool> DeleteUserAsync(CancellationToken token, int id);
}