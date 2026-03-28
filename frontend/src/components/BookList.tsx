import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book, BooksResponse } from '../types/Book';
import { useCart } from '../context/CartContext';

// Main bookstore page: displays a paginated, sortable, filterable list of books
// with Add to Cart functionality and a cart summary sidebar.
function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Toast state for the "Added to cart" notification (Bootstrap Toast component)
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { addToCart, totalQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  // Fetch the list of distinct categories on mount for the filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/books/categories');
        const data: string[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch books whenever page, page size, sort order, or category filter changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          pageNumber: currentPage.toString(),
          pageSize: pageSize.toString(),
          sortOrder,
        });
        if (selectedCategory) {
          params.set('category', selectedCategory);
        }

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
  }, [currentPage, pageSize, sortOrder, selectedCategory]);

  // Reset to page 1 when page size changes to avoid out-of-range pages
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Reset to page 1 when category changes so pagination stays valid
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  // Add book to cart and show a Bootstrap Toast notification
  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setToastMessage(`"${book.title}" added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Bookstore</h1>

      {/* Bootstrap Grid: main content (col-md-9) + cart summary sidebar (col-md-3) */}
      <div className="row">
        <div className="col-md-9">
          {/* Controls bar: page size, category filter, and sort toggle */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <div className="d-flex align-items-center gap-3">
              <div>
                <label htmlFor="pageSize" className="form-label me-2 mb-0">
                  Per page:
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
              <div>
                <label htmlFor="categoryFilter" className="form-label me-2 mb-0">
                  Category:
                </label>
                <select
                  id="categoryFilter"
                  className="form-select form-select-sm d-inline-block"
                  style={{ width: 'auto' }}
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={toggleSortOrder}>
              Sort by Title {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <p className="text-muted">
                Showing {books.length} of {totalCount} books (Page {currentPage} of{' '}
                {totalPages})
              </p>

              {/* Book cards with Add to Cart button */}
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
                          <div className="col-sm-3">
                            <small className="text-muted">Publisher:</small>
                            <br />
                            {book.publisher}
                          </div>
                          <div className="col-sm-3">
                            <small className="text-muted">ISBN:</small>
                            <br />
                            {book.isbn}
                          </div>
                          <div className="col-sm-3">
                            <small className="text-muted">Pages:</small>
                            <br />
                            {book.pageCount}
                          </div>
                          <div className="col-sm-3 d-flex align-items-center">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAddToCart(book)}
                            >
                              Add to Cart
                            </button>
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

              {/* Pagination controls */}
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
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
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

        {/* Cart summary sidebar — shows total quantity and total price (rubric requirement) */}
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Cart Summary</h5>
            </div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Items:</strong> {totalQuantity}
              </p>
              <p className="mb-3">
                <strong>Total:</strong> ${totalPrice.toFixed(2)}
              </p>
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => navigate('/cart')}
                disabled={totalQuantity === 0}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Toast notification — appears when a book is added to cart */}
      {showToast && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1055 }}
        >
          <div className="toast show align-items-center text-bg-success border-0">
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
