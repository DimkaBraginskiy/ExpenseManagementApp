using Microsoft.AspNetCore.Identity;

namespace ExpensesManagementApp.Services;

public class RoleSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<int>>>();

        string[] roles = { "User", "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<int>(role));
            }
        }
    }
}