using System.ComponentModel.DataAnnotations;

namespace FunFinance.API.Models
{
    public class Family
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public required string Name { get; set; }

        // Навігаційні властивості
        public virtual ICollection<User> Members { get; set; } = new List<User>();
        public virtual ICollection<Budget> Budgets { get; set; } = new List<Budget>();
        public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
        public virtual ICollection<FamilyInvitation> Invitations { get; set; } = new List<FamilyInvitation>();
    }
}
