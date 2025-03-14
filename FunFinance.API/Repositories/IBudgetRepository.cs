using FunFinance.API.Models;

namespace FunFinance.API.Repositories
{
    public interface IBudgetRepository : IRepository<Budget>
    {
        Task<Budget?> GetWithExpensesAsync(int budgetId);
        Task<IEnumerable<Budget>> GetByFamilyIdAsync(int familyId);
        Task<IEnumerable<Budget>> GetActiveBudgetsAsync(int familyId);
        Task<IEnumerable<Budget>> GetByDateRangeAsync(int familyId, DateTime startDate, DateTime endDate);
        Task<decimal> GetTotalExpensesAsync(int budgetId);
    }
}
