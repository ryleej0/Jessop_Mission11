// TypeScript interface matching the Book entity from the backend API.
// Property names are camelCase because ASP.NET Core serializes C# PascalCase to camelCase by default.
export interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

// Shape of the paginated response returned by GET /api/books
export interface BooksResponse {
  books: Book[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Represents a single item in the shopping cart
export interface CartItem {
  book: Book;
  quantity: number;
}
