using FunFinance.API.Models;

namespace FunFinance.API.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> RegisterUserAsync(string username, string email, string password);
        Task<bool> ValidateUserCredentialsAsync(string email, string password);
        Task<bool> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> JoinFamilyAsync(int userId, int familyId);
        Task<bool> LeaveFamilyAsync(int userId);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> UsernameExistsAsync(string username);
    }
}
