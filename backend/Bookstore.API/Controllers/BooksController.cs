using Bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers;

// API controller for managing book data.
// Provides endpoints for paginated/sorted/filtered book listing and distinct category retrieval.
[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET: api/books?pageNumber=1&pageSize=5&sortOrder=asc&category=Fiction
    // Returns a paginated, sorted, and optionally filtered list of books with pagination metadata.
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string sortOrder = "asc",
        [FromQuery] string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // Filter by category if provided (exact match)
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

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

    // GET: api/books/categories
    // Returns a sorted list of distinct book categories for the filter dropdown.
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }
}
