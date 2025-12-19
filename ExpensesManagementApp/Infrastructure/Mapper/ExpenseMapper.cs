using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;

namespace ExpensesManagementApp.Infrastructure.Mapper;

public class ExpenseMapper
{
    public static async Task<ExpenseResponseDto> toDto(CancellationToken token, Expense expense)
    {
        var categoryName = string.IsNullOrWhiteSpace(expense.Category?.Name)
            ? "None"
            : expense.Category.Name.Trim();
            
        var currencyName = string.IsNullOrWhiteSpace(expense.Currency?.Name)
            ? "None"
            : expense.Currency.Name.Trim();

        var issuerName = string.IsNullOrWhiteSpace(expense.Issuer?.Name)
            ? "None"
            : expense.Issuer.Name.Trim();

        var exp = new ExpenseResponseDto()
        {
            Amount = expense.Amount,
            Date = expense.Date,
            Description = expense.Description,
            Category = new CategoryResponseDto()
            {
                Name = categoryName
            },
            Issuer = new IssuerResponseDto()
            {
                Name = issuerName
            },
            Currency = new CurrencyResponseDto()
            {
                Name = currencyName
            }
        };

        return exp;
    }

    public static async Task<Expense> toEntity(CancellationToken token, 
        ExpenseRequestDto dto, int userId, Category category, Currency currency, Issuer issuer)
    {
        var expense = new Expense()
        {
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            UserId = userId,
            Category = category,
            Currency = currency
        };


        return expense;
    }
}