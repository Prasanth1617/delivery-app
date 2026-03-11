import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addProduct = async () => {
    try {
      if (!name || !price || !stock) {
        alert("Please fill product name, price and stock");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products`,
        {
          name,
          price: Number(price),
          stock: Number(stock),
          category,
          image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage("");

      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-card topbar-card">
          <div>
            <h2 className="app-section-title">Admin Product Manager</h2>
            <p className="app-section-subtitle">
              Add, view and manage products in your catalog
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="primary-btn"
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/admin/orders")}
            >
              Orders
            </button>
          </div>
        </div>

        <div className="grid-2">
          <div className="app-card" style={{ padding: "24px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "18px", color: "#111827" }}>
              Add Product
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label className="label-text">Product Name</label>
              <input
                className="input-field"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="label-text">Price</label>
              <input
                className="input-field"
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="label-text">Stock</label>
              <input
                className="input-field"
                type="number"
                placeholder="Enter available stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="label-text">Category</label>
              <input
                className="input-field"
                placeholder="Example: Grocery, Snacks, Drinks"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label className="label-text">Image URL</label>
              <input
                className="input-field"
                placeholder="Paste product image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <button className="primary-btn" onClick={addProduct}>
              Add Product
            </button>
          </div>

          <div className="app-card" style={{ padding: "24px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "18px", color: "#111827" }}>
              Product Summary
            </h3>

            <div style={{ display: "grid", gap: "14px" }}>
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "13px",
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  Total Products
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {products.length}
                </p>
              </div>

              <div
                style={{
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "13px",
                    color: "#4338ca",
                    fontWeight: "600",
                  }}
                >
                  Quick Note
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#312e81",
                    fontWeight: "600",
                    lineHeight: "1.7",
                  }}
                >
                  Add category and image URL also, so products look more
                  professional on the user side.
                </p>
              </div>

              {image && (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "16px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "600",
                    }}
                  >
                    Image Preview
                  </p>

                  <div
                    style={{
                      width: "100%",
                      height: "180px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={image}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="app-card" style={{ padding: "24px", marginTop: "24px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "18px", color: "#111827" }}>
            Products
          </h3>

          {products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛍️</div>
              <h3 style={{ margin: 0, color: "#111827" }}>No products found</h3>
              <p style={{ color: "#6b7280", marginTop: "10px" }}>
                Add your first product to start building the catalog.
              </p>
            </div>
          ) : (
            <div className="grid-cards">
              {products.map((p) => (
                <div
                  key={p._id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
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
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
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
                      <div style={{ fontSize: "34px" }}>📦</div>
                    )}
                  </div>

                  {p.category && (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        background: "#ede9fe",
                        color: "#5b21b6",
                        fontSize: "12px",
                        fontWeight: "700",
                        marginBottom: "12px",
                      }}
                    >
                      {p.category}
                    </div>
                  )}

                  <h4
                    style={{
                      margin: "0 0 10px",
                      fontSize: "18px",
                      color: "#111827",
                    }}
                  >
                    {p.name}
                  </h4>

                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#4f46e5",
                    }}
                  >
                    ₹{p.price}
                  </p>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: p.stock > 0 ? "#dcfce7" : "#fee2e2",
                      color: p.stock > 0 ? "#166534" : "#991b1b",
                      fontSize: "12px",
                      fontWeight: "700",
                      marginBottom: "16px",
                    }}
                  >
                    {p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"}
                  </div>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "12px",
                      background: "#dc2626",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Delete Product
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;