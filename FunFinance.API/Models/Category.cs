using System.ComponentModel.DataAnnotations;

namespace FunFinance.API.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public required string Name { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        // Зовнішній ключ до сім'ї
        public int FamilyId { get; set; }

        // Навігаційна властивість
        public required virtual Family Family { get; set; }
        public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}
