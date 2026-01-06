using System.ComponentModel.DataAnnotations.Schema;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Identity;

namespace ExpensesManagementApp.Core.Models;
[Table("User")]
public class User : IdentityUser<int>
{
    public string? RefreshToken { get; set; } = null!;
    public DateTime AccountCreationDate { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; } = null!;
    
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
}