using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Services;

public interface IExpensesService
{
    public Task<List<ExpenseResponseDto>> GetAllExpensesByUserIdAsync(CancellationToken token, int id);
    public Task<ExpenseMinimalResponseDto> CreateExpenseAsync(CancellationToken token, int userId, ExpenseRequestDto dto);

    public Task<IEnumerable<ExpenseResponseDto>> GetExpensesByCategoryNameAndUserIdAsync(CancellationToken token,
        string categoryName, int userId);

    public Task<IEnumerable<ExpenseResponseDto>> GetExpensesByDateRangeAsync(
        CancellationToken token, DateTime startDate, DateTime endDate);

    public Task<IEnumerable<ExpenseResponseDto>> GetExpensesByIssuerAsync(CancellationToken token, string issuerName);

    public Task<bool> DeleteExpenseAsync(CancellationToken token, int id);
    public Task<ExpenseResponseDto> GetUserByIdAsync(CancellationToken token, int id);
    public Task<ExpenseResponseDto> UpdateExpenseAsync(CancellationToken token, int id, ExpenseRequestDto dto);
}