namespace ExpensesManagementApp.DTOs.Response;

public class UserLoginResponseDto
{
    public string Email { get; set; }
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenExpiry { get; set; }
}