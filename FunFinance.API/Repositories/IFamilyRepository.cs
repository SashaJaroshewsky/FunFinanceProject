using FunFinance.API.Models;

namespace FunFinance.API.Repositories
{
    public interface IFamilyRepository : IRepository<Family>
    {
        Task<Family?> GetWithMembersAsync(int familyId);
        Task<Family?> GetWithBudgetsAsync(int familyId);
        Task<Family?> GetWithCategoriesAsync(int familyId);
        Task<Family?> GetWithInvitationsAsync(int familyId);
        Task<Family?> GetCompleteAsync(int familyId);
    }
}
