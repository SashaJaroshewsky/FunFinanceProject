using FunFinance.API.Data;
using FunFinance.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FunFinance.API.Repositories
{
    public class BudgetRepository : Repository<Budget>, IBudgetRepository
    {
        public BudgetRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Budget?> GetWithExpensesAsync(int budgetId)
        {
            return await _dbSet
                .Include(b => b.Expenses)
                .ThenInclude(e => e.Category)
                .Include(b => b.Expenses)
                .ThenInclude(e => e.User)
                .FirstOrDefaultAsync(b => b.Id == budgetId);
        }

        public async Task<IEnumerable<Budget>> GetByFamilyIdAsync(int familyId)
        {
            return await _dbSet
                .Where(b => b.FamilyId == familyId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Budget>> GetActiveBudgetsAsync(int familyId)
        {
            var today = DateTime.Today;
            return await _dbSet
                .Where(b => b.FamilyId == familyId &&
                            b.StartDate <= today &&
                            b.EndDate >= today)
                .ToListAsync();
        }

        public async Task<IEnumerable<Budget>> GetByDateRangeAsync(int familyId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(b => b.FamilyId == familyId &&
                          ((b.StartDate <= endDate && b.EndDate >= startDate) ||
                           (b.StartDate >= startDate && b.StartDate <= endDate) ||
                           (b.EndDate >= startDate && b.EndDate <= endDate)))
                .ToListAsync();
        }

        public async Task<decimal> GetTotalExpensesAsync(int budgetId)
        {
            return await _context.Expenses
                .Where(e => e.BudgetId == budgetId)
                .SumAsync(e => e.Amount);
        }
    }
}
