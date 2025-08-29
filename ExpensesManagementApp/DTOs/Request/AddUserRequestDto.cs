namespace ExpensesManagementApp.DTOs.Request;

public class AddUserRequestDto
{
    public string Email { get; set; }
    public string Login { get; set; }
    public string Password { get; set; }
}