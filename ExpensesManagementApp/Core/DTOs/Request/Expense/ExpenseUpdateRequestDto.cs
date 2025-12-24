using System.ComponentModel.DataAnnotations;

namespace ExpensesManagementApp.DTOs.Request;

public class ExpenseUpdateRequestDto
{
    [Range(0.01, double.MaxValue)]

    public string? CategoryName { get; set; }

    public ExpenseIssuerRequestDto? Issuer { get; set; }

    public DateTimeOffset? Date { get; set; }

    public string? Description { get; set; }  
}