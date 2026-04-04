import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { fetchBooks as apiFetchBooks, addBook, updateBook, deleteBook } from '../api/booksApi';

// Empty book template used to reset the form when adding a new book
const emptyBook: Omit<Book, 'bookID'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

// Admin page for managing books — supports adding, editing, and deleting books.
function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState(emptyBook);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Fetch all books (unpaginated) for the admin table
  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const data = await apiFetchBooks(1000, 1, 'asc');
      setBooks(data.books);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  // Update form state when an input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  // Open the form pre-filled for editing an existing book
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open a blank form for adding a new book
  const handleAddNew = () => {
    setEditingBook(null);
    setFormData(emptyBook);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel the form and return to the book table
  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData(emptyBook);
  };

  // Submit the form — calls POST for new books or PUT for existing ones
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBook) {
        await updateBook(editingBook.bookID, { ...formData, bookID: editingBook.bookID });
      } else {
        await addBook(formData);
      }

      handleCancel();
      await fetchAllBooks();
    } catch (err) {
      console.error('Failed to save book:', err);
    }
  };

  // Delete a book after confirmation
  const handleDelete = async (bookID: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await deleteBook(bookID);
      await fetchAllBooks();
    } catch (err) {
      console.error('Failed to delete book:', err);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Books</h1>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Back to Store
        </button>
      </div>

      {/* Add/Edit form — shown when the user clicks Add New Book or Edit */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{editingBook ? 'Edit Book' : 'Add New Book'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Publisher</label>
                  <input
                    type="text"
                    className="form-control"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    className="form-control"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Classification</label>
                  <input
                    type="text"
                    className="form-control"
                    name="classification"
                    value={formData.classification}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Pages</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control"
                    name="pageCount"
                    value={formData.pageCount || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-control"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action bar with Add New Book button */}
      {!showForm && (
        <button className="btn btn-success mb-3" onClick={handleAddNew}>
          + Add New Book
        </button>
      )}

      {/* Books table — lists all books with Edit and Delete actions */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th className="text-center">Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookID}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className="badge bg-secondary">{book.category}</span>
                  </td>
                  <td className="text-center">${book.price.toFixed(2)}</td>
                  <td className="text-center">
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(book.bookID)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBooks;
