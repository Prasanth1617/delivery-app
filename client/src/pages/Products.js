import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [, setCartVersion] = useState(0);

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

    if (product.stock <= 0) {
      alert(`${product.name} is out of stock`);
      return;
    }

    if (index !== -1) {
      if (existingCart[index].quantity >= product.stock) {
        alert(`Only ${product.stock} item(s) available for ${product.name}`);
        return;
      }

      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCartVersion((prev) => prev + 1);
    alert("Added to cart 🛒");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products`
        );
        setProducts(res.data);
      } catch (err) {
        console.log(err);
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
              Explore available items and add them to your cart
            </p>
          </div>

          <Link to="/cart" style={{ textDecoration: "none" }}>
            <button className="primary-btn">
              Go to Cart 🛒 {totalCartItems > 0 ? `(${totalCartItems})` : ""}
            </button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="app-card empty-state">
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛍️</div>
            <h3 style={{ margin: 0, color: "#111827" }}>No products found</h3>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Products will appear here once they are added by admin.
            </p>
          </div>
        ) : (
          <div className="grid-cards">
            {products.map((product) => {
              const cartQty = getCartQuantity(product._id);
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product._id}
                  className="app-card"
                  style={{
                    padding: "20px",
                    transition: "0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "160px",
                      background: "#eef2ff",
                      borderRadius: "14px",
                      marginBottom: "16px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "36px" }}>🛍️</div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      {product.category && (
                        <div
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: "#ede9fe",
                            color: "#5b21b6",
                            fontSize: "12px",
                            fontWeight: "700",
                            marginBottom: "10px",
                          }}
                        >
                          {product.category}
                        </div>
                      )}

                      <h4
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          color: "#111827",
                          lineHeight: "1.4",
                        }}
                      >
                        {product.name}
                      </h4>
                    </div>

                    {cartQty > 0 && (
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: "#ede9fe",
                          color: "#5b21b6",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        In Cart: {cartQty}
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#4f46e5",
                    }}
                  >
                    ₹{product.price}
                  </p>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: isOutOfStock ? "#fee2e2" : "#dcfce7",
                      color: isOutOfStock ? "#991b1b" : "#166534",
                      fontSize: "12px",
                      fontWeight: "700",
                      marginBottom: "16px",
                    }}
                  >
                    {isOutOfStock ? "Coming Soon" : `In Stock: ${product.stock}`}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "12px",
                      background: isOutOfStock ? "#9ca3af" : "#111827",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                    }}
                  >
                    {isOutOfStock
                      ? "Product Add Soon"
                      : cartQty > 0
                      ? "Add One More"
                      : "Add to Cart"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;