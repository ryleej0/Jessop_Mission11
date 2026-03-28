import { Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import CartPage from './components/CartPage';

// Main App component — defines routes for the book list (home) and cart pages
function App() {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
}

export default App;
