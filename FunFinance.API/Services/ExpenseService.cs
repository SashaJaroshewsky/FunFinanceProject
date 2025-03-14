using FunFinance.API.Models;
using FunFinance.API.Repositories;

namespace FunFinance.API.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBudgetService _budgetService;

        public ExpenseService(IUnitOfWork unitOfWork, IBudgetService budgetService)
        {
            _unitOfWork = unitOfWork;
            _budgetService = budgetService;
        }

        public async Task<IEnumerable<Expense>> GetAllExpensesAsync()
        {
            return await _unitOfWork.Expenses.GetAllAsync();
        }

        public async Task<Expense?> GetExpenseByIdAsync(int id)
        {
            return await _unitOfWork.Expenses.GetCompleteExpenseAsync(id);
        }

        public async Task<IEnumerable<Expense>> GetExpensesByUserIdAsync(int userId)
        {
            return await _unitOfWork.Expenses.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Expense>> GetExpensesByBudgetIdAsync(int budgetId)
        {
            return await _unitOfWork.Expenses.GetByBudgetIdAsync(budgetId);
        }

        public async Task<IEnumerable<Expense>> GetExpensesByCategoryIdAsync(int categoryId)
        {
            return await _unitOfWork.Expenses.GetByCategoryIdAsync(categoryId);
        }

        public async Task<IEnumerable<Expense>> GetExpensesByFamilyIdAsync(int familyId)
        {
            return await _unitOfWork.Expenses.GetByFamilyIdAsync(familyId);
        }

        public async Task<IEnumerable<Expense>> GetExpensesByDateRangeAsync(int familyId, DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.Expenses.GetByDateRangeAsync(familyId, startDate, endDate);
        }

        public async Task<Expense> CreateExpenseAsync(string description, decimal amount, DateTime date, int categoryId, int userId, int budgetId)
        {
            if (amount <= 0)
                throw new ArgumentException("Сума витрати повинна бути більшою за нуль");

            // Перевіряємо, чи існують зв'язані сутності
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("Користувача не знайдено");

            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category == null)
                throw new ArgumentException("Категорію не знайдено");

            var budget = await _unitOfWork.Budgets.GetByIdAsync(budgetId);
            if (budget == null)
                throw new ArgumentException("Бюджет не знайдено");

            // Перевіряємо, чи належить категорія до тієї ж сім'ї, що й бюджет
            if (category.FamilyId != budget.FamilyId)
                throw new ArgumentException("Категорія і бюджет повинні належати до однієї сім'ї");

            // Перевіряємо, чи входить дата в період бюджету
            if (date < budget.StartDate || date > budget.EndDate)
                throw new ArgumentException("Дата витрати повинна бути в межах періоду бюджету");

            // Створюємо витрату
            var expense = new Expense
            {
                Description = description,
                Amount = amount,
                Date = date,
                CategoryId = categoryId,
                UserId = userId,
                BudgetId = budgetId,
                Category = category,
                User = user,
                Budget = budget
            };

            await _unitOfWork.Expenses.AddAsync(expense);
            await _unitOfWork.CompleteAsync();

            return expense;
        }

        public async Task<bool> UpdateExpenseAsync(Expense expense)
        {
            // Може додатися додаткова валідація, наприклад, перевірка, що користувач 
            // може редагувати тільки свої витрати або що дата в межах періоду бюджету

            _unitOfWork.Expenses.Update(expense);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteExpenseAsync(int id)
        {
            var expense = await _unitOfWork.Expenses.GetByIdAsync(id);
            if (expense == null)
                return false;

            _unitOfWork.Expenses.Remove(expense);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<decimal> GetTotalExpensesByUserAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.Expenses.GetTotalExpensesByUserAsync(userId, startDate, endDate);
        }

        public async Task<decimal> GetTotalExpensesByCategoryAsync(int categoryId, DateTime startDate, DateTime endDate)
        {
            return await _unitOfWork.Expenses.GetTotalExpensesByCategoryAsync(categoryId, startDate, endDate);
        }

        public async Task<IDictionary<int, decimal>> GetExpensesByCategory(int familyId, DateTime startDate, DateTime endDate)
        {
            var expenses = await _unitOfWork.Expenses.GetByDateRangeAsync(familyId, startDate, endDate);
            return expenses
                .GroupBy(e => e.CategoryId)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));
        }

        public async Task<IDictionary<int, decimal>> GetExpensesByUser(int familyId, DateTime startDate, DateTime endDate)
        {
            var expenses = await _unitOfWork.Expenses.GetByDateRangeAsync(familyId, startDate, endDate);
            return expenses
                .GroupBy(e => e.UserId)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));
        }

        public async Task<IDictionary<DateTime, decimal>> GetExpensesByDay(int familyId, DateTime startDate, DateTime endDate)
        {
            var expenses = await _unitOfWork.Expenses.GetByDateRangeAsync(familyId, startDate, endDate);
            return expenses
                .GroupBy(e => e.Date.Date)
                .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));
        }
    }
}
