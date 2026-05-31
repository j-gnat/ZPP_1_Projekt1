using Microsoft.EntityFrameworkCore;
using ZPP_NJM_Soft.Server.Data.Entities;

namespace ZPP_NJM_Soft.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Campaign> Campaigns => Set<Campaign>();
}
