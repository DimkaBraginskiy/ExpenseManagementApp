using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Infrastructure.Mapper;
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

    public async Task<List<ExpenseResponseDto>> GetAllExpensesByUserIdAsync(CancellationToken token, int id)
    {
        var expenses =
            await _context.Expenses
                .Where(e => e.UserId == id)
                .Include(e => e.Category)
                .Include(e => e.Currency)
                .ToListAsync(token);

        if (expenses.Count == 0)
        {
            throw new ArgumentException("No expenses found");
        }

        var expenseDtos = new List<ExpenseResponseDto>();
        
        foreach (var expense in expenses)
        {
            var dto = ExpenseMapper.toDto(token, expense);
            
            expenseDtos.Add(dto.Result);
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
        
        // var issuer = await _context.Issuers
        //     .FirstOrDefaultAsync(i => i.Name.ToLower() == dto.Issuer.Name.ToLower().Trim(), token);
        // if (issuer == null)
        //     throw new InvalidOperationException("Issuer does not exist");
        
        // var productNames = dto.Products.Select(p => p.Name.ToLower().Trim()).Distinct().ToList();
        // var existingProducts = await _context.Products
        //     .Where(p => productNames.Contains(p.Name.ToLower()))
        //     .ToListAsync(token);
        //
        // var products = new List<Product>();
        // foreach (var productDto in dto.Products)
        // {
        //     var productNameLower = productDto.Name.ToLower().Trim();
        //     var product = existingProducts.FirstOrDefault(p => p.Name.ToLower() == productNameLower);
        //     if (product == null)
        //         throw new InvalidOperationException($"Product '{productDto.Name}' does not exist");
        //
        //     _context.Products.Attach(product);  // Mark as existing
        //     products.Add(product);
        // }
        
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
            var dto = ExpenseMapper.toDto(token, expense);
            
            expenseDtos.Add(dto.Result);
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
            var dto = ExpenseMapper.toDto(token, expense);
            
            expenseDtos.Add(dto.Result);
        }

        return expenseDtos;
    }

    public async Task<IEnumerable<ExpenseResponseDto>> GetExpensesByIssuerAsync(CancellationToken token, string issuerName)
    {
        var expenses =
            await _context.Expenses.Where(e => e.Issuer.Name == issuerName)
                    .ToListAsync(token);

        if (!expenses.Any())
        {
            throw new ArgumentException($"Could not found any expenses related to issuer name: {issuerName} ");
        }
        
        var expenseDtos = new List<ExpenseResponseDto>();
        
        foreach (var expense in expenses)
        {
            var dto = ExpenseMapper.toDto(token, expense);
            
            expenseDtos.Add(dto.Result);
        }

        return expenseDtos;

    }
}