using FunFinance.API.Models;

namespace FunFinance.API.Services
{
    public interface IFamilyService
    {
        Task<IEnumerable<Family>> GetAllFamiliesAsync();
        Task<Family?> GetFamilyByIdAsync(int id);
        Task<Family?> GetFamilyWithMembersAsync(int id);
        Task<Family> CreateFamilyAsync(string name, int creatorUserId);
        Task<bool> UpdateFamilyAsync(Family family);
        Task<bool> DeleteFamilyAsync(int id);
        Task<string> CreateInvitationAsync(int familyId, string email);
        Task<bool> AcceptInvitationAsync(string token, int userId);
        Task<IEnumerable<FamilyInvitation>> GetInvitationsByFamilyIdAsync(int familyId);
        Task<IEnumerable<FamilyInvitation>> GetInvitationsByEmailAsync(string email);
    }
}
