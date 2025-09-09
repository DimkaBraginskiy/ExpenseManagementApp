using System.ComponentModel.DataAnnotations;
using ExpensesManagementApp.Models;

namespace ExpensesManagementApp.DTOs.Request;

public class ExpenseRequestDto
{
    [Required]
    public decimal Amount { get; set; }
    [Required]
    public DateTime Date { get; set; }
    [Required]
    public string Description { get; set; } = string.Empty;

    public ExpenseCategoryRequestDto Category { get; set; } = null!;

    public ExpenseIssuerRequestDto Issuer { get; set; } = null!;
    
    public ICollection<ExpenseProductRequestDto> Products { get; set; } = new List<ExpenseProductRequestDto>();
}