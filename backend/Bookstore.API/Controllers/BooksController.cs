using Bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers;

// API controller for managing book data.
// Provides a GET endpoint with server-side pagination and sorting by title.
[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET: api/books?pageNumber=1&pageSize=5&sortOrder=asc
    // Returns a paginated, sorted list of books along with metadata for the frontend pagination controls.
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string sortOrder = "asc")
    {
        var query = _context.Books.AsQueryable();

        // Sort by title — ascending by default, descending if requested
        query = sortOrder.ToLower() == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        // Calculate total count and pages for pagination metadata
        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        // Apply pagination: skip previous pages, take only the requested page size
        var books = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Return books along with pagination info so the frontend can render page controls
        return Ok(new
        {
            books,
            totalCount,
            totalPages,
            currentPage = pageNumber,
            pageSize
        });
    }
}
