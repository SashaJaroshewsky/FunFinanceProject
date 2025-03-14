using FunFinance.API.Data;
using FunFinance.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FunFinance.API.Repositories
{
    public class FamilyRepository : Repository<Family>, IFamilyRepository
    {
        public FamilyRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Family?> GetWithMembersAsync(int familyId)
        {
            return await _dbSet
                .Include(f => f.Members)
                .FirstOrDefaultAsync(f => f.Id == familyId);
        }

        public async Task<Family?> GetWithBudgetsAsync(int familyId)
        {
            return await _dbSet
                .Include(f => f.Budgets)
                .FirstOrDefaultAsync(f => f.Id == familyId);
        }

        public async Task<Family?> GetWithCategoriesAsync(int familyId)
        {
            return await _dbSet
                .Include(f => f.Categories)
                .FirstOrDefaultAsync(f => f.Id == familyId);
        }

        public async Task<Family?> GetWithInvitationsAsync(int familyId)
        {
            return await _dbSet
                .Include(f => f.Invitations)
                .FirstOrDefaultAsync(f => f.Id == familyId);
        }

        public async Task<Family?> GetCompleteAsync(int familyId)
        {
            return await _dbSet
                .Include(f => f.Members)
                .Include(f => f.Budgets)
                .Include(f => f.Categories)
                .Include(f => f.Invitations)
                .FirstOrDefaultAsync(f => f.Id == familyId);
        }
    }
}
