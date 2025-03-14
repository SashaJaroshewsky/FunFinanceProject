using System.ComponentModel.DataAnnotations;

namespace FunFinance.API.Models
{
    public class Budget
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public required string Name { get; set; }

        [Required]
        public decimal Limit { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Зовнішній ключ
        public int FamilyId { get; set; }

        // Навігаційні властивості
        public required virtual Family Family { get; set; }
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
