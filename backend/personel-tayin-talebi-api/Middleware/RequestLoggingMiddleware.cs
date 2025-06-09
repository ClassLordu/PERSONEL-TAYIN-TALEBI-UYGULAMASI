using System.Diagnostics;
using personel_tayin_talebi_api.Services;

namespace personel_tayin_talebi_api.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ILogService logService)
        {
            var stopwatch = Stopwatch.StartNew();
            try
            {
                await _next(context);
                stopwatch.Stop();

                var statusCode = context.Response.StatusCode;
                var method = context.Request.Method;
                var path = context.Request.Path;
                var queryString = context.Request.QueryString;
                var elapsedMilliseconds = stopwatch.ElapsedMilliseconds;

                if (statusCode < 400)
                {
                    // Başarılı işlemler
                    logService.LogInformation(
                        "HTTP {Method} {Path}{QueryString} - {StatusCode} in {ElapsedMilliseconds}ms",
                        method, path, queryString, statusCode, elapsedMilliseconds);
                }
                else if (statusCode < 500)
                {
                    // Client hatası
                    logService.LogWarning(
                        "HTTP {Method} {Path}{QueryString} - {StatusCode} in {ElapsedMilliseconds}ms",
                        method, path, queryString, statusCode, elapsedMilliseconds);
                }
                else
                {
                    // Server hatası
                    logService.LogError(
                        "HTTP {Method} {Path}{QueryString} - {StatusCode} in {ElapsedMilliseconds}ms",
                        method, path, queryString, statusCode, elapsedMilliseconds);
                }
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                logService.LogError(ex, 
                    "HTTP {Method} {Path} - Unhandled exception", 
                    context.Request.Method, context.Request.Path);
                throw; // Hatanın işlenmesi için global exception handler'a gönder
            }
        }
    }

    // Middleware extension
    public static class RequestLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestLoggingMiddleware>();
        }
    }
} 