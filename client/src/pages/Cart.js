import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("address", address);
  }, [address]);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    saveCart(updatedCart);
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("storage"));
    toast.success("Cart cleared successfully");
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      if (cart.length === 0) {
        toast.warning("Cart is empty 🛒");
        return;
      }

      if (!address.trim()) {
        toast.warning("Please enter delivery address");
        return;
      }

      setLoading(true);

      const payload = {
        items: cart.map((p) => ({
          productId: p._id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
        })),
        totalAmount,
        address,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/create`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("cart");
      setCart([]);
      window.dispatchEvent(new Event("storage"));
      toast.success("Order placed successfully ✅");
      navigate("/orders");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Checkout failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page cart-page">
      <div className="app-container cart-container">
        <div className="app-card topbar-card cart-top-card">
          <div className="cart-top-inner">
            <div className="cart-top-left">
              <div className="cart-top-pill">🛒 Premium Cart Experience</div>

              <h2 className="app-section-title cart-top-title">Your Cart</h2>

              <p className="app-section-subtitle cart-top-subtitle">
                Review your selected items, update quantities and proceed to a
                smooth checkout experience.
              </p>
            </div>

            <div className="cart-top-actions">
              <Link to="/products" className="cart-top-link">
                <button className="secondary-btn cart-top-btn" type="button">
                  Back to Products
                </button>
              </Link>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="cart-clear-btn"
                  type="button"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="app-card empty-state cart-empty-card">
            <div className="cart-empty-icon">🛒</div>

            <h3 className="cart-empty-title">Your cart is empty</h3>

            <p className="cart-empty-text">
              Add some amazing products to continue your shopping journey.
            </p>

            <div className="cart-empty-action">
              <Link to="/products">
                <button className="primary-btn" type="button">
                  Browse Products
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="app-card fade-card cart-items-card">
              <h3 className="cart-section-title">Cart Items</h3>

              {cart.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <div className="cart-item-main">
                    <div className="cart-item-image-wrap">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      ) : (
                        "📦"
                      )}
                    </div>

                    <div className="cart-item-content">
                      <h4 className="cart-item-name">{item.name}</h4>

                      <p className="cart-item-price">Price: ₹{item.price}</p>

                      <p className="cart-item-subtotal">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-qty-box">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="cart-qty-btn cart-qty-btn-minus"
                        type="button"
                      >
                        -
                      </button>

                      <span className="cart-qty-value">{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="cart-qty-btn cart-qty-btn-plus"
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="cart-remove-btn"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="app-card fade-card cart-summary-card">
              <h3 className="cart-section-title">Order Summary</h3>

              <div className="cart-summary-box">
                <div className="cart-summary-row">
                  <span>Total Unique Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="cart-summary-row">
                  <span>Total Quantity</span>
                  <span>{totalItems}</span>
                </div>

                <div className="cart-summary-row cart-summary-total">
                  <span>Total Amount</span>
                  <span className="cart-summary-total-value">₹{totalAmount}</span>
                </div>
              </div>

              <label className="label-text">Delivery Address</label>

              <textarea
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="input-field cart-address-input"
              />

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`primary-btn cart-checkout-btn ${loading ? "loading" : ""}`}
                type="button"
              >
                {loading ? "Placing Order..." : "Checkout ✅"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;