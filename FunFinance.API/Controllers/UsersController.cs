using FunFinance.API.Models;
using FunFinance.API.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FunFinance.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: api/Users/Register
        [HttpPost("Register")]
        public async Task<ActionResult<User>> RegisterUser([FromBody] UserRegisterDto registerDto)
        {
            try
            {
                var user = await _userService.RegisterUserAsync(
                    registerDto.Username,
                    registerDto.Email,
                    registerDto.Password);

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/Users/Login
        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var isValid = await _userService.ValidateUserCredentialsAsync(
                loginDto.Email,
                loginDto.Password);

            if (!isValid)
                return Unauthorized("Невірний email або пароль");

            var user = await _userService.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized("Користувача не знайдено");

            // В реальному додатку тут ми б генерували JWT токен
            return Ok(new { message = "Вхід успішний", userId = user.Id });
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto updateDto)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            // Оновлюємо тільки дозволені поля
            user.Username = updateDto.Username ?? user.Username;

            // В реальному додатку тут би була перевірка на права доступу

            var success = await _userService.UpdateUserAsync(user);
            if (!success)
                return BadRequest("Не вдалося оновити користувача");

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userService.DeleteUserAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // POST: api/Users/5/JoinFamily/10
        [HttpPost("{userId}/JoinFamily/{familyId}")]
        public async Task<IActionResult> JoinFamily(int userId, int familyId)
        {
            var success = await _userService.JoinFamilyAsync(userId, familyId);
            if (!success)
                return BadRequest("Не вдалося приєднатися до сім'ї");

            return NoContent();
        }

        // POST: api/Users/5/LeaveFamily
        [HttpPost("{userId}/LeaveFamily")]
        public async Task<IActionResult> LeaveFamily(int userId)
        {
            var success = await _userService.LeaveFamilyAsync(userId);
            if (!success)
                return BadRequest("Не вдалося вийти з сім'ї");

            return NoContent();
        }
    }

    // DTO класи для передачі даних
    public class UserRegisterDto
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class UserLoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class UserUpdateDto
    {
        public required string Username { get; set; }
    }
}