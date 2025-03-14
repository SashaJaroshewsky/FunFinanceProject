using FunFinance.API.Models;
using FunFinance.API.Repositories;

namespace FunFinance.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _unitOfWork.Categories.GetAllAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _unitOfWork.Categories.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Category>> GetCategoriesByFamilyIdAsync(int familyId)
        {
            return await _unitOfWork.Categories.GetByFamilyIdAsync(familyId);
        }

        public async Task<Category> CreateCategoryAsync(string name, string description, int familyId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Назва категорії не може бути порожньою");

            var family = await _unitOfWork.Families.GetByIdAsync(familyId);
            if (family == null)
                throw new ArgumentException("Сім'ю не знайдено");

            // Перевіряємо, чи не існує вже категорія з такою назвою в цій сім'ї
            if (await _unitOfWork.Categories.IsCategoryNameUsedInFamilyAsync(familyId, name))
                throw new InvalidOperationException("Категорія з такою назвою вже існує в цій сім'ї");

            var category = new Category
            {
                Name = name,
                Description = description,
                FamilyId = familyId,
                Family = family
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CompleteAsync();

            return category;
        }

        public async Task<bool> UpdateCategoryAsync(Category category)
        {
            // Перевіряємо, чи не існує вже інша категорія з такою назвою в цій сім'ї
            var existingCategories = await _unitOfWork.Categories.GetByFamilyIdAsync(category.FamilyId);
            foreach (var existingCategory in existingCategories)
            {
                if (existingCategory.Id != category.Id && existingCategory.Name == category.Name)
                    throw new InvalidOperationException("Категорія з такою назвою вже існує в цій сім'ї");
            }

            _unitOfWork.Categories.Update(category);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                return false;

            // Перевіряємо, чи є витрати в цій категорії
            var categoryWithExpenses = await _unitOfWork.Categories.GetWithExpensesAsync(id);
            if (categoryWithExpenses != null && categoryWithExpenses.Expenses.Count > 0)
                throw new InvalidOperationException("Неможливо видалити категорію, оскільки існують витрати в ній");

            _unitOfWork.Categories.Remove(category);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<decimal> GetTotalExpensesForCategoryAsync(int categoryId)
        {
            return await _unitOfWork.Categories.GetTotalExpensesForCategoryAsync(categoryId);
        }
    }
}
