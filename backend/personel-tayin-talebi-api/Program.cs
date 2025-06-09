using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using personel_tayin_talebi_api.Services;
using System.Text.Json.Serialization;
using Serilog;
using personel_tayin_talebi_api.Middleware;

// İlk olarak Serilog yapılandırması oluştur
var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", true)
    .Build();

// Serilog'u yapılandır ve uygulama genelinde logger olarak ayarla
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

try
{
    Log.Information("Uygulama başlatılıyor...");
    
    var builder = WebApplication.CreateBuilder(args);

    // Serilog'u Host logger olarak kullan
    builder.Host.UseSerilog();

    var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

    // Add services to the container.
    builder.Services.AddScoped<ILogService, LogService>();
    builder.Services.AddScoped<IAuditService, AuditService>();
    builder.Services.AddScoped<IIslemKaydiService, IslemKaydiService>();
    builder.Services.AddHttpContextAccessor(); // To get IP Address in service

    // JSON Serialization Options
    builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(connectionString));

    // Authentication JWT Bearer
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

    builder.Services.AddAuthorization();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
                          policy =>
                          {
                              policy.WithOrigins("http://localhost:3000") // React app's address
                                    .AllowAnyHeader()
                                    .AllowAnyMethod();
                          });
    });

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c => {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Personel Tayin API", Version = "v1" });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = @"JWT Authorization header using the Bearer scheme. 
                          Enter 'Bearer' [space] and then your token in the text input below.
                          Example: 'Bearer 12345abcdef'",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement()
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    },
                    Scheme = "oauth2",
                    Name = "Bearer",
                    In = ParameterLocation.Header,
                },
                new List<string>()
            }
        });
    });

    var app = builder.Build();

    // Veritabanını oluştur ve seed verilerini ekle (Uygulama başlamadan önce)
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            Log.Information("Veritabanı güncelleniyor...");
            context.Database.Migrate(); // Veritabanını en son migration'a günceller
            Log.Information("Seed verisi ekleniyor...");
            SeedData.Initialize(context);
            Log.Information("Veritabanı hazırlandı.");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Veritabanı hazırlanırken bir hata oluştu");
        }
    }

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        Log.Information("Swagger UI etkinleştirildi");
    }

    // Serilog request logging middleware
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        options.GetLevel = (httpContext, elapsed, ex) => ex != null
                        ? Serilog.Events.LogEventLevel.Error 
                        : httpContext.Response.StatusCode > 499 
                            ? Serilog.Events.LogEventLevel.Error
                            : Serilog.Events.LogEventLevel.Information;
    });
    Log.Information("HTTP istek loglaması etkinleştirildi");

    // Global exception handler middleware
    app.UseGlobalExceptionHandler();
    Log.Information("Global hata yakalama etkinleştirildi");

    // Request logging middleware
    app.UseRequestLogging();
    Log.Information("İstek loglaması etkinleştirildi");

    // Standart ve güvenli middleware sıralaması
    app.UseHttpsRedirection();
    Log.Information("HTTPS yönlendirme etkinleştirildi");

    app.UseCors(MyAllowSpecificOrigins);
    Log.Information("CORS politikaları etkinleştirildi");

    app.UseAuthentication();
    app.UseAuthorization();
    Log.Information("Kimlik doğrulama ve yetkilendirme etkinleştirildi");

    app.MapControllers();
    Log.Information("API controller'lar haritalandı");

    Log.Information("Uygulama başlatıldı ve istekleri dinliyor");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Uygulama beklenmedik şekilde sonlandı");
}
finally
{
    Log.Information("Uygulama kapatılıyor");
    Log.CloseAndFlush();
}
