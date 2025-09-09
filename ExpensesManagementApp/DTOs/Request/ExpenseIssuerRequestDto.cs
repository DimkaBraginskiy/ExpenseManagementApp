using System.ComponentModel.DataAnnotations;

namespace ExpensesManagementApp.DTOs.Request;

public class ExpenseIssuerRequestDto
{
    [Required]
    public string Name { get; set; } = null!;
}