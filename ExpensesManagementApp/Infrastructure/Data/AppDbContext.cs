using ExpensesManagementApp.Core.Models;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ExpensesManagementApp.Data;

public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    //public DbSet<User> Users { get; set; } = null!;
    public DbSet<Expense> Expenses { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Issuer> Issuers { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Currency> Currencies { get; set; } = null!;
    protected AppDbContext() { }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    
}