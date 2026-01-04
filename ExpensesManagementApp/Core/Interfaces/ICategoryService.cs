using ExpensesManagementApp.DTOs.Response;

namespace ExpensesManagementApp.Services;

public interface ICategoryService
{
    public Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync(CancellationToken token);
}