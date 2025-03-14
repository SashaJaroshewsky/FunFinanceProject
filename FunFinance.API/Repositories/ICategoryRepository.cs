using FunFinance.API.Models;

namespace FunFinance.API.Repositories
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<IEnumerable<Category>> GetByFamilyIdAsync(int familyId);
        Task<Category?> GetWithExpensesAsync(int categoryId);
        Task<bool> IsCategoryNameUsedInFamilyAsync(int familyId, string name);
        Task<decimal> GetTotalExpensesForCategoryAsync(int categoryId);
    }
}
