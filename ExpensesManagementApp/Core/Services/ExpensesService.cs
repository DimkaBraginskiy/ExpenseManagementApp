using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class ExpensesService : IExpensesService
{
    private readonly AppDbContext _context;

    public ExpensesService(AppDbContext context, IUsersService usersService)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExpenseResponseDto>> GetAllExpensesByUserIdAsync(CancellationToken token, int id)
    {
        var expenses =
            await _context.Expenses
                .Where(expense => expense.UserId == id)
                .Include(e => e.Category)
                .Include(e => e.Currency)
                .Include(e => e.Issuer)
                .ToListAsync(token);

        if (expenses.Count == 0)
        {
            throw new ArgumentException("No expenses found");
        }

        var expenseDtos = new List<ExpenseResponseDto>();
        
        foreach (var expense in expenses)
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
            
            expenseDtos.Add(exp);
        }

        return expenseDtos;
    }

    public async Task<ExpenseMinimalResponseDto> CreateExpenseAsync(CancellationToken token, int userId, ExpenseRequestDto dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Category.Name.ToLower().Trim(), token);
        
        if (category == null)
            throw new InvalidOperationException("Category does not exist");
        
        var currency = await _context.Currencies
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Currency.Name.ToLower().Trim(), token);
        
        if (currency == null)
            throw new InvalidOperationException("Currency does not exist");

        //for now optional not touching it
        var issuer = await _context.Issuers.FirstOrDefaultAsync(i => i.Name.ToLower() == dto.Issuer.Name.ToLower(), token);
        

        var expense = new Expense()
        {
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            UserId = userId,
            Category = category,
            Currency = currency
        };
        //expense.Products = products;

        await _context.Expenses.AddAsync(expense, token);
        await _context.SaveChangesAsync(token);

        return new ExpenseMinimalResponseDto()
        {
            Id = expense.Id
        };
    }

    public async Task<IEnumerable<ExpenseResponseDto>> GetExpensesByCategoryNameAndUserIdAsync(CancellationToken token, string categoryName, int userId)
    {
        if (!await _context.Categories.AnyAsync(c => c.Name.ToLower().Equals(categoryName.ToLower()), token))
        {
            throw new ArgumentException($"Category name {categoryName} does not exist!");
        }


        var expenses =
            await _context.Expenses
                .Where(e => e.Category.Name.ToLower() == categoryName.ToLower() && e.UserId == userId)
                .Include(expense => expense.Currency)
                .Include(expense => expense.Issuer)
                .ToListAsync(token);

        if (expenses.Count == 0)
        {
            throw new ArgumentException("No expenses found");
        }

        var expenseDtos = new List<ExpenseResponseDto>();
        
        foreach (var expense in expenses)
        {

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
            
            expenseDtos.Add(exp);
        }

        return expenseDtos;
    }

    public async Task<IEnumerable<ExpenseResponseDto>> GetExpensesByDateRangeAsync(
        CancellationToken token, DateTime startDate, DateTime endDate)
    {
        if (startDate > DateTime.Now || endDate > DateTime.Now)
        {
            throw new ArgumentException("Date can not be in the future");
        }

        if (startDate > endDate)
        {
            throw new ArgumentException($"start date {startDate} is ahead of end date {endDate}");
        }


        var expenses =
            await _context
                .Expenses
                .Where(e => e.Date >= startDate && e.Date <= endDate)
                .Include(e => e.Category)
                .Include(e => e.Currency)
                .Include(e => e.Issuer)
                .ToListAsync(token);
        
        var expenseDtos = new List<ExpenseResponseDto>();
        
        foreach (var expense in expenses)
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
            
            expenseDtos.Add(exp);
        }

        return expenseDtos;


    }
}