using Microsoft.EntityFrameworkCore;
namespace Hachi.Data;
public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<OAuth> OAuth { get; set; }
    public DbSet<School> Schools { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<User>().HasKey(u => u.UserId);
    modelBuilder.Entity<OAuth>().HasKey(o => o.OAuthId);

    modelBuilder.Entity<OAuth>()
        .HasOne(o => o.User)
        .WithMany()
        .HasForeignKey(o => o.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    // 👇 Fix for lowercase table and column names
    modelBuilder.Entity<School>(entity =>
    {
        entity.ToTable("schools"); // match lowercase table name
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.Name).HasColumnName("name");
        entity.Property(e => e.City).HasColumnName("city");
        entity.Property(e => e.State).HasColumnName("state");
        entity.Property(e => e.Type).HasColumnName("type");
    });
}
}
