using Microsoft.EntityFrameworkCore;
namespace Hachi.Data;
public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<OAuth> OAuth { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Define primary keys
        modelBuilder.Entity<User>()
            .HasKey(u => u.UserId);
        
        modelBuilder.Entity<OAuth>()
            .HasKey(o => o.OAuthId);

        // Define foreign key relationship between OAuth and Users
        modelBuilder.Entity<OAuth>()
            .HasOne(o => o.User)
            .WithMany()
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
