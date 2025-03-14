using FunFinance.API.Models;

namespace FunFinance.API.Services
{
    public interface IExpenseService
    {
        Task<IEnumerable<Expense>> GetAllExpensesAsync();
        Task<Expense?> GetExpenseByIdAsync(int id);
        Task<IEnumerable<Expense>> GetExpensesByUserIdAsync(int userId);
        Task<IEnumerable<Expense>> GetExpensesByBudgetIdAsync(int budgetId);
        Task<IEnumerable<Expense>> GetExpensesByCategoryIdAsync(int categoryId);
        Task<IEnumerable<Expense>> GetExpensesByFamilyIdAsync(int familyId);
        Task<IEnumerable<Expense>> GetExpensesByDateRangeAsync(int familyId, DateTime startDate, DateTime endDate);
        Task<Expense> CreateExpenseAsync(string description, decimal amount, DateTime date, int categoryId, int userId, int budgetId);
        Task<bool> UpdateExpenseAsync(Expense expense);
        Task<bool> DeleteExpenseAsync(int id);
        Task<decimal> GetTotalExpensesByUserAsync(int userId, DateTime startDate, DateTime endDate);
        Task<decimal> GetTotalExpensesByCategoryAsync(int categoryId, DateTime startDate, DateTime endDate);
        Task<IDictionary<int, decimal>> GetExpensesByCategory(int familyId, DateTime startDate, DateTime endDate);
        Task<IDictionary<int, decimal>> GetExpensesByUser(int familyId, DateTime startDate, DateTime endDate);
        Task<IDictionary<DateTime, decimal>> GetExpensesByDay(int familyId, DateTime startDate, DateTime endDate);
    }
}
