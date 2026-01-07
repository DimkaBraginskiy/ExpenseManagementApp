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

    public async Task<PaginatedExpenseResponseDto> GetAllExpensesPaginatedAsync(
        CancellationToken token,
        int? userId,
        Guid? guestSessionId,
        int pageNumber,
        int pageSize,
        string sortBy,
        string sortDir,
        string? groupBy,
        string? dateRange
    )
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 10) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        var query = _context.Expenses
            .Include(e => e.Category)
            .Include(e => e.Currency)
            .Include(e => e.Products)
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(e => e.UserId == userId.Value);
        }
        else if (guestSessionId.HasValue)
        {
            query = query.Where(e => e.GuestSessionId == guestSessionId.Value);
        }
        else
        {
            throw new UnauthorizedAccessException("Invalid owner");
        }
        
        query = (sortBy.ToLower(), sortDir.ToLower()) switch
        {
            ("description", "asc") => query.OrderBy(e => e.Description),
            ("description", "desc") => query.OrderByDescending(e => e.Description),

            ("date", "asc") => query.OrderBy(e => e.Date),
            ("date", "desc") => query.OrderByDescending(e => e.Date),

            _ => query.OrderByDescending(e => e.Date)
        };
        
        if (!string.IsNullOrEmpty(dateRange))
        {
            var now = DateTime.UtcNow;

            query = dateRange switch
            {
                "week" => query.Where(e => e.Date >= now.AddDays(-7)),
                "month" => query.Where(e => e.Date >= now.AddMonths(-1)),
                "year" => query.Where(e => e.Date >= now.AddYears(-1)),
                _ => query
            };
        }

        var totalCount = await query.CountAsync(token);

        var expenses = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(token);

        var dtos = new List<ExpenseResponseDto>();

        foreach (var expense in expenses)
        {
            dtos.Add(await ExpenseMapper.toDto(token, expense));
        }

        return new PaginatedExpenseResponseDto()
        {
            Items = dtos,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };

    }
    

    public async Task<List<ExpenseResponseDto>> GetAllExpensesByUserIdAsync(
        CancellationToken token,
        int? userId,
        Guid? guestSessionId)
    {
        var query = _context.Expenses.AsQueryable();

        if (userId.HasValue)
            query = query.Where(e => e.UserId == userId.Value);
        else if (guestSessionId.HasValue)
            query = query.Where(e => e.GuestSessionId == guestSessionId.Value);
        else
            throw new ArgumentException("No valid owner identifier");

        var expenses = await query
            .Include(e => e.Category)
            .Include(e => e.Currency)
            .Include(e => e.Products)
            .ToListAsync(token);

        if (!expenses.Any())
            throw new ArgumentException("No expenses found");

        var dtos = new List<ExpenseResponseDto>();
        foreach (var expense in expenses)
        {
            dtos.Add(await ExpenseMapper.toDto(token, expense));
        }

        return dtos;
    }

    public async Task<ExpenseResponseDto?> GetExpenseByIdAsync(
        CancellationToken token,
        int id,
        int? userId,
        Guid? guestSessionId)
    {
        var query = _context.Expenses.AsQueryable();

        if (userId.HasValue)
            query = query.Where(e => e.Id == id && e.UserId == userId.Value);
        else if (guestSessionId.HasValue)
            query = query.Where(e => e.Id == id && e.GuestSessionId == guestSessionId.Value);
        else
            return null;

        var expense = await query
            .Include(e => e.Category)
            .Include(e => e.Currency)
            .Include(e => e.Products)
            .FirstOrDefaultAsync(token);

        if (expense == null)
            return null;

        return await ExpenseMapper.toDto(token, expense);
    }

    public async Task<ExpenseMinimalResponseDto> CreateExpenseAsync(
        CancellationToken token, 
        int? userId, 
        Guid? guestSessionId, 
        ExpenseRequestDto dto)
    {
        if (guestSessionId.HasValue)
        {
            var guestExpenseCount = await _context.Expenses
                .CountAsync(e => e.GuestSessionId == guestSessionId.Value, token);

            if (guestExpenseCount >= 10)
                throw new InvalidOperationException("Guest trial limit reached (max 10 expenses).");
        }
        
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Category.Name.ToLower().Trim(), token);
        if (category == null)
            throw new InvalidOperationException("Category does not exist");

        var currency = await _context.Currencies
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Currency.Name.ToLower().Trim(), token);

        if (currency == null)
            throw new InvalidOperationException("Currency does not exist");

        if (dto.Products == null && !dto.Products.Any())
        {
            throw new InvalidOperationException("Products list is empty.");
        }

        var productDtos = dto.Products.ToList();


        var expense = new Expense()
        {
            Date = dto.Date,
            Description = dto.Description,
            UserId = userId,
            GuestSessionId = guestSessionId,
            Category = category,
            Currency = currency,
        };

        var products = new List<Product>();
        foreach (var productDto in productDtos)
        {
            var product = new Product()
            {
                Name = productDto.Name,
                Price = productDto.Price,
                Quantity = productDto.Quantity,
                Expense = expense,
                ExpenseId = expense.Id
            };
            products.Add(product);
        }

        expense.Products = products;

        await _context.Expenses.AddAsync(expense, token);

        foreach (var product in products)
        {
            await _context.Products.AddAsync(product, token);
        }

        await _context.SaveChangesAsync(token);

        return new ExpenseMinimalResponseDto()
        {
            Id = expense.Id
        };
    }

    public async Task<IEnumerable<ExpenseResponseDto>> GetExpensesByCategoryNameAndUserIdAsync(CancellationToken token,
        string categoryName, int userId)
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

    public async Task<IEnumerable<ExpenseResponseDto>> GetExpensesByIssuerAsync(CancellationToken token,
        string issuerName)
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

    public async Task<bool> DeleteExpenseAsync(
        CancellationToken token,
        int id,
        int? userId,
        Guid? guestSessionId)
    {
        var query = _context.Expenses.AsQueryable();

        if (userId.HasValue)
            query = query.Where(e => e.Id == id && e.UserId == userId.Value);
        else if (guestSessionId.HasValue)
            query = query.Where(e => e.Id == id && e.GuestSessionId == guestSessionId.Value);
        else
            return false;

        var expense = await query.FirstOrDefaultAsync(token);

        if (expense == null)
            return false;

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync(token);
        return true;
    }

    public async Task<ExpenseResponseDto> UpdateExpenseAsync(
        CancellationToken token,
        int id,
        ExpenseRequestDto dto,
        int? userId,
        Guid? guestSessionId)
    {
        IQueryable<Expense> query = _context.Expenses
            .Include(e => e.Category)
            .Include(e => e.Issuer)
            .Include(e => e.Currency)
            .Include(e => e.Products);

        if (userId.HasValue)
            query = query.Where(e => e.Id == id && e.UserId == userId.Value);
        else if (guestSessionId.HasValue)
            query = query.Where(e => e.Id == id && e.GuestSessionId == guestSessionId.Value);
        else
            throw new ArgumentException("Invalid owner");

        var expense = await query.FirstOrDefaultAsync(token);

        if (expense == null)
            throw new ArgumentException("Expense not found or access denied");

        // Update simple fields
        expense.Date = dto.Date.ToUniversalTime();
        expense.Description = dto.Description.Trim();

        // Update Category
        if (dto.Category?.Name != null)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == dto.Category.Name.Trim(), token);

            if (category == null)
                throw new ArgumentException($"Category '{dto.Category.Name}' does not exist");

            expense.CategoryId = category.Id;
        }

        // Update Issuer (optional)
        if (dto.Issuer?.Name != null)
        {
            var issuer = await _context.Issuers
                .FirstOrDefaultAsync(i => i.Name == dto.Issuer.Name.Trim(), token);

            if (issuer == null)
                throw new ArgumentException($"Issuer '{dto.Issuer.Name}' does not exist");

            expense.IssuerId = issuer.Id;
        }

        // Update Currency (required)
        var currency = await _context.Currencies
            .FirstOrDefaultAsync(c => c.Name == dto.Currency.Name.Trim(), token);

        if (currency == null)
            throw new ArgumentException($"Currency '{dto.Currency.Name}' does not exist");

        expense.CurrencyId = currency.Id;

        // Update Products - full replace
        if (dto.Products != null)
        {
            // Remove old products
            _context.Products.RemoveRange(expense.Products);

            // Add new ones
            var newProducts = dto.Products.Select(p => new Product
            {
                ExpenseId = expense.Id,
                Name = p.Name.Trim(),
                Price = p.Price,
                Quantity = p.Quantity
            }).ToList();

            await _context.Products.AddRangeAsync(newProducts, token);
            expense.Products = newProducts;
        }

        // Recalculate total
        expense.TotalAmount = expense.Products.Sum(p => p.Price * p.Quantity);

        await _context.SaveChangesAsync(token);

        // Map and return
        return await  ExpenseMapper.toDto(token, expense);
    }
}