using System.ComponentModel.DataAnnotations;

namespace ExpensesManagementApp.DTOs.Request;

public class ExpenseProductRequestDto
{
    [Required]
    public string Name { get; set; } = null!;
}