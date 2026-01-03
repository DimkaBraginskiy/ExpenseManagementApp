using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Response;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class CurrencyService : ICurrencyService
{
    private readonly AppDbContext _context;

    public CurrencyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CurrencyResponseDto>> GetAllCurrenciesAsync(CancellationToken token)
    {
        var result = await _context.Currencies.ToListAsync(token);

        var currencyDtos = new List<CurrencyResponseDto>();
        
        foreach (var currency in result)
        {
            var dto = new CurrencyResponseDto()
            {
                Name = currency.Name
            };
            
            currencyDtos.Add(dto);
        }

        return currencyDtos;
    }
}