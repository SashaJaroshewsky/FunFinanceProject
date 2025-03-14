namespace FunFinance.API.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IFamilyRepository Families { get; }
        IBudgetRepository Budgets { get; }
        ICategoryRepository Categories { get; }
        IExpenseRepository Expenses { get; }
        IFamilyInvitationRepository Invitations { get; }

        Task<bool> CompleteAsync();
    }
}
