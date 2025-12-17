using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ExpensesManagementApp.Core.Models;
using ExpensesManagementApp.DTOs.Response;

namespace ExpensesManagementApp.Models;
[Table("Product")]
public class Product
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = null!;

    [ForeignKey("Expense")]
    public int ExpenseId { get; set; }
    public Expense Expense { get; set; } = null!;
    
    public ICollection<ExpenseProduct> ExpenseProducts { get; set; } = new List<ExpenseProduct>();
}