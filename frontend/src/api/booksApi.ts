// Base URL for the backend API.
// In development, this is empty so requests go through the Vite proxy (vite.config.ts).
// In production, this points to the deployed Azure backend.
const API_URL = import.meta.env.VITE_API_URL || 'https://bookstore-jessop-backend-ajegcsgmabdabchf.eastus-01.azurewebsites.net';

// Fetches a paginated, sorted, and optionally filtered list of books
export const fetchBooks = async (
  pageSize: number,
  pageNumber: number,
  sortOrder: string,
  category?: string,
) => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
    sortOrder,
  });
  if (category) {
    params.set('category', category);
  }

  const response = await fetch(`${API_URL}/api/books?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
};

// Fetches the list of distinct book categories
export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/api/books/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

// Adds a new book to the database
export const addBook = async (book: object) => {
  const response = await fetch(`${API_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to add book');
  }
  return response.json();
};

// Updates an existing book by ID
export const updateBook = async (bookID: number, book: object) => {
  const response = await fetch(`${API_URL}/api/books/${bookID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
};

// Deletes a book by ID
export const deleteBook = async (bookID: number) => {
  const response = await fetch(`${API_URL}/api/books/${bookID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
};
