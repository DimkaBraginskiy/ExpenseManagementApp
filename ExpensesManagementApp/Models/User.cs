using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpensesManagementApp.Models;
[Table("User")]
public class User
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(50)]
    public string Login { get; set; } = null!;
    [Required]
    [MaxLength(50)]
    public string Email { get; set; } = null!;
    [Required]
    [MinLength(8)]
    [MaxLength(20)]
    public string PasswordHash { get; set; } = null!;
    
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}