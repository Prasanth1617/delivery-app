import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

  const cart = getCart();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartQuantity = (productId) => {
    const item = cart.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product) => {
    const existingCart = getCart();

    const index = existingCart.findIndex((item) => item._id === product._id);

    if (index > -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.location.reload();
  };

  const decreaseCart = (product) => {
    const existingCart = getCart();

    const index = existingCart.findIndex((item) => item._id === product._id);

    if (index > -1) {
      existingCart[index].quantity -= 1;

      if (existingCart[index].quantity <= 0) {
        existingCart.splice(index, 1);
      }
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.location.reload();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products`
        );
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-card topbar-card">
          <div>
            <h2 className="app-section-title">Products</h2>
            <p className="app-section-subtitle">
              Browse and add items to your cart
            </p>
          </div>

          <Link to="/cart">
            <button className="primary-btn">
              Cart 🛒 ({totalCartItems})
            </button>
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => {
            const qty = getCartQuantity(product._id);

            return (
              <div key={product._id} className="app-card">
                <div
                  style={{
                    height: "140px",
                    background: "#eef2ff",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    marginBottom: "12px",
                  }}
                >
                  📦
                </div>

                <h3 style={{ margin: "0 0 6px" }}>{product.name}</h3>

                <p style={{ color: "#6b7280", margin: "0 0 12px" }}>
                  ₹{product.price}
                </p>

                {product.stock === 0 ? (
                  <button className="secondary-btn" disabled>
                    Unavailable
                  </button>
                ) : qty === 0 ? (
                  <button
                    className="primary-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() => decreaseCart(product)}
                      style={{
                        width: "30px",
                        height: "30px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#e5e7eb",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>

                    <span style={{ fontWeight: "700" }}>{qty}</span>

                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        width: "30px",
                        height: "30px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#4f46e5",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Products;