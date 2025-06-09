using Microsoft.AspNetCore.Http;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using System.Security.Claims;

namespace personel_tayin_talebi_api.Services
{
    public interface IAuditService
    {
        Task LogActivityAsync(string controller, string action, string description, string entityName = null, string entityId = null, string operationType = null);
    }

    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogService _logService;

        public AuditService(
            ApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor,
            ILogService logService)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _logService = logService;
        }

        public async Task LogActivityAsync(string controller, string action, string description, string entityName = null, string entityId = null, string operationType = null)
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext;
                var userId = httpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = httpContext?.User?.FindFirstValue(ClaimTypes.Name);
                var ipAddress = httpContext?.Connection?.RemoteIpAddress?.ToString();

                var auditLog = new AuditLog
                {
                    UserId = userId,
                    UserName = userName,
                    IPAddress = ipAddress,
                    Controller = controller,
                    Action = action,
                    Description = description,
                    Timestamp = DateTime.UtcNow,
                    EntityName = entityName,
                    EntityId = entityId,
                    OperationType = operationType
                };

                await _context.AuditLogs.AddAsync(auditLog);
                await _context.SaveChangesAsync();

                _logService.LogInformation(
                    "Denetim Kaydı: {Controller}/{Action} - {Description} - Kullanıcı: {UserName} (ID: {UserId}) - IP: {IPAddress}",
                    controller, action, description, userName ?? "Anonim", userId ?? "Anonim", ipAddress ?? "Bilinmeyen");
            }
            catch (Exception ex)
            {
                _logService.LogError(ex, "Denetim kaydı oluşturulurken hata oluştu: {Message}", ex.Message);
                // Audit log exception'ı durdurmamalı, sadece loglanmalı
            }
        }
    }
} 