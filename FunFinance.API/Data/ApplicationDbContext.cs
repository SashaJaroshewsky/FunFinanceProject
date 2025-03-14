using FunFinance.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FunFinance.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Family> Families { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Budget>()
                .Property(b => b.Limit)
                .HasPrecision(18, 2);  // 18 цифр загалом, з них 2 після коми

            modelBuilder.Entity<Expense>()
                .Property(e => e.Amount)
                .HasPrecision(18, 2);

            // Налаштування відношень між таблицями
            modelBuilder.Entity<User>()
                .HasOne(u => u.Family)
                .WithMany(f => f.Members)
                .HasForeignKey(u => u.FamilyId)
                .IsRequired(false);  // Користувач може не мати сім'ї

            modelBuilder.Entity<Budget>()
                .HasOne(b => b.Family)
                .WithMany(f => f.Budgets)
                .HasForeignKey(b => b.FamilyId)
                .OnDelete(DeleteBehavior.Cascade);  // Якщо видаляється сім'я, видаляються її бюджети

            modelBuilder.Entity<Category>()
                .HasOne(c => c.Family)
                .WithMany(f => f.Categories)
                .HasForeignKey(c => c.FamilyId)
                .OnDelete(DeleteBehavior.Cascade);  // Якщо видаляється сім'я, видаляються її категорії

            modelBuilder.Entity<Expense>()
                .HasOne(e => e.User)
                .WithMany(u => u.Expenses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);  // Витрата не видаляється при видаленні користувача

            modelBuilder.Entity<Expense>()
                .HasOne(e => e.Budget)
                .WithMany(b => b.Expenses)
                .HasForeignKey(e => e.BudgetId)
                .OnDelete(DeleteBehavior.Restrict);  // Витрата не видаляється при видаленні бюджету

            modelBuilder.Entity<Expense>()
                .HasOne(e => e.Category)
                .WithMany(c => c.Expenses)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);  // Витрата не видаляється при видаленні категорії

            modelBuilder.Entity<FamilyInvitation>()
                .HasOne(i => i.Family)
                .WithMany(f => f.Invitations)
                .HasForeignKey(i => i.FamilyId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
