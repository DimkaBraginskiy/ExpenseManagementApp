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

        decimal totalAmount = 0;
        var productDtos = new List<ProductResponseDto>();
        
        foreach(var product in expense.Products)
        {
            var productDto = new ProductResponseDto()
            {
                Name = product.Name,
                Price = product.Price,
                Quantity = product.Quantity
            };
            totalAmount += productDto.Quantity * productDto.Price;
            
            productDtos.Add(productDto);
        }

        var exp = new ExpenseResponseDto()
        {
            Id = expense.Id,
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
            },
            Products = productDtos,
            TotalAmount = totalAmount
        };

        return exp;
    }

    public static async Task<Expense> toEntity(CancellationToken token, 
        ExpenseRequestDto dto, int userId, Category category, Currency currency, Issuer issuer)
    {
        var expense = new Expense()
        {
            Date = dto.Date,
            Description = dto.Description,
            UserId = userId,
            Category = category,
            Currency = currency
        };


        return expense;
    }
}