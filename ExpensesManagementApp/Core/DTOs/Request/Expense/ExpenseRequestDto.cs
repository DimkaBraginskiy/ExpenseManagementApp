using System.ComponentModel.DataAnnotations;
using ExpensesManagementApp.Models;

namespace ExpensesManagementApp.DTOs.Request;

public class ExpenseRequestDto
{
    [Required]
    public DateTime Date { get; set; }
    [Required]
    public string Description { get; set; } = string.Empty;
    [Required]
    public ExpenseCategoryRequestDto Category { get; set; } = null!;
    
    public ExpenseIssuerRequestDto Issuer { get; set; } = null!;
    [Required]
    public ExpenseCurrencyRequestDto Currency { get; set; } = null!;
    [Required]
    public IEnumerable<ProductRequestDto>? Products { get; set; }
}