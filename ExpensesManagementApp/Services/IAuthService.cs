using ExpensesManagementApp.DTOs.Request;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Services;

public interface IAuthService
{
    public Task<IActionResult> RegisterUserAsync(RegisterUserDto dto, CancellationToken cancellationToken);
    public Task<IActionResult> LoginUserAsync(LoginUserDto dto, CancellationToken cancellationToken);
}