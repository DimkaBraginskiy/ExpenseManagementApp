using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;
using ExpensesManagementApp.Core.Models;

namespace ExpensesManagementApp.Models;
[Table("Expense")]
public class Expense
{
    [Key] 
    public int Id { get; set; }
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

    public Category Category { get; set; } = null!;
    
    //Nullable
    [ForeignKey("Issuer")]
    public int? IssuerId { get; set; }
    public Issuer Issuer { get; set; } = null!;
    
    
    [ForeignKey("Currency")]
    public int? CurrencyId { get; set; }
    public Currency Currency { get; set;} = null!;

    public IEnumerable<Product> Products = new List<Product>();
} 