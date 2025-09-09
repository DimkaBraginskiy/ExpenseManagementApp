using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Services;

public interface IExpensesService
{
    public Task<ExpenseResponseDto> CreateExpenseAsync(CancellationToken token, int userId, ExpenseRequestDto dto);
}