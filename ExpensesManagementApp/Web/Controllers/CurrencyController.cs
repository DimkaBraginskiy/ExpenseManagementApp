using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyService _currencyService;

    public CurrencyController(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    [HttpGet("")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<CurrencyResponseDto>>> GetAllCurrenciesAsync(CancellationToken token)
    {
        var currencies = await _currencyService.GetAllCurrenciesAsync(token);

        return Ok(currencies);
    }
}