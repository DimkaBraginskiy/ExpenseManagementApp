using System.ComponentModel.DataAnnotations.Schema;
using ExpensesManagementApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Core.Models;

[Table("Expense_Product")]
[PrimaryKey(nameof(ExpenseId), nameof(ProductId))]
public class ExpenseProduct
{
    [ForeignKey(nameof(Expense))]
    public int ExpenseId { get; set; }
    public Expense? Expense { get; set; } = null!;
    
    [ForeignKey(nameof(Product))]
    public int ProductId { get; set; }
    public Product? Product { get; set; } = null!;
}