using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Services;

public interface IExpensesService
{
    public Task<IEnumerable<ExpenseResponseDto>> GetAllExpensesByUserIdAsync(CancellationToken token, int id);
    public Task<ExpenseMinimalResponseDto> CreateExpenseAsync(CancellationToken token, int userId, ExpenseRequestDto dto);

    public Task<IEnumerable<ExpenseResponseDto>> GetExpensesByCategoryNameAndUserIdAsync(CancellationToken token,
        string categoryName, int userId);
}