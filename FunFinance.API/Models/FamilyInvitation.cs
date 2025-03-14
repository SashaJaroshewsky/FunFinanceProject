using System.ComponentModel.DataAnnotations;

namespace FunFinance.API.Models
{
    public class FamilyInvitation
    {
        public int Id { get; set; }

        [Required, EmailAddress, StringLength(100)]
        public required string Email { get; set; }

        [Required]
        public required string Token { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime ExpiresAt { get; set; }

        public bool IsAccepted { get; set; } = false;

        // Зовнішній ключ
        public int FamilyId { get; set; }

        // Навігаційна властивість
        public required virtual Family Family { get; set; }
    }
}
