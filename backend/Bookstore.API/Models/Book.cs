using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bookstore.API.Models;

// Represents a book entity, mapped to the "Books" table in the SQLite database.
// Each property corresponds to a column and all fields are required per the assignment spec.
[Table("Books")]
public class Book
{
    [Key]
    public int BookID { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Required]
    public string ISBN { get; set; } = string.Empty;

    // Classification and Category are stored as separate columns in the database
    [Required]
    public string Classification { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public int PageCount { get; set; }

    // Price is stored as REAL in SQLite; mapped to decimal for precision in C#
    [Required]
    [Column(TypeName = "REAL")]
    public decimal Price { get; set; }
}
