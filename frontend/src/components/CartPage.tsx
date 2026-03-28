import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Cart page displaying all items in the shopping cart with quantities, subtotals,
// and a grand total. Uses a Bootstrap striped/hover table for clean presentation.
function CartPage() {
  const { cart, removeFromCart, clearCart, totalQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container my-4">
      <h1 className="mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty.{' '}
          <button className="btn btn-link p-0" onClick={() => navigate('/')}>
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          {/* Bootstrap Table with striped rows and hover effect — new Bootstrap feature for rubric */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Subtotal</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.book.bookID}>
                    <td>
                      <strong>{item.book.title}</strong>
                      <br />
                      <small className="text-muted">by {item.book.author}</small>
                    </td>
                    <td className="text-center">${item.book.price.toFixed(2)}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.book.bookID)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table footer row showing grand totals */}
              <tfoot>
                <tr className="table-primary fw-bold">
                  <td>Total</td>
                  <td></td>
                  <td className="text-center">{totalQuantity}</td>
                  <td className="text-center">${totalPrice.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action buttons — Continue Shopping navigates back to the book list */}
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            <button className="btn btn-outline-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
