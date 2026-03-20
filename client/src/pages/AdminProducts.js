import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminProducts.css";

// ✅ ADDED - fixed category list for Theni grocery store
const CATEGORIES = [
  "Rice & Grains",
  "Dal & Pulses",
  "Oil & Ghee",
  "Spices & Masala",
  "Flour & Rava",
  "Snacks & Biscuits",
  "Beverages & Drinks",
  "Dairy & Eggs",
  "Fruits & Vegetables",
  "Cleaning & Household",
  "Personal Care",
  "Other",
];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedFile) {
        toast.warning("Please choose an image first");
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
      toast.success("Image uploaded successfully ✅");
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed ❌");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditImageUpload = async () => {
    try {
      if (!editSelectedFile) {
        toast.warning("Please choose an image first");
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
      toast.success("Edit image uploaded successfully ✅");
    } catch (err) {
      console.log(err);
      toast.error("Edit image upload failed ❌");
    } finally {
      setUploadingEditImage(false);
    }
  };

  const addProduct = async () => {
    try {
      if (!name || !price || !stock) {
        toast.warning("Please fill product name, price and stock");
        return;
      }

      setAddingProduct(true);

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

      await fetchProducts();
      toast.success("Product added successfully ✅");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add product");
    } finally {
      setAddingProduct(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchProducts();
      toast.success("Product deleted successfully ✅");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete product");
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
        toast.warning("Please fill product name, price and stock");
        return;
      }

      setUpdatingProduct(true);

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
      await fetchProducts();
      toast.success("Product updated successfully ✅");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setUpdatingProduct(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="app-page admin-products-page">
      <div className="app-container">
        <div className="app-card topbar-card fade-card admin-products-top-card">
          <div>
            <div className="admin-products-pill">⚡ Premium Admin Control</div>

            <h2 className="app-section-title admin-products-top-title">
              Admin Product Manager
            </h2>

            <p className="app-section-subtitle admin-products-top-subtitle">
              Add, edit, organize and maintain your product catalog with a
              cleaner and more premium management experience.
            </p>
          </div>

          <div className="admin-products-top-actions">
            <button
              className="primary-btn admin-products-top-btn"
              onClick={() => navigate("/admin/dashboard")}
              type="button"
            >
              Dashboard
            </button>

            <button
              className="secondary-btn admin-products-top-btn"
              onClick={() => navigate("/admin/orders")}
              type="button"
            >
              Orders
            </button>
          </div>
        </div>

        <div className="grid-2 admin-products-grid">
          <div className="app-card fade-card admin-products-form-card">
            <h3 className="admin-products-section-title">Add Product</h3>
            <p className="admin-products-section-subtitle">
              Create new products with pricing, stock, category and product
              images.
            </p>

            <div className="admin-products-field">
              <label className="label-text">Product Name</label>
              <input
                className="input-field admin-products-input"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="admin-products-field">
              <label className="label-text">Price</label>
              <input
                className="input-field admin-products-input"
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="admin-products-field">
              <label className="label-text">Stock</label>
              <input
                className="input-field admin-products-input"
                type="number"
                placeholder="Enter available stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {/* ✅ CHANGED - category dropdown instead of text input */}
            <div className="admin-products-field">
              <label className="label-text">Category</label>
              <select
                className="input-field admin-products-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-products-field">
              <label className="label-text">Choose Product Image</label>
              <input
                type="file"
                accept="image/*"
                className="input-field admin-products-input"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            <div className="admin-products-upload-row">
              <button
                type="button"
                className="secondary-btn admin-products-upload-btn"
                onClick={handleImageUpload}
                disabled={uploadingImage}
              >
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </button>
            </div>

            <div className="admin-products-field admin-products-last-field">
              <label className="label-text">Image URL</label>
              <input
                className="input-field admin-products-input"
                placeholder="Uploaded image URL will appear here"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <button
              className={`primary-btn admin-products-submit-btn ${
                addingProduct ? "loading" : ""
              }`}
              onClick={addProduct}
              disabled={addingProduct}
              type="button"
            >
              {addingProduct ? "Adding Product..." : "Add Product"}
            </button>
          </div>

          <div className="app-card fade-card admin-products-summary-card">
            <h3 className="admin-products-section-title">Product Summary</h3>
            <p className="admin-products-section-subtitle">
              Keep your catalog polished, visual and updated for a better user
              experience.
            </p>

            <div className="admin-products-summary-list">
              <div className="admin-products-summary-box">
                <p className="admin-products-box-label">Total Products</p>
                <p className="admin-products-box-value">{products.length}</p>
              </div>

              <div className="admin-products-note-box">
                <p className="admin-products-note-label">Quick Note</p>
                <p className="admin-products-note-text">
                  Upload quality product images, maintain accurate stock and
                  keep categories clean so the storefront feels more reliable
                  and premium.
                </p>
              </div>

              {image && (
                <div className="admin-products-preview-card">
                  <p className="admin-products-box-label">Image Preview</p>

                  <div className="admin-products-preview-wrap">
                    <img
                      src={image}
                      alt="Preview"
                      className="admin-products-preview-image"
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

        <div className="app-card fade-card admin-products-list-card">
          <div className="admin-products-list-head">
            <div>
              <h3 className="admin-products-section-title">Products</h3>
              <p className="admin-products-list-subtitle">
                Manage your live product catalog from one place.
              </p>
            </div>

            <div className="admin-products-total-pill">
              Total Items: {products.length}
            </div>
          </div>

          {loadingProducts ? (
            <div className="grid-cards admin-products-cards-grid">
              {[1, 2, 3].map((item) => (
                <div key={item} className="app-card admin-products-skeleton-card">
                  <div className="admin-products-skeleton-image" />
                  <div className="admin-products-skeleton-pill" />
                  <div className="admin-products-skeleton-line long" />
                  <div className="admin-products-skeleton-line short" />
                  <div className="admin-products-skeleton-stock" />
                  <div className="admin-products-skeleton-btn" />
                  <div className="admin-products-skeleton-btn" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state admin-products-empty">
              <div className="admin-products-empty-icon">🛍️</div>
              <h3 className="admin-products-empty-title">No products found</h3>
              <p className="admin-products-empty-text">
                Add your first product to start building the catalog.
              </p>
            </div>
          ) : (
            <div className="grid-cards admin-products-cards-grid">
              {products.map((p) => (
                <div key={p._id} className="fade-card admin-products-product-card">
                  <div className="admin-products-product-image-wrap">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="admin-products-product-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="admin-products-product-fallback">📦</div>
                    )}
                  </div>

                  {p.category && (
                    <div className="admin-products-category-pill">
                      {p.category}
                    </div>
                  )}

                  <h4 className="admin-products-product-name">{p.name}</h4>

                  <p className="admin-products-product-price">₹{p.price}</p>

                  <div
                    className={`admin-products-stock-pill ${
                      p.stock > 0 ? "in" : "out"
                    }`}
                  >
                    {p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"}
                  </div>

                  <div className="admin-products-product-actions">
                    <button
                      onClick={() => openEditModal(p)}
                      className="admin-products-edit-btn"
                      type="button"
                    >
                      Edit Product
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="admin-products-delete-btn"
                      type="button"
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
          <div className="admin-products-modal-overlay">
            <div className="app-card admin-products-modal-card">
              <h3 className="admin-products-modal-title">Edit Product</h3>
              <p className="admin-products-modal-subtitle">
                Update stock, price, image and category details instantly.
              </p>

              <div className="admin-products-modal-fields">
                <div>
                  <label className="label-text">Product Name</label>
                  <input
                    className="input-field admin-products-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label-text">Price</label>
                  <input
                    className="input-field admin-products-input"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label-text">Stock</label>
                  <input
                    className="input-field admin-products-input"
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                  />
                </div>

                {/* ✅ CHANGED - category dropdown in edit modal too */}
                <div>
                  <label className="label-text">Category</label>
                  <select
                    className="input-field admin-products-input"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-text">Choose New Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="input-field admin-products-input"
                    onChange={(e) => setEditSelectedFile(e.target.files[0])}
                  />
                </div>

                <div>
                  <button
                    type="button"
                    className="secondary-btn admin-products-upload-btn"
                    onClick={handleEditImageUpload}
                    disabled={uploadingEditImage}
                  >
                    {uploadingEditImage ? "Uploading..." : "Upload New Image"}
                  </button>
                </div>

                <div>
                  <label className="label-text">Image URL</label>
                  <input
                    className="input-field admin-products-input"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                  />
                </div>

                {editImage && (
                  <div className="admin-products-modal-preview-wrap">
                    <img
                      src={editImage}
                      alt="Edit Preview"
                      className="admin-products-modal-preview-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="admin-products-modal-actions">
                  <button
                    className={`primary-btn admin-products-modal-btn ${
                      updatingProduct ? "loading" : ""
                    }`}
                    onClick={updateProduct}
                    disabled={updatingProduct}
                    type="button"
                  >
                    {updatingProduct ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    className="secondary-btn admin-products-modal-btn"
                    onClick={closeEditModal}
                    type="button"
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