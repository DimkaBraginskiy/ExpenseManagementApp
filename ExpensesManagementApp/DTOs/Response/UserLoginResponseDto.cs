namespace ExpensesManagementApp.DTOs.Response;

public class UserLoginResponseDto
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenExpiry { get; set; }
}