using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpensesManagementApp.Models;
[Table("Currency")]
public class Currency
{
    [Key]
    public int Id { get; set; }
    [Required] 
    [MaxLength(10)] 
    public string Name { get; set; } = null!;
}