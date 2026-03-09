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

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)",
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
            padding: "24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Your Cart
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Review your selected items before checkout
            </p>
          </div>

          <Link to="/products" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Back to Products
            </button>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛒</div>
            <h3 style={{ margin: 0, color: "#111827" }}>Your cart is empty</h3>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Add some products to continue shopping.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr",
              gap: "24px",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
              }}
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

                  <div style={{ flex: 1 }}>
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
                    <p style={{ margin: "0 0 6px", color: "#6b7280" }}>
                      Quantity: {item.quantity}
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
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
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
                <span>Items</span>
                <span>{cart.length}</span>
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

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Delivery Address
              </label>

              <textarea
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f9fafb",
                  resize: "none",
                  marginBottom: "18px",
                }}
              />

              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background: loading ? "#9ca3af" : "#4f46e5",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 10px 20px rgba(79, 70, 229, 0.25)",
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