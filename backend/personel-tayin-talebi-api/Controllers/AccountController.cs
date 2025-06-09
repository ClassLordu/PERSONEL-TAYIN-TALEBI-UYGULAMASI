using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using personel_tayin_talebi_api.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;


namespace personel_tayin_talebi_api.Controllers
{
    public class RegisterDto
    {
        public string SicilNumarasi { get; set; } = string.Empty;
        public string Ad { get; set; } = string.Empty;
        public string Soyad { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty; // "Personel" veya "Yetkili"
        public string Email { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string SicilNumarasi { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IIslemKaydiService _islemKaydiService;

        public AccountController(ApplicationDbContext context, IConfiguration configuration, IIslemKaydiService islemKaydiService)
        {
            _context = context;
            _configuration = configuration;
            _islemKaydiService = islemKaydiService;
        }

        [HttpPost("register")]
        [AllowAnonymous] 
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var userExists = await _context.Personeller.AnyAsync(p => p.SicilNumarasi == model.SicilNumarasi);
            if (userExists)
            {
                return StatusCode(StatusCodes.Status409Conflict, new { Status = "Error", Message = "Bu sicil numarası ile zaten bir kullanıcı mevcut." });
            }

            var personelRole = await _context.Roller.FirstOrDefaultAsync(r => r.Ad == model.Rol);
            if (personelRole == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new { Status="Error", Message = $"'{model.Rol}' rolü sistemde tanımlı değil."});
            }

            var personel = new Personel
            {
                SicilNumarasi = model.SicilNumarasi,
                Ad = model.Ad,
                Soyad = model.Soyad,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password)
            };
            
            personel.Roller.Add(personelRole);

            await _context.Personeller.AddAsync(personel);
            await _context.SaveChangesAsync();
            
            return Ok(new { Status = "Success", Message = "Kullanıcı başarıyla oluşturuldu." });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var personel = await _context.Personeller
                        .Include(p => p.Roller)
                        .FirstOrDefaultAsync(p => p.SicilNumarasi == model.SicilNumarasi);

            if (personel != null && BCrypt.Net.BCrypt.Verify(model.Password, personel.PasswordHash))
            {
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, personel.Id.ToString()),
                    new Claim(ClaimTypes.Name, personel.SicilNumarasi),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var rol in personel.Roller)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, rol.Ad));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]!));

                var token = new JwtSecurityToken(
                   issuer: _configuration["JWT:Issuer"],
                   audience: _configuration["JWT:Audience"],
                   expires: DateTime.Now.AddHours(3),
                   claims: authClaims,
                   signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
                
                await _islemKaydiService.LogAsync("Giriş", $"Kullanıcı (Sicil: {personel.SicilNumarasi}) giriş yaptı.", personel.Id, HttpContext.Connection.RemoteIpAddress?.ToString());

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            return Unauthorized(new { Status="Error", Message = "Sicil numarası veya şifre hatalı."});
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var personel = await _context.Personeller.FindAsync(int.Parse(userId));
            if (personel == null)
            {
                return NotFound(new { Status = "Error", Message = "Kullanıcı bulunamadı." });
            }

            if (!BCrypt.Net.BCrypt.Verify(model.CurrentPassword, personel.PasswordHash))
            {
                return BadRequest(new { Status = "Error", Message = "Mevcut şifre hatalı." });
            }

            personel.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            _context.Personeller.Update(personel);
            await _context.SaveChangesAsync();
            
            await _islemKaydiService.LogAsync("Şifre Değiştirme", $"Kullanıcı (Sicil: {personel.SicilNumarasi}) şifresini değiştirdi.", personel.Id, HttpContext.Connection.RemoteIpAddress?.ToString());

            return Ok(new { Status = "Success", Message = "Şifre başarıyla güncellendi." });
        }
    }
} 