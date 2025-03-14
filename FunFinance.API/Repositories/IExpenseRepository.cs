using FunFinance.API.Models;

namespace FunFinance.API.Repositories
{
    public interface IExpenseRepository : IRepository<Expense>
    {
        Task<IEnumerable<Expense>> GetByBudgetIdAsync(int budgetId);
        Task<IEnumerable<Expense>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Expense>> GetByCategoryIdAsync(int categoryId);
        Task<IEnumerable<Expense>> GetByFamilyIdAsync(int familyId);
        Task<IEnumerable<Expense>> GetByDateRangeAsync(int familyId, DateTime startDate, DateTime endDate);
        Task<decimal> GetTotalExpensesByUserAsync(int userId, DateTime startDate, DateTime endDate);
        Task<decimal> GetTotalExpensesByCategoryAsync(int categoryId, DateTime startDate, DateTime endDate);
        Task<Expense?> GetCompleteExpenseAsync(int expenseId);
    }
}
