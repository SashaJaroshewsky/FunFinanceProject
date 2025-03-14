using FunFinance.API.Data;
using FunFinance.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FunFinance.API.Repositories
{
    public class ExpenseRepository : Repository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Expense>> GetByBudgetIdAsync(int budgetId)
        {
            return await _dbSet
                .Where(e => e.BudgetId == budgetId)
                .Include(e => e.Category)
                .Include(e => e.User)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(e => e.UserId == userId)
                .Include(e => e.Category)
                .Include(e => e.Budget)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetByCategoryIdAsync(int categoryId)
        {
            return await _dbSet
                .Where(e => e.CategoryId == categoryId)
                .Include(e => e.User)
                .Include(e => e.Budget)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetByFamilyIdAsync(int familyId)
        {
            return await _dbSet
                .Where(e => e.Budget.FamilyId == familyId)
                .Include(e => e.Category)
                .Include(e => e.User)
                .Include(e => e.Budget)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Expense>> GetByDateRangeAsync(int familyId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(e => e.Budget.FamilyId == familyId &&
                           e.Date >= startDate &&
                           e.Date <= endDate)
                .Include(e => e.Category)
                .Include(e => e.User)
                .Include(e => e.Budget)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalExpensesByUserAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(e => e.UserId == userId &&
                           e.Date >= startDate &&
                           e.Date <= endDate)
                .SumAsync(e => e.Amount);
        }

        public async Task<decimal> GetTotalExpensesByCategoryAsync(int categoryId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(e => e.CategoryId == categoryId &&
                           e.Date >= startDate &&
                           e.Date <= endDate)
                .SumAsync(e => e.Amount);
        }

        public async Task<Expense?> GetCompleteExpenseAsync(int expenseId)
        {
            return await _dbSet
                .Where(e => e.Id == expenseId)
                .Include(e => e.Category)
                .Include(e => e.User)
                .Include(e => e.Budget)
                .FirstOrDefaultAsync();
        }
    }
}
