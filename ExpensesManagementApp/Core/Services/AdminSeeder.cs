using ExpensesManagementApp.Core.Models;
using Microsoft.AspNetCore.Identity;

namespace ExpensesManagementApp.Services;

public class AdminSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        
        const string adminRole = "Admin";

        if (!await roleManager.RoleExistsAsync(adminRole))
        {
            await roleManager.CreateAsync(new IdentityRole<int>(adminRole));
        }
        
        var adminSection = configuration.GetSection("AdminUser");
        var email = adminSection["Email"];
        var password = adminSection["Password"];

        if (email == null || password == null)
            return;
        
        var adminUser = await userManager.FindByEmailAsync(email);

        if (adminUser == null)
        {
            adminUser = new User
            {
                Email = email,
                UserName = email,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(adminUser, password);
            if (!createResult.Succeeded)
                throw new Exception(string.Join(", ", createResult.Errors.Select(e => e.Description)));
        }
        
        if (!await userManager.IsInRoleAsync(adminUser, adminRole))
        {
            await userManager.AddToRoleAsync(adminUser, adminRole);
        }
    }
}