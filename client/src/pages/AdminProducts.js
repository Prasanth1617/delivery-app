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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedFile) {
        alert("Please choose an image first");
        return;
      }

      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      setImage(res.data.secure_url);
      alert("Image uploaded successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Image upload failed ❌");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditImageUpload = async () => {
    try {
      if (!editSelectedFile) {
        alert("Please choose an image first");
        return;
      }

      setUploadingEditImage(true);

      const formData = new FormData();
      formData.append("file", editSelectedFile);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      setEditImage(res.data.secure_url);
      alert("Edit image uploaded successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Edit image upload failed ❌");
    } finally {
      setUploadingEditImage(false);
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
      setSelectedFile(null);

      fetchProducts();
      alert("Product added successfully ✅");
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
      alert("Product deleted successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditName(product.name || "");
    setEditPrice(product.price || "");
    setEditStock(product.stock || "");
    setEditCategory(product.category || "");
    setEditImage(product.image || "");
    setEditSelectedFile(null);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditName("");
    setEditPrice("");
    setEditStock("");
    setEditCategory("");
    setEditImage("");
    setEditSelectedFile(null);
  };

  const updateProduct = async () => {
    try {
      if (!editName || !editPrice || !editStock) {
        alert("Please fill product name, price and stock");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${editingProduct._id}`,
        {
          name: editName,
          price: Number(editPrice),
          stock: Number(editStock),
          category: editCategory,
          image: editImage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      closeEditModal();
      fetchProducts();
      alert("Product updated successfully ✅");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      className="app-page"
      style={{
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="app-container">
        <div
          className="app-card topbar-card"
          style={{
            padding: "28px",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(238,242,255,0.92))",
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
              }}
            >
              ⚡ Premium Admin Control
            </div>

            <h2
              className="app-section-title"
              style={{
                marginBottom: "8px",
                fontSize: "34px",
                letterSpacing: "-0.4px",
              }}
            >
              Admin Product Manager
            </h2>
            <p
              className="app-section-subtitle"
              style={{
                fontSize: "15px",
                maxWidth: "620px",
                lineHeight: "1.7",
              }}
            >
              Add, edit, organize and maintain your product catalog with a
              cleaner and more premium management experience.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="primary-btn"
              onClick={() => navigate("/admin/dashboard")}
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                boxShadow: "0 14px 28px rgba(79, 70, 229, 0.24)",
              }}
            >
              Dashboard
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/admin/orders")}
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
              }}
            >
              Orders
            </button>
          </div>
        </div>

        <div
          className="grid-2"
          style={{
            gap: "24px",
          }}
        >
          <div
            className="app-card"
            style={{
              padding: "26px",
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
              background: "#ffffff",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "6px",
                color: "#111827",
                fontSize: "24px",
              }}
            >
              Add Product
            </h3>
            <p
              style={{
                marginTop: 0,
                marginBottom: "20px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Create new products with pricing, stock, category and product
              images.
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label className="label-text">Product Name</label>
              <input
                className="input-field"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ borderRadius: "14px", background: "#f9fafb" }}
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
                style={{ borderRadius: "14px", background: "#f9fafb" }}
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
                style={{ borderRadius: "14px", background: "#f9fafb" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="label-text">Category</label>
              <input
                className="input-field"
                placeholder="Example: Grocery, Snacks, Drinks"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ borderRadius: "14px", background: "#f9fafb" }}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label className="label-text">Choose Product Image</label>
              <input
                type="file"
                accept="image/*"
                className="input-field"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ borderRadius: "14px", background: "#f9fafb" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <button
                type="button"
                className="secondary-btn"
                onClick={handleImageUpload}
                disabled={uploadingImage}
                style={{
                  borderRadius: "14px",
                  padding: "12px 16px",
                }}
              >
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </button>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label className="label-text">Image URL</label>
              <input
                className="input-field"
                placeholder="Uploaded image URL will appear here"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{ borderRadius: "14px", background: "#f9fafb" }}
              />
            </div>

            <button
              className="primary-btn"
              onClick={addProduct}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                boxShadow: "0 14px 28px rgba(79, 70, 229, 0.24)",
              }}
            >
              Add Product
            </button>
          </div>

          <div
            className="app-card"
            style={{
              padding: "26px",
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
              background: "#ffffff",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "6px",
                color: "#111827",
                fontSize: "24px",
              }}
            >
              Product Summary
            </h3>
            <p
              style={{
                marginTop: 0,
                marginBottom: "20px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Keep your catalog polished, visual and updated for a better user
              experience.
            </p>

            <div style={{ display: "grid", gap: "14px" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "18px",
                  padding: "18px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "13px",
                    color: "#6b7280",
                    fontWeight: "700",
                  }}
                >
                  Total Products
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    fontWeight: "800",
                    color: "#111827",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {products.length}
                </p>
              </div>

              <div
                style={{
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "18px",
                  padding: "18px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "13px",
                    color: "#4338ca",
                    fontWeight: "700",
                  }}
                >
                  Quick Note
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#312e81",
                    fontWeight: "600",
                    lineHeight: "1.8",
                    fontSize: "14px",
                  }}
                >
                  Upload quality product images, maintain accurate stock and
                  keep categories clean so the storefront feels more reliable
                  and premium.
                </p>
              </div>

              {image && (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "18px",
                    padding: "16px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "700",
                    }}
                  >
                    Image Preview
                  </p>

                  <div
                    style={{
                      width: "100%",
                      height: "220px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #eef2ff",
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

        <div
          className="app-card"
          style={{
            padding: "26px",
            marginTop: "26px",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "18px",
            }}
          >
            <div>
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "6px",
                  color: "#111827",
                  fontSize: "24px",
                }}
              >
                Products
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Manage your live product catalog from one place.
              </p>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                background: "#f8fafc",
                color: "#475569",
                fontWeight: "700",
                fontSize: "13px",
                border: "1px solid #e5e7eb",
              }}
            >
              Total Items: {products.length}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "52px", marginBottom: "12px" }}>🛍️</div>
              <h3 style={{ margin: 0, color: "#111827", fontSize: "24px" }}>
                No products found
              </h3>
              <p style={{ color: "#6b7280", marginTop: "10px", fontSize: "15px" }}>
                Add your first product to start building the catalog.
              </p>
            </div>
          ) : (
            <div
              className="grid-cards"
              style={{
                gap: "24px",
              }}
            >
              {products.map((p) => (
                <div
                  key={p._id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "22px",
                    padding: "18px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "190px",
                      background:
                        "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
                      borderRadius: "18px",
                      marginBottom: "16px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #eef2ff",
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
                      <div style={{ fontSize: "38px" }}>📦</div>
                    )}
                  </div>

                  {p.category && (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        background: "#f3e8ff",
                        color: "#6d28d9",
                        fontSize: "12px",
                        fontWeight: "800",
                        marginBottom: "12px",
                      }}
                    >
                      {p.category}
                    </div>
                  )}

                  <h4
                    style={{
                      margin: "0 0 10px",
                      fontSize: "20px",
                      color: "#111827",
                      lineHeight: "1.35",
                    }}
                  >
                    {p.name}
                  </h4>

                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: "24px",
                      fontWeight: "800",
                      color: "#4f46e5",
                    }}
                  >
                    ₹{p.price}
                  </p>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: p.stock > 0 ? "#dcfce7" : "#fee2e2",
                      color: p.stock > 0 ? "#166534" : "#991b1b",
                      fontSize: "12px",
                      fontWeight: "800",
                      marginBottom: "18px",
                    }}
                  >
                    {p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"}
                  </div>

                  <div style={{ display: "grid", gap: "10px" }}>
                    <button
                      onClick={() => openEditModal(p)}
                      style={{
                        width: "100%",
                        padding: "13px",
                        border: "none",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #111827, #1f2937)",
                        color: "#ffffff",
                        fontWeight: "800",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 12px 22px rgba(17, 24, 39, 0.16)",
                      }}
                    >
                      Edit Product
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      style={{
                        width: "100%",
                        padding: "13px",
                        border: "none",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                        color: "#ffffff",
                        fontWeight: "800",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 12px 22px rgba(220, 38, 38, 0.18)",
                      }}
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingProduct && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 2000,
            }}
          >
            <div
              className="app-card"
              style={{
                width: "100%",
                maxWidth: "620px",
                padding: "26px",
                borderRadius: "24px",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1px solid #e5e7eb",
                boxShadow: "0 24px 50px rgba(15, 23, 42, 0.18)",
                background: "#ffffff",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "6px",
                  color: "#111827",
                  fontSize: "26px",
                }}
              >
                Edit Product
              </h3>
              <p
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Update stock, price, image and category details instantly.
              </p>

              <div style={{ display: "grid", gap: "14px" }}>
                <div>
                  <label className="label-text">Product Name</label>
                  <input
                    className="input-field"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ borderRadius: "14px", background: "#f9fafb" }}
                  />
                </div>

                <div>
                  <label className="label-text">Price</label>
                  <input
                    className="input-field"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    style={{ borderRadius: "14px", background: "#f9fafb" }}
                  />
                </div>

                <div>
                  <label className="label-text">Stock</label>
                  <input
                    className="input-field"
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    style={{ borderRadius: "14px", background: "#f9fafb" }}
                  />
                </div>

                <div>
                  <label className="label-text">Category</label>
                  <input
                    className="input-field"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    style={{ borderRadius: "14px", background: "#f9fafb" }}
                  />
                </div>

                <div>
                  <label className="label-text">Choose New Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="input-field"
                    onChange={(e) => setEditSelectedFile(e.target.files[0])}
                    style={{ borderRadius: "14px", background: "#f9fafb" }}
                  />
                </div>

                <div>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleEditImageUpload}
                    disabled={uploadingEditImage}
                    style={{
                      borderRadius: "14px",
                      padding: "12px 16px",
                    }}
                  >
                    {uploadingEditImage ? "Uploading..." : "Upload New Image"}
                  </button>
                </div>

                <div>
                  <label className="label-text">Image URL</label>
                  <input
                    className="input-field"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    style={{ borderRadius: "14px", background: "#f9fafb" }}
                  />
                </div>

                {editImage && (
                  <div
                    style={{
                      width: "100%",
                      height: "230px",
                      borderRadius: "18px",
                      overflow: "hidden",
                      background: "#f3f4f6",
                      border: "1px solid #eef2ff",
                    }}
                  >
                    <img
                      src={editImage}
                      alt="Edit Preview"
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
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    className="primary-btn"
                    onClick={updateProduct}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "14px",
                      boxShadow: "0 14px 28px rgba(79, 70, 229, 0.24)",
                    }}
                  >
                    Save Changes
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={closeEditModal}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "14px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;