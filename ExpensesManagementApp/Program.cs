using Microsoft.EntityFrameworkCore;
using System.Text;
using ExpensesManagementApp.Data;
using ExpensesManagementApp.Services;

var builder = WebApplication.CreateBuilder(args);

var baseConnection = builder.Configuration.GetConnectionString("Default");
var password = builder.Configuration["DbPassword"];
var connectionString = baseConnection.Replace("PASSWORD", password);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();



//adding scoped
builder.Services.AddControllers();
//builder.Services.AddScoped<IDbService, DbService>();
builder.Services.AddScoped<IUsersService, UsersService>();



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
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.Run();