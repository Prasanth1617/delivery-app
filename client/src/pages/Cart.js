import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      if (cart.length === 0) {
        alert("Cart is empty 🛒");
        return;
      }

      if (!address.trim()) {
        alert("Please enter delivery address");
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
      alert("Order placed ✅");
      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Checkout failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-card topbar-card">
          <div>
            <h2 className="app-section-title">Your Cart</h2>
            <p className="app-section-subtitle">
              Review your selected items before checkout
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link to="/products">
              <button className="secondary-btn">Back to Products</button>
            </Link>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  background: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 18px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="app-card empty-state">
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛒</div>
            <h3 style={{ margin: 0, color: "#111827" }}>Your cart is empty</h3>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Add some products to continue shopping.
            </p>

            <div style={{ marginTop: "18px" }}>
              <Link to="/products">
                <button className="primary-btn">Browse Products</button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid-2">
            <div
              className="app-card"
              style={{ padding: "24px" }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  color: "#111827",
                }}
              >
                Cart Items
              </h3>

              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    marginBottom: "14px",
                    background: "#fafafa",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "14px",
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "26px",
                      flexShrink: 0,
                    }}
                  >
                    📦
                  </div>

                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <h4
                      style={{
                        margin: "0 0 8px",
                        color: "#111827",
                        fontSize: "17px",
                      }}
                    >
                      {item.name}
                    </h4>

                    <p style={{ margin: "0 0 6px", color: "#6b7280" }}>
                      Price: ₹{item.price}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontWeight: "700",
                        color: "#4f46e5",
                      }}
                    >
                      Subtotal: ₹{item.price * item.quantity}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "6px 10px",
                      }}
                    >
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        style={{
                          border: "none",
                          background: "#e5e7eb",
                          width: "30px",
                          height: "30px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        -
                      </button>

                      <span
                        style={{
                          minWidth: "22px",
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item._id)}
                        style={{
                          border: "none",
                          background: "#4f46e5",
                          color: "#ffffff",
                          width: "30px",
                          height: "30px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      style={{
                        border: "none",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="app-card"
              style={{
                padding: "24px",
                height: "fit-content",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  color: "#111827",
                }}
              >
                Order Summary
              </h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  color: "#374151",
                }}
              >
                <span>Total Unique Items</span>
                <span>{cart.length}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  color: "#374151",
                }}
              >
                <span>Total Quantity</span>
                <span>{totalItems}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "18px",
                  color: "#374151",
                }}
              >
                <span>Total Amount</span>
                <span style={{ fontWeight: "700", color: "#111827" }}>
                  ₹{totalAmount}
                </span>
              </div>

              <label className="label-text">Delivery Address</label>

              <textarea
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="input-field"
                style={{
                  resize: "none",
                  marginBottom: "18px",
                }}
              />

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="primary-btn"
                style={{
                  width: "100%",
                  background: loading ? "#9ca3af" : "#4f46e5",
                }}
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