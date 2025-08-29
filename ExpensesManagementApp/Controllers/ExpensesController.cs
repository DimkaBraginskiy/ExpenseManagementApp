using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly IExpensesService _expensesService;

    public ExpensesController(IExpensesService expensesService)
    {
        _expensesService = expensesService;
    }
}