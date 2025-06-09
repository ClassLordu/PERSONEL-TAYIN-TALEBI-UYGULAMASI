using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace personel_tayin_talebi_api.Migrations
{
    /// <inheritdoc />
    public partial class add : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IPAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Controller = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EntityName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OperationType = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Bolgeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ZorunluHizmetSuresiYil = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bolgeler", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Duyurular",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Baslik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icerik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YayinTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AktifMi = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Duyurular", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Personeller",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Soyad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SicilNumarasi = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HizmetPuani = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personeller", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roller",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roller", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TalepDurumlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TalepDurumlari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TalepTurleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TalepTurleri", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TayinDonemleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BaslangicTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BitisTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AktifMi = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TayinDonemleri", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Unvanlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Unvanlar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Adliyeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Il = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ilce = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BolgeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adliyeler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Adliyeler_Bolgeler_BolgeId",
                        column: x => x.BolgeId,
                        principalTable: "Bolgeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IslemKayitlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Eylem = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonelId = table.Column<int>(type: "int", nullable: true),
                    IpAdresi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IslemKayitlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IslemKayitlari_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PersonelRolleri",
                columns: table => new
                {
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    RolId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonelRolleri", x => new { x.PersonelId, x.RolId });
                    table.ForeignKey(
                        name: "FK_PersonelRolleri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonelRolleri_Roller_RolId",
                        column: x => x.RolId,
                        principalTable: "Roller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CalismaGecmisleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    AdliyeId = table.Column<int>(type: "int", nullable: false),
                    UnvanId = table.Column<int>(type: "int", nullable: false),
                    BaslamaTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AyrilmaTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalismaGecmisleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CalismaGecmisleri_Adliyeler_AdliyeId",
                        column: x => x.AdliyeId,
                        principalTable: "Adliyeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CalismaGecmisleri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CalismaGecmisleri_Unvanlar_UnvanId",
                        column: x => x.UnvanId,
                        principalTable: "Unvanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Talepler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    MevcutAdliyeId = table.Column<int>(type: "int", nullable: false),
                    Gerekce = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TalepTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TalepTuruId = table.Column<int>(type: "int", nullable: false),
                    TalepDurumuId = table.Column<int>(type: "int", nullable: false),
                    KararTarihi = table.Column<DateTime>(type: "datetime2", nullable: true),
                    KararAciklamasi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AtananAdliyeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Talepler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Talepler_Adliyeler_AtananAdliyeId",
                        column: x => x.AtananAdliyeId,
                        principalTable: "Adliyeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Talepler_Adliyeler_MevcutAdliyeId",
                        column: x => x.MevcutAdliyeId,
                        principalTable: "Adliyeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Talepler_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Talepler_TalepDurumlari_TalepDurumuId",
                        column: x => x.TalepDurumuId,
                        principalTable: "TalepDurumlari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Talepler_TalepTurleri_TalepTuruId",
                        column: x => x.TalepTuruId,
                        principalTable: "TalepTurleri",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TalepTercihleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SiraNumarasi = table.Column<int>(type: "int", nullable: false),
                    TalepId = table.Column<int>(type: "int", nullable: false),
                    AdliyeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TalepTercihleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TalepTercihleri_Adliyeler_AdliyeId",
                        column: x => x.AdliyeId,
                        principalTable: "Adliyeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TalepTercihleri_Talepler_TalepId",
                        column: x => x.TalepId,
                        principalTable: "Talepler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Adliyeler_BolgeId",
                table: "Adliyeler",
                column: "BolgeId");

            migrationBuilder.CreateIndex(
                name: "IX_CalismaGecmisleri_AdliyeId",
                table: "CalismaGecmisleri",
                column: "AdliyeId");

            migrationBuilder.CreateIndex(
                name: "IX_CalismaGecmisleri_PersonelId",
                table: "CalismaGecmisleri",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_CalismaGecmisleri_UnvanId",
                table: "CalismaGecmisleri",
                column: "UnvanId");

            migrationBuilder.CreateIndex(
                name: "IX_IslemKayitlari_PersonelId",
                table: "IslemKayitlari",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_Personeller_SicilNumarasi",
                table: "Personeller",
                column: "SicilNumarasi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PersonelRolleri_RolId",
                table: "PersonelRolleri",
                column: "RolId");

            migrationBuilder.CreateIndex(
                name: "IX_Talepler_AtananAdliyeId",
                table: "Talepler",
                column: "AtananAdliyeId");

            migrationBuilder.CreateIndex(
                name: "IX_Talepler_MevcutAdliyeId",
                table: "Talepler",
                column: "MevcutAdliyeId");

            migrationBuilder.CreateIndex(
                name: "IX_Talepler_PersonelId",
                table: "Talepler",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_Talepler_TalepDurumuId",
                table: "Talepler",
                column: "TalepDurumuId");

            migrationBuilder.CreateIndex(
                name: "IX_Talepler_TalepTuruId",
                table: "Talepler",
                column: "TalepTuruId");

            migrationBuilder.CreateIndex(
                name: "IX_TalepTercihleri_AdliyeId",
                table: "TalepTercihleri",
                column: "AdliyeId");

            migrationBuilder.CreateIndex(
                name: "IX_TalepTercihleri_TalepId",
                table: "TalepTercihleri",
                column: "TalepId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "CalismaGecmisleri");

            migrationBuilder.DropTable(
                name: "Duyurular");

            migrationBuilder.DropTable(
                name: "IslemKayitlari");

            migrationBuilder.DropTable(
                name: "PersonelRolleri");

            migrationBuilder.DropTable(
                name: "TalepTercihleri");

            migrationBuilder.DropTable(
                name: "TayinDonemleri");

            migrationBuilder.DropTable(
                name: "Unvanlar");

            migrationBuilder.DropTable(
                name: "Roller");

            migrationBuilder.DropTable(
                name: "Talepler");

            migrationBuilder.DropTable(
                name: "Adliyeler");

            migrationBuilder.DropTable(
                name: "Personeller");

            migrationBuilder.DropTable(
                name: "TalepDurumlari");

            migrationBuilder.DropTable(
                name: "TalepTurleri");

            migrationBuilder.DropTable(
                name: "Bolgeler");
        }
    }
}
