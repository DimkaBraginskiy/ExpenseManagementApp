using ExpensesManagementApp.DTOs.Response;

namespace ExpensesManagementApp.Services;

public interface IIssuerService
{
    public Task<IEnumerable<IssuerResponseDto>> GetAllIssuersAsync(CancellationToken token);
}