namespace ExpensesManagementApp.DTOs.Response;

public class ExpenseResponseDto
{
    public int Id { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = null!;

    public CategoryResponseDto? Category { get; set; }
    public IssuerResponseDto? Issuer { get; set; }
    public CurrencyResponseDto? Currency { get; set; }

    public ICollection<ProductResponseDto> Products { get; set; } = new List<ProductResponseDto>();
}