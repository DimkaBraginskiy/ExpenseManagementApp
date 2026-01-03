using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet("")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<CategoryResponseDto>>> GetAllCategoriesAsync(CancellationToken token)
    {
        var categories = await _categoryService.GetAllCategoriesAsync(token);

        return Ok(categories);
    }
}