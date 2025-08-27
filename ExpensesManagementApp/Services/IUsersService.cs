using ExpensesManagementApp.Models;

namespace ExpensesManagementApp.Services;

public interface IUsersService
{
    public Task<IEnumerable<User>> GetAllUsersAsync(CancellationToken token);
}