using ElectronicSignature.API.Data.Repositories.Interfaces;
using ElectronicSignature.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ElectronicSignature.API.Data.Repositories.Implementations;

public class ExhibitorRepository : IExhibitorRepository
{
    private readonly ApplicationDbContext _context;

    public ExhibitorRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<Exhibitor?> GetByIdAsync(int id)
    {
        return _context.Exhibitors.FirstOrDefaultAsync(x => x.Id == id);
    }

    public Task<Exhibitor?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return _context.Exhibitors.FirstOrDefaultAsync(x => x.Email.ToLower() == normalizedEmail);
    }

    public async Task AddAsync(Exhibitor exhibitor)
    {
        await _context.Exhibitors.AddAsync(exhibitor);
    }

    public Task SaveChangesAsync()
    {
        return _context.SaveChangesAsync();
    }
}
