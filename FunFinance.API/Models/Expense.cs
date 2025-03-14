using System.ComponentModel.DataAnnotations;

namespace FunFinance.API.Models
{
    public class Expense
    {
        public int Id { get; set; }

        [Required, StringLength(100)]
        public required string Description { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        // Зовнішні ключі
        public int CategoryId { get; set; }
        public int UserId { get; set; }
        public int BudgetId { get; set; }

        // Навігаційні властивості
        public required virtual Category Category { get; set; }
        public required virtual User User { get; set; }
        public required virtual Budget Budget { get; set; }
    }
}
