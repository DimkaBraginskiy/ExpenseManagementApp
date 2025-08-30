using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ExpensesManagementApp.Models;
[Table("User")]
public class User : IdentityUser<int>
{
    public string? RefreshToken { get; set; } = null!;
    
    public DateTime? RefreshTokenExpiry { get; set; } = null!;
    
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}