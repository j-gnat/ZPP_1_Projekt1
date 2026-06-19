using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using System.IO;
using ZPP_NJM_Soft.Server.Data;
using ZPP_NJM_Soft.Server.Data.Entities;

namespace ZPP_NJM_Soft.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddSwaggerGen();

            var configuredConnectionString = builder.Configuration.GetConnectionString("Default");
            var sqliteConnectionStringBuilder = new SqliteConnectionStringBuilder(configuredConnectionString);

            if (!string.IsNullOrWhiteSpace(sqliteConnectionStringBuilder.DataSource) &&
                sqliteConnectionStringBuilder.DataSource != ":memory:" &&
                !Path.IsPathRooted(sqliteConnectionStringBuilder.DataSource))
            {
                var absoluteDataSource = Path.GetFullPath(
                    Path.Combine(builder.Environment.ContentRootPath, sqliteConnectionStringBuilder.DataSource));

                var dbDirectory = Path.GetDirectoryName(absoluteDataSource);
                if (!string.IsNullOrWhiteSpace(dbDirectory))
                    Directory.CreateDirectory(dbDirectory);

                sqliteConnectionStringBuilder.DataSource = absoluteDataSource;
            }

            builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Warning);
            builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Infrastructure", LogLevel.Warning);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(sqliteConnectionStringBuilder.ConnectionString));

            var app = builder.Build();

            app.Logger.LogInformation("SQLite Data Source: {DataSource}", sqliteConnectionStringBuilder.DataSource);

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.EnsureCreated();

                if (!db.Campaigns.Any())
                {
                    db.Campaigns.AddRange(
                        new Campaign
                        {
                            Name = "Welcome Series",
                            Type = "Email",
                            Status = "active",
                            Sent = 1240,
                            Opened = 680,
                            Subject = "Witamy!",
                            Body = "Cześć! Dziękujemy za zapis.",
                            CreatedAt = DateTimeOffset.UtcNow.AddDays(-14)
                        },
                        new Campaign
                        {
                            Name = "Black Friday Promo",
                            Type = "Email",
                            Status = "scheduled",
                            Sent = 0,
                            Opened = 0,
                            ScheduledFor = DateTimeOffset.UtcNow.AddDays(2),
                            Subject = "Black Friday – -50%",
                            Body = "Tylko dziś!",
                            CreatedAt = DateTimeOffset.UtcNow.AddDays(-3)
                        },
                        new Campaign
                        {
                            Name = "Cart Abandonment",
                            Type = "SMS",
                            Status = "active",
                            Sent = 340,
                            Opened = 290,
                            Body = "Wygląda na to, że nie dokończyłeś zakupu. Potrzebujesz pomocy?",
                            CreatedAt = DateTimeOffset.UtcNow.AddDays(-5)
                        });

                    db.SaveChanges();
                }
                if (!db.Courses.Any())
                {
                    
                    var marketingCourse = new Course 
                    { 
                        Title = "Marketing Cyfrowy", 
                        Description = "Podstawy budowania lejków sprzedaży.",
                        Modules = new List<Module>()
                    };

                    var module1 = new Module { Name = "Wprowadzenie do marketingu", Order = 1, Course = marketingCourse };
                    var module2 = new Module { Name = "Budowanie lejków", Order = 2, Course = marketingCourse };

                    module1.Lessons = new List<Lesson>
                    {
                        new Lesson { Title = "Czym jest marketing cyfrowy?", Content = "Treść lekcji 1", VideoUrl = "https://example.com/video1.mp4", Module = module1 },
                        new Lesson { Title = "Podstawowe pojęcia", Content = "Treść lekcji 2", VideoUrl = "https://example.com/video2.mp4", Module = module1 }
                    };

                    module2.Lessons = new List<Lesson>
                    {
                        new Lesson { Title = "Jak stworzyć lejek?", Content = "Treść lekcji 3", VideoUrl = "https://example.com/video3.mp4", Module = module2 }
                    };

                    // 4. Dodajemy wszystko do bazy
                    db.Courses.Add(marketingCourse);
                    db.Modules.AddRange(module1, module2);
                    db.Lessons.AddRange(module1.Lessons.Concat(module2.Lessons));
                    
                    db.SaveChanges();
                }
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
