using System.ComponentModel.DataAnnotations;

namespace ExpensesManagementApp.DTOs.Request;

public class ExpenseCurrencyRequestDto
{
    [Required] public string Name { get; set; } = null!;
}