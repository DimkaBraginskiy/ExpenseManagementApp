using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Response;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context, IUsersService usersService)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync(CancellationToken token)
    {
        var result = await _context.Categories.ToListAsync(token);

        var categoryDtos = new List<CategoryResponseDto>();
        
        foreach (var category in result)
        {
            var dto = new CategoryResponseDto()
            {
                Id = category.Id,
                Name = category.Name
            };
            
            categoryDtos.Add(dto);
        }

        return categoryDtos;
    }
}