using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Response;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class IssuerService : IIssuerService
{
    private readonly AppDbContext _context;

    public IssuerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<IssuerResponseDto>> GetAllIssuersAsync(CancellationToken token)
    {
        var result = await _context.Issuers.ToListAsync(token);

        var issuerDtos = new List<IssuerResponseDto>();
        
        foreach (var issuer in result)
        {
            var dto = new IssuerResponseDto()
            {
                Name = issuer.Name
            };
            
            issuerDtos.Add(dto);
        }

        return issuerDtos;
    }
}