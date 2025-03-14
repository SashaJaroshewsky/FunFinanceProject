using FunFinance.API.Models;

namespace FunFinance.API.Services
{
    public interface IBudgetService
    {
        Task<IEnumerable<Budget>> GetAllBudgetsAsync();
        Task<Budget?> GetBudgetByIdAsync(int id);
        Task<Budget?> GetBudgetWithExpensesAsync(int id);
        Task<IEnumerable<Budget>> GetBudgetsByFamilyIdAsync(int familyId);
        Task<IEnumerable<Budget>> GetActiveBudgetsAsync(int familyId);
        Task<Budget> CreateBudgetAsync(string name, decimal limit, DateTime startDate, DateTime endDate, int familyId);
        Task<bool> UpdateBudgetAsync(Budget budget);
        Task<bool> DeleteBudgetAsync(int id);
        Task<decimal> GetBudgetUsageAsync(int budgetId);
        Task<decimal> GetRemainingBudgetAsync(int budgetId);
        Task<bool> IsBudgetExceededAsync(int budgetId);
        Task<bool> IsBudgetNearLimitAsync(int budgetId, decimal thresholdPercentage = 80);
    }
}
