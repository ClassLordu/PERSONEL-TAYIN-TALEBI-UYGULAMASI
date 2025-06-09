using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace personel_tayin_talebi_api.Services
{
    public interface ILogService
    {
        void LogInformation(string message, params object[] args);
        void LogWarning(string message, params object[] args);
        void LogError(Exception exception, string message, params object[] args);
        void LogError(string message, params object[] args);
        void LogDebug(string message, params object[] args);
        void LogCritical(Exception exception, string message, params object[] args);
        void LogCritical(string message, params object[] args);
        void LogUserActivity(string activity, string details = "");
    }

    public class LogService : ILogService
    {
        private readonly ILogger<LogService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LogService(ILogger<LogService> logger, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public void LogInformation(string message, params object[] args)
        {
            _logger.LogInformation(message, args);
        }

        public void LogWarning(string message, params object[] args)
        {
            _logger.LogWarning(message, args);
        }

        public void LogError(Exception exception, string message, params object[] args)
        {
            _logger.LogError(exception, message, args);
        }

        public void LogError(string message, params object[] args)
        {
            _logger.LogError(message, args);
        }

        public void LogDebug(string message, params object[] args)
        {
            _logger.LogDebug(message, args);
        }

        public void LogCritical(Exception exception, string message, params object[] args)
        {
            _logger.LogCritical(exception, message, args);
        }

        public void LogCritical(string message, params object[] args)
        {
            _logger.LogCritical(message, args);
        }

        public void LogUserActivity(string activity, string details = "")
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var userId = httpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? "Anonim";
            var username = httpContext?.User?.FindFirstValue(ClaimTypes.Name) ?? "Anonim";
            var ipAddress = httpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Bilinmeyen";
            
            var logMessage = $"Kullanıcı Aktivitesi: {activity} | Kullanıcı: {username} (ID: {userId}) | IP: {ipAddress}";
            
            if (!string.IsNullOrEmpty(details))
            {
                logMessage += $" | Detaylar: {details}";
            }
            
            _logger.LogInformation(logMessage);
        }
    }
} 