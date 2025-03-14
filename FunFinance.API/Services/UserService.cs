using FunFinance.API.Models;
using FunFinance.API.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace FunFinance.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _unitOfWork.Users.GetAllAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _unitOfWork.Users.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _unitOfWork.Users.GetByEmailAsync(email);
        }

        public async Task<User> RegisterUserAsync(string username, string email, string password)
        {
            // Перевірка чи не зайняті email та username
            if (await EmailExistsAsync(email))
                throw new InvalidOperationException("Користувач з таким email вже існує");

            if (await UsernameExistsAsync(username))
                throw new InvalidOperationException("Користувач з таким логіном вже існує");

            // Хешування пароля
            var passwordHash = HashPassword(password);

            // Створення нового користувача
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = passwordHash,
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.CompleteAsync();

            return user;
        }

        public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);

            if (user == null)
                return false;

            var passwordHash = HashPassword(password);
            return user.PasswordHash == passwordHash;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            _unitOfWork.Users.Update(user);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return false;

            _unitOfWork.Users.Remove(user);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> JoinFamilyAsync(int userId, int familyId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return false;

            var family = await _unitOfWork.Families.GetByIdAsync(familyId);
            if (family == null)
                return false;

            user.FamilyId = familyId;
            user.Family = family;

            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> LeaveFamilyAsync(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return false;

            user.FamilyId = null;
            user.Family = null;

            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _unitOfWork.Users.EmailExistsAsync(email);
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _unitOfWork.Users.UsernameExistsAsync(username);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
