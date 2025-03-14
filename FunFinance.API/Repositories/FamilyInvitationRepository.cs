using FunFinance.API.Data;
using FunFinance.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FunFinance.API.Repositories
{
    public class FamilyInvitationRepository : Repository<FamilyInvitation>, IFamilyInvitationRepository
    {
        public FamilyInvitationRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<FamilyInvitation?> GetByTokenAsync(string token)
        {
            return await _dbSet
                .Include(i => i.Family)
                .FirstOrDefaultAsync(i => i.Token == token);
        }

        public async Task<FamilyInvitation?> GetByEmailAndFamilyIdAsync(string email, int familyId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(i => i.Email == email && i.FamilyId == familyId);
        }

        public async Task<IEnumerable<FamilyInvitation>> GetByFamilyIdAsync(int familyId)
        {
            return await _dbSet
                .Where(i => i.FamilyId == familyId)
                .ToListAsync();
        }

        public async Task<IEnumerable<FamilyInvitation>> GetByEmailAsync(string email)
        {
            return await _dbSet
                .Where(i => i.Email == email)
                .Include(i => i.Family)
                .ToListAsync();
        }

        public async Task<IEnumerable<FamilyInvitation>> GetActiveInvitationsAsync(int familyId)
        {
            var now = DateTime.UtcNow;
            return await _dbSet
                .Where(i => i.FamilyId == familyId &&
                           i.ExpiresAt > now &&
                           !i.IsAccepted)
                .ToListAsync();
        }

        public async Task<bool> IsInvitationValidAsync(string token)
        {
            var now = DateTime.UtcNow;
            return await _dbSet
                .AnyAsync(i => i.Token == token &&
                              i.ExpiresAt > now &&
                              !i.IsAccepted);
        }
    }
}
