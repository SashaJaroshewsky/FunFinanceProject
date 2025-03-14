using FunFinance.API.Models;

namespace FunFinance.API.Repositories
{
    public interface IFamilyInvitationRepository : IRepository<FamilyInvitation>
    {
        Task<FamilyInvitation?> GetByTokenAsync(string token);
        Task<FamilyInvitation?> GetByEmailAndFamilyIdAsync(string email, int familyId);
        Task<IEnumerable<FamilyInvitation>> GetByFamilyIdAsync(int familyId);
        Task<IEnumerable<FamilyInvitation>> GetByEmailAsync(string email);
        Task<IEnumerable<FamilyInvitation>> GetActiveInvitationsAsync(int familyId);
        Task<bool> IsInvitationValidAsync(string token);
    }
}
