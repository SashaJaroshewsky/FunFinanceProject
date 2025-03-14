using FunFinance.API.Models;
using FunFinance.API.Repositories;

namespace FunFinance.API.Services
{
    public class FamilyService : IFamilyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserService _userService;

        public FamilyService(IUnitOfWork unitOfWork, IUserService userService)
        {
            _unitOfWork = unitOfWork;
            _userService = userService;
        }

        public async Task<IEnumerable<Family>> GetAllFamiliesAsync()
        {
            return await _unitOfWork.Families.GetAllAsync();
        }

        public async Task<Family?> GetFamilyByIdAsync(int id)
        {
            return await _unitOfWork.Families.GetByIdAsync(id);
        }

        public async Task<Family?> GetFamilyWithMembersAsync(int id)
        {
            return await _unitOfWork.Families.GetWithMembersAsync(id);
        }

        public async Task<Family> CreateFamilyAsync(string name, int creatorUserId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(creatorUserId);
            if (user == null)
                throw new InvalidOperationException("Користувача не знайдено");

            var family = new Family
            {
                Name = name
            };

            await _unitOfWork.Families.AddAsync(family);
            await _unitOfWork.CompleteAsync();

            // Додаємо творця як першого члена сім'ї
            await _userService.JoinFamilyAsync(creatorUserId, family.Id);

            return family;
        }

        public async Task<bool> UpdateFamilyAsync(Family family)
        {
            _unitOfWork.Families.Update(family);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteFamilyAsync(int id)
        {
            var family = await _unitOfWork.Families.GetByIdAsync(id);
            if (family == null)
                return false;

            _unitOfWork.Families.Remove(family);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<string> CreateInvitationAsync(int familyId, string email)
        {
            var family = await _unitOfWork.Families.GetByIdAsync(familyId);
            if (family == null)
                throw new InvalidOperationException("Сім'ю не знайдено");

            // Перевіряємо, чи не існує вже запрошення
            var existingInvitation = await _unitOfWork.Invitations.GetByEmailAndFamilyIdAsync(email, familyId);
            if (existingInvitation != null)
            {
                // Якщо існує та ще дійсне, повертаємо існуючий токен
                if (existingInvitation.ExpiresAt > DateTime.UtcNow && !existingInvitation.IsAccepted)
                    return existingInvitation.Token;

                // Якщо існує, але вже минув або прийнято, видаляємо старе
                _unitOfWork.Invitations.Remove(existingInvitation);
                await _unitOfWork.CompleteAsync();
            }

            // Генеруємо унікальний токен
            var token = Guid.NewGuid().ToString();

            // Створюємо запрошення
            var invitation = new FamilyInvitation
            {
                Email = email,
                Token = token,
                FamilyId = familyId,
                ExpiresAt = DateTime.UtcNow.AddDays(7), // Термін дії - 7 днів
                Family = family
            };

            await _unitOfWork.Invitations.AddAsync(invitation);
            await _unitOfWork.CompleteAsync();

            // В реальному додатку тут можна відправити email

            return token;
        }

        public async Task<bool> AcceptInvitationAsync(string token, int userId)
        {
            var invitation = await _unitOfWork.Invitations.GetByTokenAsync(token);
            if (invitation == null)
                return false;

            // Перевіряємо, чи дійсне запрошення
            if (!await _unitOfWork.Invitations.IsInvitationValidAsync(token))
                return false;

            // Приєднуємо користувача до сім'ї
            var success = await _userService.JoinFamilyAsync(userId, invitation.FamilyId);
            if (!success)
                return false;

            // Позначаємо запрошення як прийняте
            invitation.IsAccepted = true;
            await _unitOfWork.CompleteAsync();

            return true;
        }

        public async Task<IEnumerable<FamilyInvitation>> GetInvitationsByFamilyIdAsync(int familyId)
        {
            return await _unitOfWork.Invitations.GetByFamilyIdAsync(familyId);
        }

        public async Task<IEnumerable<FamilyInvitation>> GetInvitationsByEmailAsync(string email)
        {
            return await _unitOfWork.Invitations.GetByEmailAsync(email);
        }
    }
}
