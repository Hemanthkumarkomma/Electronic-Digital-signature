using Microsoft.EntityFrameworkCore;
using ElectronicSignature.API.Models;

namespace ElectronicSignature.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Exhibitor> Exhibitors { get; set; }

    public DbSet<ConsentForm> ConsentForms { get; set; }
}