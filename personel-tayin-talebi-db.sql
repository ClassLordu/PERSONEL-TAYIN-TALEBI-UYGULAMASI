USE [personel-tayin-talebi-db]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 10.06.2025 01:29:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Adliyeler]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Adliyeler](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
	[Il] [nvarchar](max) NOT NULL,
	[Ilce] [nvarchar](max) NOT NULL,
	[BolgeId] [int] NOT NULL,
 CONSTRAINT [PK_Adliyeler] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AuditLogs]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuditLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](max) NULL,
	[UserName] [nvarchar](max) NULL,
	[IPAddress] [nvarchar](max) NULL,
	[Controller] [nvarchar](max) NULL,
	[Action] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[Timestamp] [datetime2](7) NOT NULL,
	[EntityName] [nvarchar](max) NULL,
	[EntityId] [nvarchar](max) NULL,
	[OperationType] [nvarchar](max) NULL,
 CONSTRAINT [PK_AuditLogs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bolgeler]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bolgeler](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
	[ZorunluHizmetSuresiYil] [int] NOT NULL,
 CONSTRAINT [PK_Bolgeler] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CalismaGecmisleri]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CalismaGecmisleri](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PersonelId] [int] NOT NULL,
	[AdliyeId] [int] NOT NULL,
	[UnvanId] [int] NOT NULL,
	[BaslamaTarihi] [datetime2](7) NOT NULL,
	[AyrilmaTarihi] [datetime2](7) NULL,
 CONSTRAINT [PK_CalismaGecmisleri] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Duyurular]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Duyurular](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Baslik] [nvarchar](max) NOT NULL,
	[Icerik] [nvarchar](max) NOT NULL,
	[YayinTarihi] [datetime2](7) NOT NULL,
	[AktifMi] [bit] NOT NULL,
 CONSTRAINT [PK_Duyurular] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IslemKayitlari]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IslemKayitlari](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Eylem] [nvarchar](max) NOT NULL,
	[Aciklama] [nvarchar](max) NOT NULL,
	[PersonelId] [int] NULL,
	[IpAdresi] [nvarchar](max) NULL,
	[Tarih] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_IslemKayitlari] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Personeller]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Personeller](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
	[Soyad] [nvarchar](max) NOT NULL,
	[SicilNumarasi] [nvarchar](450) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[HizmetPuani] [float] NOT NULL,
 CONSTRAINT [PK_Personeller] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PersonelRolleri]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PersonelRolleri](
	[PersonelId] [int] NOT NULL,
	[RolId] [int] NOT NULL,
 CONSTRAINT [PK_PersonelRolleri] PRIMARY KEY CLUSTERED 
(
	[PersonelId] ASC,
	[RolId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roller]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roller](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Roller] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TalepDurumlari]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TalepDurumlari](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_TalepDurumlari] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Talepler]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Talepler](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PersonelId] [int] NOT NULL,
	[MevcutAdliyeId] [int] NOT NULL,
	[Gerekce] [nvarchar](max) NOT NULL,
	[TalepTarihi] [datetime2](7) NOT NULL,
	[TalepTuruId] [int] NOT NULL,
	[TalepDurumuId] [int] NOT NULL,
	[KararTarihi] [datetime2](7) NULL,
	[KararAciklamasi] [nvarchar](max) NULL,
	[AtananAdliyeId] [int] NULL,
 CONSTRAINT [PK_Talepler] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TalepTercihleri]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TalepTercihleri](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SiraNumarasi] [int] NOT NULL,
	[TalepId] [int] NOT NULL,
	[AdliyeId] [int] NOT NULL,
 CONSTRAINT [PK_TalepTercihleri] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TalepTurleri]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TalepTurleri](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_TalepTurleri] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TayinDonemleri]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TayinDonemleri](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
	[BaslangicTarihi] [datetime2](7) NOT NULL,
	[BitisTarihi] [datetime2](7) NOT NULL,
	[AktifMi] [bit] NOT NULL,
 CONSTRAINT [PK_TayinDonemleri] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Unvanlar]    Script Date: 10.06.2025 01:30:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Unvanlar](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Ad] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Unvanlar] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Adliyeler]  WITH CHECK ADD  CONSTRAINT [FK_Adliyeler_Bolgeler_BolgeId] FOREIGN KEY([BolgeId])
REFERENCES [dbo].[Bolgeler] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Adliyeler] CHECK CONSTRAINT [FK_Adliyeler_Bolgeler_BolgeId]
GO
ALTER TABLE [dbo].[CalismaGecmisleri]  WITH CHECK ADD  CONSTRAINT [FK_CalismaGecmisleri_Adliyeler_AdliyeId] FOREIGN KEY([AdliyeId])
REFERENCES [dbo].[Adliyeler] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CalismaGecmisleri] CHECK CONSTRAINT [FK_CalismaGecmisleri_Adliyeler_AdliyeId]
GO
ALTER TABLE [dbo].[CalismaGecmisleri]  WITH CHECK ADD  CONSTRAINT [FK_CalismaGecmisleri_Personeller_PersonelId] FOREIGN KEY([PersonelId])
REFERENCES [dbo].[Personeller] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CalismaGecmisleri] CHECK CONSTRAINT [FK_CalismaGecmisleri_Personeller_PersonelId]
GO
ALTER TABLE [dbo].[CalismaGecmisleri]  WITH CHECK ADD  CONSTRAINT [FK_CalismaGecmisleri_Unvanlar_UnvanId] FOREIGN KEY([UnvanId])
REFERENCES [dbo].[Unvanlar] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CalismaGecmisleri] CHECK CONSTRAINT [FK_CalismaGecmisleri_Unvanlar_UnvanId]
GO
ALTER TABLE [dbo].[IslemKayitlari]  WITH CHECK ADD  CONSTRAINT [FK_IslemKayitlari_Personeller_PersonelId] FOREIGN KEY([PersonelId])
REFERENCES [dbo].[Personeller] ([Id])
GO
ALTER TABLE [dbo].[IslemKayitlari] CHECK CONSTRAINT [FK_IslemKayitlari_Personeller_PersonelId]
GO
ALTER TABLE [dbo].[PersonelRolleri]  WITH CHECK ADD  CONSTRAINT [FK_PersonelRolleri_Personeller_PersonelId] FOREIGN KEY([PersonelId])
REFERENCES [dbo].[Personeller] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PersonelRolleri] CHECK CONSTRAINT [FK_PersonelRolleri_Personeller_PersonelId]
GO
ALTER TABLE [dbo].[PersonelRolleri]  WITH CHECK ADD  CONSTRAINT [FK_PersonelRolleri_Roller_RolId] FOREIGN KEY([RolId])
REFERENCES [dbo].[Roller] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PersonelRolleri] CHECK CONSTRAINT [FK_PersonelRolleri_Roller_RolId]
GO
ALTER TABLE [dbo].[Talepler]  WITH CHECK ADD  CONSTRAINT [FK_Talepler_Adliyeler_AtananAdliyeId] FOREIGN KEY([AtananAdliyeId])
REFERENCES [dbo].[Adliyeler] ([Id])
GO
ALTER TABLE [dbo].[Talepler] CHECK CONSTRAINT [FK_Talepler_Adliyeler_AtananAdliyeId]
GO
ALTER TABLE [dbo].[Talepler]  WITH CHECK ADD  CONSTRAINT [FK_Talepler_Adliyeler_MevcutAdliyeId] FOREIGN KEY([MevcutAdliyeId])
REFERENCES [dbo].[Adliyeler] ([Id])
GO
ALTER TABLE [dbo].[Talepler] CHECK CONSTRAINT [FK_Talepler_Adliyeler_MevcutAdliyeId]
GO
ALTER TABLE [dbo].[Talepler]  WITH CHECK ADD  CONSTRAINT [FK_Talepler_Personeller_PersonelId] FOREIGN KEY([PersonelId])
REFERENCES [dbo].[Personeller] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Talepler] CHECK CONSTRAINT [FK_Talepler_Personeller_PersonelId]
GO
ALTER TABLE [dbo].[Talepler]  WITH CHECK ADD  CONSTRAINT [FK_Talepler_TalepDurumlari_TalepDurumuId] FOREIGN KEY([TalepDurumuId])
REFERENCES [dbo].[TalepDurumlari] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Talepler] CHECK CONSTRAINT [FK_Talepler_TalepDurumlari_TalepDurumuId]
GO
ALTER TABLE [dbo].[Talepler]  WITH CHECK ADD  CONSTRAINT [FK_Talepler_TalepTurleri_TalepTuruId] FOREIGN KEY([TalepTuruId])
REFERENCES [dbo].[TalepTurleri] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Talepler] CHECK CONSTRAINT [FK_Talepler_TalepTurleri_TalepTuruId]
GO
ALTER TABLE [dbo].[TalepTercihleri]  WITH CHECK ADD  CONSTRAINT [FK_TalepTercihleri_Adliyeler_AdliyeId] FOREIGN KEY([AdliyeId])
REFERENCES [dbo].[Adliyeler] ([Id])
GO
ALTER TABLE [dbo].[TalepTercihleri] CHECK CONSTRAINT [FK_TalepTercihleri_Adliyeler_AdliyeId]
GO
ALTER TABLE [dbo].[TalepTercihleri]  WITH CHECK ADD  CONSTRAINT [FK_TalepTercihleri_Talepler_TalepId] FOREIGN KEY([TalepId])
REFERENCES [dbo].[Talepler] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[TalepTercihleri] CHECK CONSTRAINT [FK_TalepTercihleri_Talepler_TalepId]
GO
