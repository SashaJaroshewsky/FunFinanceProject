using FunFinance.API.Models;

namespace FunFinance.API.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<IEnumerable<Category>> GetCategoriesByFamilyIdAsync(int familyId);
        Task<Category> CreateCategoryAsync(string name, string description, int familyId);
        Task<bool> UpdateCategoryAsync(Category category);
        Task<bool> DeleteCategoryAsync(int id);
        Task<decimal> GetTotalExpensesForCategoryAsync(int categoryId);
    }
}
