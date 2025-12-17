

using System.Security.Claims;
using ExpensesManagementApp.Core.Models;
using Microsoft.AspNetCore.Mvc;


public class UserClaimValidator
{
    public static async Task<bool> ValidateUserClaimAsync(ClaimsPrincipal user, CancellationToken token)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        Console.WriteLine($"userIdClaim: {userIdClaim}");

        if (int.TryParse(userIdClaim, out int userId) == false)
            return false;

        return true;
    }
}