﻿using ExpensesManagementApp.Services;
using Microsoft.AspNetCore.Mvc;
using ExpensesManagementApp.DTOs.Request;


namespace ExpensesManagementApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUsersService _usersService;
    
    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUserAsync(CancellationToken token, [FromBody] RegisterUserDto dto)
    {
        try
        {
            _usersService.CreateUserAsync(token, dto);
            return Ok(new { message = "User has been created" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }


    [HttpGet]
    public async Task<IActionResult> GetUsersAsync(CancellationToken token)
    {
        try
        {
            var users = await _usersService.GetAllUsersAsync(token);
            return Ok(users);    
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}