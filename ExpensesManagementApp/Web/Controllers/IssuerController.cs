using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IssuerController : ControllerBase
{
    private readonly IIssuerService _issuerService;

    public IssuerController(IIssuerService issuerService)
    {
        _issuerService = issuerService;
    }

    [HttpGet("")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<IssuerResponseDto>>> GetAllIssuersAsync(CancellationToken token)
    {
        var issuers = await _issuerService.GetAllIssuersAsync(token);

        return Ok(issuers);
    }
}