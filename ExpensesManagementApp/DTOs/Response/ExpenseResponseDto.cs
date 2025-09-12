namespace ExpensesManagementApp.DTOs.Response;

public class ExpenseResponseDto
{
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = null!;
    public int? CategoryId { get; set; }
    public int? IssuerId { get; set; }
    public int? Currencyid { get; set; }
}