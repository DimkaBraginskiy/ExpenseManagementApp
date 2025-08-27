using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace ExpensesManagementApp.Models;
[Table("Expense")]
public class Expense
{
    [Key] 
    public int Id { get; set; }
    [Required]
    public decimal Amount { get; set; }
    [Required]
    public DateTime Date { get; set; }
    [Required]
    [MaxLength(100)]
    public string Description { get; set; } = null!;
    
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    //Nullable
    [ForeignKey("Category")]
    public int? CategoryId { get; set; }
    public Category Category { get; set; }
    
    //Nullable
    [ForeignKey("Issuer")]
    public int? IssuerId { get; set; }
    public Issuer Issuer { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
} 