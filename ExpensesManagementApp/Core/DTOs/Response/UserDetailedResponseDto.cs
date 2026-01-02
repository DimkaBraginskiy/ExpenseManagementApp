namespace ExpensesManagementApp.DTOs.Response;

public class UserDetailedResponseDto
{
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime AccountCreationDate { get; set; }
}