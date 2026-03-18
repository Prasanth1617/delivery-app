import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div
      className="app-page"
      style={{
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
        minHeight: "100vh",
        padding: isMobile ? "14px" : "20px",
      }}
    >
      <div
        className="app-container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          className="app-card topbar-card"
          style={{
            padding: isMobile ? "18px" : "28px",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(238,242,255,0.92))",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: "18px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "#eef2ff",
                  color: "#4338ca",
                  fontWeight: "700",
                  fontSize: "12px",
                  marginBottom: "14px",
                  flexWrap: "wrap",
                }}
              >
                🛒 Premium Cart Experience
              </div>

              <h2
                className="app-section-title"
                style={{
                  marginBottom: "8px",
                  marginTop: 0,
                  fontSize: isMobile ? "26px" : "34px",
                  letterSpacing: "-0.4px",
                  lineHeight: "1.2",
                }}
              >
                Your Cart
              </h2>

              <p
                className="app-section-subtitle"
                style={{
                  fontSize: isMobile ? "14px" : "15px",
                  maxWidth: "560px",
                  lineHeight: "1.7",
                  margin: 0,
                  color: "#4b5563",
                }}
              >
                Review your selected items, update quantities and proceed to a
                smooth checkout experience.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Link
                to="/products"
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <button
                  className="secondary-btn"
                  style={{
                    padding: "14px 18px",
                    borderRadius: "14px",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Back to Products
                </button>
              </Link>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "14px",
                    padding: "14px 18px",
                    fontSize: "14px",
                    fontWeight: "800",
                    cursor: "pointer",
                    boxShadow: "0 12px 22px rgba(220, 38, 38, 0.18)",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div
            className="app-card empty-state"
            style={{
              borderRadius: "24px",
              padding: isMobile ? "40px 18px" : "56px 24px",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
              background: "#fff",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "14px" }}>🛒</div>

            <h3
              style={{
                margin: 0,
                color: "#111827",
                fontSize: isMobile ? "22px" : "24px",
              }}
            >
              Your cart is empty
            </h3>

            <p
              style={{
                color: "#6b7280",
                marginTop: "12px",
                fontSize: "15px",
                maxWidth: "460px",
                marginInline: "auto",
              }}
            >
              Add some amazing products to continue your shopping journey.
            </p>

            <div style={{ marginTop: "20px" }}>
              <Link to="/products">
                <button className="primary-btn">Browse Products</button>
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            <div
              className="app-card fade-card"
              style={{
                padding: isMobile ? "18px" : "26px",
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
                background: "#ffffff",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  color: "#111827",
                  fontSize: isMobile ? "20px" : "24px",
                }}
              >
                Cart Items
              </h3>

              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "stretch" : "center",
                    justifyContent: "space-between",
                    padding: isMobile ? "14px" : "18px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "20px",
                    marginBottom: "16px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "center",
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "68px" : "82px",
                        height: isMobile ? "68px" : "82px",
                        borderRadius: "18px",
                        background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "30px",
                        flexShrink: 0,
                        border: "1px solid #e0e7ff",
                        overflow: "hidden",
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "📦"
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          margin: "0 0 8px",
                          color: "#111827",
                          fontSize: isMobile ? "16px" : "18px",
                          fontWeight: "800",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.name}
                      </h4>

                      <p
                        style={{
                          margin: "0 0 6px",
                          color: "#6b7280",
                          fontSize: "14px",
                        }}
                      >
                        Price: ₹{item.price}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          fontWeight: "800",
                          color: "#4f46e5",
                          fontSize: "15px",
                        }}
                      >
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "row" : "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      width: isMobile ? "100%" : "auto",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "14px",
                        padding: "7px 10px",
                        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
                      }}
                    >
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        style={{
                          border: "none",
                          background: "#e5e7eb",
                          width: "32px",
                          height: "32px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "800",
                          color: "#111827",
                        }}
                      >
                        -
                      </button>

                      <span
                        style={{
                          minWidth: "26px",
                          textAlign: "center",
                          fontWeight: "800",
                          color: "#111827",
                          fontSize: "15px",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item._id)}
                        style={{
                          border: "none",
                          background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          color: "#ffffff",
                          width: "32px",
                          height: "32px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "800",
                          boxShadow: "0 8px 16px rgba(79, 70, 229, 0.18)",
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
                        padding: "10px 14px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: "800",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="app-card fade-card"
              style={{
                padding: isMobile ? "18px" : "26px",
                height: "fit-content",
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
                background: "#ffffff",
                position: isMobile ? "static" : "sticky",
                top: isMobile ? "auto" : "90px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  color: "#111827",
                  fontSize: isMobile ? "20px" : "24px",
                }}
              >
                Order Summary
              </h3>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "18px",
                  padding: "18px",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    color: "#374151",
                    fontWeight: "600",
                    gap: "12px",
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
                    fontWeight: "600",
                    gap: "12px",
                  }}
                >
                  <span>Total Quantity</span>
                  <span>{totalItems}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#111827",
                    fontWeight: "800",
                    fontSize: "18px",
                    gap: "12px",
                  }}
                >
                  <span>Total Amount</span>
                  <span style={{ color: "#4f46e5" }}>₹{totalAmount}</span>
                </div>
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
                  borderRadius: "14px",
                  background: "#f9fafb",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="primary-btn"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: loading
                    ? "none"
                    : "0 14px 28px rgba(79, 70, 229, 0.24)",
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