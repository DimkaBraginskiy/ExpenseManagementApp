using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Services;

public interface IAuthService
{
    public Task<IActionResult> RegisterUserAsync(RegisterUserDto dto, CancellationToken cancellationToken);

    public Task<UserLoginResponseDto> LoginUserAsync(LoginUserDto dto, CancellationToken cancellationToken);
}