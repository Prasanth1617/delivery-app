import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = existingCart.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
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
              Products
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Explore available items and add them to your cart
            </p>
          </div>

          <Link to="/cart" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(79, 70, 229, 0.25)",
              }}
            >
              Go to Cart 🛒
            </button>
          </Link>
        </div>

        {products.length === 0 ? (
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
            <h3 style={{ margin: 0, color: "#111827" }}>No products found</h3>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Products will appear here once they are added by admin.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "20px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                  transition: "0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "140px",
                    background: "#eef2ff",
                    borderRadius: "14px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                  }}
                >
                  🛍️
                </div>

                <h4
                  style={{
                    margin: "0 0 10px",
                    fontSize: "18px",
                    color: "#111827",
                  }}
                >
                  {product.name}
                </h4>

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
                    background: product.stock > 0 ? "#dcfce7" : "#fee2e2",
                    color: product.stock > 0 ? "#166534" : "#991b1b",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "16px",
                  }}
                >
                  {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    borderRadius: "12px",
                    background: product.stock > 0 ? "#111827" : "#9ca3af",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: product.stock > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  {product.stock > 0 ? "Add to Cart" : "Unavailable"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;