using ExpensesManagementApp.DTOs.Response;

namespace ExpensesManagementApp.Services;

public interface ICurrencyService
{
    public Task<IEnumerable<CurrencyResponseDto>> GetAllCurrenciesAsync(CancellationToken token);
}