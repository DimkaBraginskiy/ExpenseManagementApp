using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Data;

public class AppDbContext : DbContext
{
    protected AppDbContext() { }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}