using FunFinance.API.Models;
using FunFinance.API.Repositories;

namespace FunFinance.API.Services
{
    public class BudgetService : IBudgetService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BudgetService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Budget>> GetAllBudgetsAsync()
        {
            return await _unitOfWork.Budgets.GetAllAsync();
        }

        public async Task<Budget?> GetBudgetByIdAsync(int id)
        {
            return await _unitOfWork.Budgets.GetByIdAsync(id);
        }

        public async Task<Budget?> GetBudgetWithExpensesAsync(int id)
        {
            return await _unitOfWork.Budgets.GetWithExpensesAsync(id);
        }

        public async Task<IEnumerable<Budget>> GetBudgetsByFamilyIdAsync(int familyId)
        {
            return await _unitOfWork.Budgets.GetByFamilyIdAsync(familyId);
        }

        public async Task<IEnumerable<Budget>> GetActiveBudgetsAsync(int familyId)
        {
            return await _unitOfWork.Budgets.GetActiveBudgetsAsync(familyId);
        }

        public async Task<Budget> CreateBudgetAsync(string name, decimal limit, DateTime startDate, DateTime endDate, int familyId)
        {
            if (limit <= 0)
                throw new ArgumentException("Ліміт бюджету повинен бути більшим за нуль");

            if (startDate >= endDate)
                throw new ArgumentException("Дата початку повинна бути раніше дати закінчення");

            var family = await _unitOfWork.Families.GetByIdAsync(familyId);
            if (family == null)
                throw new ArgumentException("Сім'ю не знайдено");

            var budget = new Budget
            {
                Name = name,
                Limit = limit,
                StartDate = startDate,
                EndDate = endDate,
                FamilyId = familyId,
                Family = family
            };

            await _unitOfWork.Budgets.AddAsync(budget);
            await _unitOfWork.CompleteAsync();

            return budget;
        }

        public async Task<bool> UpdateBudgetAsync(Budget budget)
        {
            _unitOfWork.Budgets.Update(budget);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<bool> DeleteBudgetAsync(int id)
        {
            var budget = await _unitOfWork.Budgets.GetByIdAsync(id);
            if (budget == null)
                return false;

            _unitOfWork.Budgets.Remove(budget);
            return await _unitOfWork.CompleteAsync();
        }

        public async Task<decimal> GetBudgetUsageAsync(int budgetId)
        {
            return await _unitOfWork.Budgets.GetTotalExpensesAsync(budgetId);
        }

        public async Task<decimal> GetRemainingBudgetAsync(int budgetId)
        {
            var budget = await _unitOfWork.Budgets.GetByIdAsync(budgetId);
            if (budget == null)
                throw new ArgumentException("Бюджет не знайдено");

            var totalExpenses = await _unitOfWork.Budgets.GetTotalExpensesAsync(budgetId);
            return budget.Limit - totalExpenses;
        }

        public async Task<bool> IsBudgetExceededAsync(int budgetId)
        {
            var budget = await _unitOfWork.Budgets.GetByIdAsync(budgetId);
            if (budget == null)
                throw new ArgumentException("Бюджет не знайдено");

            var totalExpenses = await _unitOfWork.Budgets.GetTotalExpensesAsync(budgetId);
            return totalExpenses > budget.Limit;
        }

        public async Task<bool> IsBudgetNearLimitAsync(int budgetId, decimal thresholdPercentage = 80)
        {
            var budget = await _unitOfWork.Budgets.GetByIdAsync(budgetId);
            if (budget == null)
                throw new ArgumentException("Бюджет не знайдено");

            var totalExpenses = await _unitOfWork.Budgets.GetTotalExpensesAsync(budgetId);
            var usagePercentage = (totalExpenses / budget.Limit) * 100;

            return usagePercentage >= thresholdPercentage && usagePercentage < 100;
        }
    }
}
