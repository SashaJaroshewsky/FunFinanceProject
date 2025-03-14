using FunFinance.API.Data;
using FunFinance.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FunFinance.API.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Category>> GetByFamilyIdAsync(int familyId)
        {
            return await _dbSet
                .Where(c => c.FamilyId == familyId)
                .ToListAsync();
        }

        public async Task<Category?> GetWithExpensesAsync(int categoryId)
        {
            return await _dbSet
                .Include(c => c.Expenses)
                .FirstOrDefaultAsync(c => c.Id == categoryId);
        }

        public async Task<bool> IsCategoryNameUsedInFamilyAsync(int familyId, string name)
        {
            return await _dbSet
                .AnyAsync(c => c.FamilyId == familyId && c.Name == name);
        }

        public async Task<decimal> GetTotalExpensesForCategoryAsync(int categoryId)
        {
            return await _context.Expenses
                .Where(e => e.CategoryId == categoryId)
                .SumAsync(e => e.Amount);
        }
    }
}
