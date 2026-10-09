using ElectronicSignature.API.Models;

namespace ElectronicSignature.API.Data.Repositories.Interfaces;

public interface IExhibitorRepository
{
    Task<Exhibitor?> GetByIdAsync(int id);
    Task<Exhibitor?> GetByEmailAsync(string email);
    Task AddAsync(Exhibitor exhibitor);
    Task SaveChangesAsync();
}
