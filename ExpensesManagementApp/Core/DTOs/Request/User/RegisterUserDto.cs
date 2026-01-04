using System.ComponentModel.DataAnnotations;

namespace ExpensesManagementApp.DTOs.Request;

public class RegisterUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MinLength(3)]
    [MaxLength(20)]
    public string UserName { get; set; }
    
    [Required]
    [MinLength(8)]
    [MaxLength(20)]
    public string Password { get; set; }
}