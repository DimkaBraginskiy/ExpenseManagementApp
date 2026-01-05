using Microsoft.EntityFrameworkCore;
using System.Text;
using ExpensesManagementApp.Core.Models;
using ExpensesManagementApp.Data;
using ExpensesManagementApp.DTOs.Request;
using ExpensesManagementApp.Models;
using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var baseConnection = builder.Configuration.GetConnectionString("Default");
var password = builder.Configuration["DbPassword"];
Console.WriteLine(password);
var connectionString = baseConnection.Replace("PASSWORD", password);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
    

builder.Services.AddIdentityCore<User>(options =>
    {
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints()
    .AddDefaultTokenProviders()
    .AddSignInManager();
    

//adding scoped
builder.Services.AddControllers();
//builder.Services.AddScoped<IDbService, DbService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IExpensesService, ExpensesService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IIssuerService, IssuerService>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();




builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(connectionString)
);



var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowReact");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapIdentityApi<User>();

using (var scope = app.Services.CreateScope())
{
    await RoleSeeder.SeedAsync(scope.ServiceProvider);
    await AdminSeeder.SeedAsync(scope.ServiceProvider);
}

app.Run();