using FunFinance.API.Data;

namespace FunFinance.API.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public IUserRepository Users { get; private set; }
        public IFamilyRepository Families { get; private set; }
        public IBudgetRepository Budgets { get; private set; }
        public ICategoryRepository Categories { get; private set; }
        public IExpenseRepository Expenses { get; private set; }
        public IFamilyInvitationRepository Invitations { get; private set; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            Families = new FamilyRepository(_context);
            Budgets = new BudgetRepository(_context);
            Categories = new CategoryRepository(_context);
            Expenses = new ExpenseRepository(_context);
            Invitations = new FamilyInvitationRepository(_context);
        }

        public async Task<bool> CompleteAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
