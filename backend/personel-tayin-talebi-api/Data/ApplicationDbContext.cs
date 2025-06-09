using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Models;
using System.Collections.Generic;

namespace personel_tayin_talebi_api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Personel> Personeller { get; set; }
        public DbSet<Adliye> Adliyeler { get; set; }
        public DbSet<Talep> Talepler { get; set; }
        public DbSet<Unvan> Unvanlar { get; set; }
        public DbSet<TalepTuru> TalepTurleri { get; set; }
        public DbSet<TalepDurumu> TalepDurumlari { get; set; }
        public DbSet<IslemKaydi> IslemKayitlari { get; set; }
        public DbSet<CalismaGecmisi> CalismaGecmisleri { get; set; }
        public DbSet<Rol> Roller { get; set; }
        public DbSet<Bolge> Bolgeler { get; set; }
        public DbSet<TayinDonemi> TayinDonemleri { get; set; }
        public DbSet<Duyuru> Duyurular { get; set; }
        public DbSet<TalepTercihi> TalepTercihleri { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Personel>(entity =>
            {
                entity.HasIndex(u => u.SicilNumarasi).IsUnique();
                entity.HasMany(p => p.Roller).WithMany(r => r.Personeller)
                    .UsingEntity<Dictionary<string, object>>(
                        "PersonelRolleri",
                        j => j.HasOne<Rol>().WithMany().HasForeignKey("RolId"),
                        j => j.HasOne<Personel>().WithMany().HasForeignKey("PersonelId")
                    );
            });
            
            modelBuilder.Entity<Talep>()
                .HasOne(t => t.MevcutAdliye)
                .WithMany()
                .HasForeignKey(t => t.MevcutAdliyeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Talep>()
                .HasMany(t => t.TalepTercihleri)
                .WithOne(tt => tt.Talep)
                .HasForeignKey(tt => tt.TalepId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TalepTercihi>()
                .HasOne(tt => tt.Adliye)
                .WithMany()
                .HasForeignKey(tt => tt.AdliyeId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Talep>()
                .HasOne(t => t.AtananAdliye)
                .WithMany()
                .HasForeignKey(t => t.AtananAdliyeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CalismaGecmisi>()
                .HasOne(cg => cg.Personel)
                .WithMany(p => p.CalismaGecmisleri)
                .HasForeignKey(cg => cg.PersonelId);
        }
    }
} 