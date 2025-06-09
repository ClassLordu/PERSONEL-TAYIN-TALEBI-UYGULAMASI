namespace personel_tayin_talebi_api.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? IPAddress { get; set; }
        public string? Controller { get; set; }
        public string? Action { get; set; }
        public string? Description { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string? EntityName { get; set; }
        public string? EntityId { get; set; }
        public string? OperationType { get; set; } // Create, Update, Delete, Read
    }
} 