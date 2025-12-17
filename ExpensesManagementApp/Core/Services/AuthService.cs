using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ExpensesManagementApp.Core.Models;
using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.DTOs.Response;
using ExpensesManagementApp.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ExpensesManagementApp.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
    {
        _context = context;
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    public async Task<IActionResult> RegisterUserAsync(RegisterUserDto dto, CancellationToken cancellationToken)
    {
        //2. Check whether email already exists - unnecessary with Identity
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email, cancellationToken))
        {
            throw new InvalidOperationException("Email already exists in the system!");
        }
        //3. Save to db
        var user = new User()
        {
            Email = dto.Email,
            UserName = dto.Email
        };
        
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return new BadRequestObjectResult(result.Errors);
        }
        return new OkObjectResult("User registered successfully!");
    }

    public async Task<UserLoginResponseDto> LoginUserAsync(LoginUserDto dto, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email.");
        }
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            throw new UnauthorizedAccessException("Invalid Password.");
        }

        return await GenerateTokensAsync(user);
    }

    private async Task<UserLoginResponseDto> GenerateTokensAsync(User user)
    {
        var jwtConfig = _configuration.GetSection("Jwt");
        List<Claim> claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken
        (
            issuer: jwtConfig["Issuer"],
            audience: jwtConfig["Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
        
        var refreshToken = Guid.NewGuid().ToString();
        var refreshTokenExpiry = DateTime.Now.AddDays(7).ToUniversalTime();
        
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = refreshTokenExpiry;

        await _userManager.UpdateAsync(user);

        var dto = new UserLoginResponseDto()
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            RefreshTokenExpiry = refreshTokenExpiry
        };
        
        return dto;
    }
}