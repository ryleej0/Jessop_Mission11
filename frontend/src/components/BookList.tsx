import { useEffect, useState } from 'react';
import type { Book, BooksResponse } from '../types/Book';

// Reusable component that fetches and displays a paginated, sortable list of books.
// Communicates with the backend API at /api/books using query parameters for pagination and sorting.
function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default to 5 books per page per assignment requirements
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);

  // Fetch books from the API whenever page, page size, or sort order changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          pageNumber: currentPage.toString(),
          pageSize: pageSize.toString(),
          sortOrder,
        });
        const res = await fetch(`/api/books?${params}`);
        const data: BooksResponse = await res.json();

        setBooks(data.books);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, pageSize, sortOrder]);

  // Reset to page 1 when page size changes to avoid out-of-range pages
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Toggle between ascending and descending sort by title
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Bookstore</h1>

      {/* Controls bar: page size selector on the left, sort toggle on the right */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label htmlFor="pageSize" className="form-label me-2 mb-0">
            Books per page:
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm d-inline-block"
            style={{ width: 'auto' }}
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={toggleSortOrder}>
          Sort by Title {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Show a loading spinner while fetching data from the API */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Pagination summary showing current position */}
          <p className="text-muted">
            Showing {books.length} of {totalCount} books (Page {currentPage} of{' '}
            {totalPages})
          </p>

          {/* Book cards — each card displays all fields for a single book */}
          <div className="row g-3">
            {books.map((book) => (
              <div key={book.bookID} className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title mb-1">{book.title}</h5>
                        <p className="text-muted mb-2">by {book.author}</p>
                      </div>
                      <span className="badge bg-success fs-6">
                        ${book.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="row mt-2">
                      <div className="col-sm-4">
                        <small className="text-muted">Publisher:</small>
                        <br />
                        {book.publisher}
                      </div>
                      <div className="col-sm-4">
                        <small className="text-muted">ISBN:</small>
                        <br />
                        {book.isbn}
                      </div>
                      <div className="col-sm-4">
                        <small className="text-muted">Pages:</small>
                        <br />
                        {book.pageCount}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="badge bg-primary me-1">
                        {book.classification}
                      </span>
                      <span className="badge bg-secondary">{book.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls: Previous, numbered pages, and Next buttons */}
          <nav className="mt-4" aria-label="Book pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${page === currentPage ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default BookList;
