using System.ComponentModel.DataAnnotations;

namespace FunFinance.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public required string Username { get; set; }

        [Required, EmailAddress, StringLength(100)]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        // Зв'язок з сім'єю
        public int? FamilyId { get; set; }
        public virtual Family? Family { get; set; }

        // Навігаційні властивості
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
