using System.ComponentModel.DataAnnotations;

namespace ExpensesManagementApp.DTOs.Request;

public class ExpenseCategoryRequestDto
{
    [Required]
    public string Name { get; set; } = null!;
}