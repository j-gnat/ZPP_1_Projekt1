using Microsoft.EntityFrameworkCore;
using ZPP_NJM_Soft.Server.Data.Entities;

namespace ZPP_NJM_Soft.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    
}
