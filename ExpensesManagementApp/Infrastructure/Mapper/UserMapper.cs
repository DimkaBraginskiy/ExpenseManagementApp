using ExpensesManagementApp.Core.Models;
using ExpensesManagementApp.DTOs.Response;

namespace ExpensesManagementApp.Infrastructure.Mapper;

public class UserMapper
{
    public static UserDetailedResponseDto toDto(CancellationToken token, User user)
    {
        var dto = new UserDetailedResponseDto()
        {
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            AccountCreationDate = user.AccountCreationDate
        };

        return dto;
    }
}