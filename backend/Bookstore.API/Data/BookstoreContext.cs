using Bookstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Data;

// EF Core database context for the Bookstore application.
// Configured in Program.cs to use the SQLite provider with the connection string from appsettings.json.
public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
    {
    }

    // DbSet representing the Books table — EF Core uses this to query and save Book entities
    public DbSet<Book> Books { get; set; }
}
