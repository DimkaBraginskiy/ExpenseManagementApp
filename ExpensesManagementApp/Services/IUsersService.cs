using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;

namespace ExpensesManagementApp.Services;

public interface IUsersService
{
    public Task<IEnumerable<UserResponseDto>> GetAllUsersAsync(CancellationToken token);
    public Task CreateUserAsync(CancellationToken token, AddUserRequestDto dto);
}