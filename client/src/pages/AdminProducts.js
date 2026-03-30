import { useEffect, useRef, useState } from "react";
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
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const mainPreviewUrlRef = useRef(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [editDragActive, setEditDragActive] = useState(false);
  const [editFilePreview, setEditFilePreview] = useState(null);
  const editFileInputRef = useRef(null);
  const editPreviewUrlRef = useRef(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const navigate = useNavigate();

  const setSelectedFileWithPreview = (file) => {
    setSelectedFile(file);

    if (mainPreviewUrlRef.current) {
      URL.revokeObjectURL(mainPreviewUrlRef.current);
      mainPreviewUrlRef.current = null;
    }

    if (file) {
      mainPreviewUrlRef.current = URL.createObjectURL(file);
      setFilePreview(mainPreviewUrlRef.current);
    } else {
      setFilePreview(null);
    }
  };

  const setEditSelectedFileWithPreview = (file) => {
    setEditSelectedFile(file);

    if (editPreviewUrlRef.current) {
      URL.revokeObjectURL(editPreviewUrlRef.current);
      editPreviewUrlRef.current = null;
    }

    if (file) {
      editPreviewUrlRef.current = URL.createObjectURL(file);
      setEditFilePreview(editPreviewUrlRef.current);
    } else {
      setEditFilePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (mainPreviewUrlRef.current)
        URL.revokeObjectURL(mainPreviewUrlRef.current);
      if (editPreviewUrlRef.current)
        URL.revokeObjectURL(editPreviewUrlRef.current);
    };
  }, []);

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
      setSelectedFileWithPreview(null);

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
    setEditSelectedFileWithPreview(null);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditName("");
    setEditPrice("");
    setEditStock("");
    setEditCategory("");
    setEditImage("");
    setEditSelectedFileWithPreview(null);
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

  const addPreviewSrc = image || filePreview;
  const editPreviewSrc = editImage || editFilePreview;

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

            <div className="admin-products-form-grid">
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
                <label className="label-text">Category</label>
                <select
                  className="input-field admin-products-input admin-products-select"
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

              <div className="admin-products-image-section">
                <div className="admin-products-upload-column">
                  <label className="label-text">Choose Product Image</label>

                  <div
                    className={`admin-products-upload-dropzone ${
                      dragActive ? "active" : ""
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) setSelectedFileWithPreview(file);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="admin-products-file-input"
                      onChange={(e) =>
                        setSelectedFileWithPreview(e.target.files?.[0] || null)
                      }
                    />

                    <div className="admin-products-dropzone-content">
                      <div className="admin-products-dropzone-icon">🖼️</div>
                      <div className="admin-products-dropzone-text">
                        Drag & drop an image here or pick a file
                      </div>
                      <button
                        type="button"
                        className="ghost-btn admin-products-dropzone-choose"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </button>
                    </div>

                    {selectedFile && (
                      <div className="admin-products-selected-file">
                        Selected: <span>{selectedFile.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-products-upload-actions">
                    <button
                      type="button"
                      className="secondary-btn admin-products-upload-btn"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </button>
                    <div className="admin-products-image-help">
                      Upload or paste a URL; the saved image is whatever is
                      in Image URL.
                    </div>
                  </div>
                </div>

                <div className="admin-products-url-column">
                  <label className="label-text">
                    Image URL (paste or auto)
                  </label>
                  <input
                    className="input-field admin-products-input"
                    placeholder="Cloudinary URL or your own image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />

                  <div className="admin-products-image-preview-wrap">
                    {addPreviewSrc ? (
                      <img
                        src={addPreviewSrc}
                        alt="Selected preview"
                        className="admin-products-image-preview-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="admin-products-image-preview-placeholder">
                        No image selected yet
                      </div>
                    )}
                  </div>
                </div>
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

              {addPreviewSrc && (
                <div className="admin-products-preview-card">
                  <p className="admin-products-box-label">Image Preview</p>

                  <div className="admin-products-preview-wrap">
                    <img
                      src={addPreviewSrc}
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
                  <div className="admin-products-product-body">
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
                <div className="admin-products-field">
                  <label className="label-text">Product Name</label>
                  <input
                    className="input-field admin-products-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="admin-products-field">
                  <label className="label-text">Price</label>
                  <input
                    className="input-field admin-products-input"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>

                <div className="admin-products-field">
                  <label className="label-text">Stock</label>
                  <input
                    className="input-field admin-products-input"
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                  />
                </div>

                <div className="admin-products-field">
                  <label className="label-text">Category</label>
                  <select
                    className="input-field admin-products-input admin-products-select"
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

                <div className="admin-products-image-section admin-products-modal-image-section">
                  <div className="admin-products-upload-column">
                    <label className="label-text">Choose New Image</label>

                    <div
                      className={`admin-products-upload-dropzone ${
                        editDragActive ? "active" : ""
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setEditDragActive(true);
                      }}
                      onDragLeave={() => setEditDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setEditDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) setEditSelectedFileWithPreview(file);
                      }}
                    >
                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/*"
                        className="admin-products-file-input"
                        onChange={(e) =>
                          setEditSelectedFileWithPreview(
                            e.target.files?.[0] || null
                          )
                        }
                      />

                      <div className="admin-products-dropzone-content">
                        <div className="admin-products-dropzone-icon">🖼️</div>
                        <div className="admin-products-dropzone-text">
                          Drop a new image here (optional)
                        </div>
                        <button
                          type="button"
                          className="ghost-btn admin-products-dropzone-choose"
                          onClick={() => editFileInputRef.current?.click()}
                        >
                          Choose File
                        </button>
                      </div>

                      {editSelectedFile && (
                        <div className="admin-products-selected-file">
                          Selected: <span>{editSelectedFile.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="admin-products-upload-actions">
                      <button
                        type="button"
                        className="secondary-btn admin-products-upload-btn"
                        onClick={handleEditImageUpload}
                        disabled={uploadingEditImage}
                      >
                        {uploadingEditImage
                          ? "Uploading..."
                          : "Upload New Image"}
                      </button>
                      <div className="admin-products-image-help">
                        If you upload, it will replace the product image.
                      </div>
                    </div>
                  </div>

                  <div className="admin-products-url-column">
                    <label className="label-text">Image URL</label>
                    <input
                      className="input-field admin-products-input"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                    />

                    <div className="admin-products-image-preview-wrap">
                      {editPreviewSrc ? (
                        <img
                          src={editPreviewSrc}
                          alt="Edit preview"
                          className="admin-products-image-preview-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="admin-products-image-preview-placeholder">
                          No image available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

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