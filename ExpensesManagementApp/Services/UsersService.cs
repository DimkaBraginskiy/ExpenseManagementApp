using ExpensesManagementApp.Data;
using ExpensesManagementApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Services;

public class UsersService : IUsersService
{
    private readonly AppDbContext _context;

    public UsersService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync(CancellationToken token)
    {
        return await  _context.Users
            .ToListAsync(token);
        
        
    }
}