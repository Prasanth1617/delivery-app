import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [address, setAddress] = useState("");

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

      await axios.post("http://localhost:5000/api/orders/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("cart");
      setCart([]);
      alert("Order placed ✅");
      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Checkout failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Cart</h2>
        <Link to="/products">Back to Products</Link>
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h4>{item.name}</h4>
              <p>Price: ₹{item.price}</p>
              <p>Qty: {item.quantity}</p>
              <p>Subtotal: ₹{item.price * item.quantity}</p>
            </div>
          ))}

          <h3>Total: ₹{totalAmount}</h3>

          <input
            style={{ width: "320px", padding: "10px", marginTop: "10px" }}
            placeholder="Enter delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <br />
          <button
            style={{ marginTop: "15px", padding: "10px 18px" }}
            onClick={handleCheckout}
          >
            Checkout ✅
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;