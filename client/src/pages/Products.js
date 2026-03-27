import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Products.css";

function Products() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [, setCartVersion]        = useState(0);
  const [searchTerm, setSearchTerm]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption]           = useState("default");

  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
  const cart    = getCart();
  const totalCartItems = cart.reduce((s, i) => s + i.quantity, 0);

  const getCartQuantity = (id) => {
    const item = cart.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  const addToCart = (product) => {
    const existing = getCart();
    const idx = existing.findIndex((i) => i._id === product._id);

    if (product.stock <= 0) { toast.error(`${product.name} is out of stock`); return; }

    if (idx !== -1) {
      if (existing[idx].quantity >= product.stock) {
        toast.warning(`Only ${product.stock} available for ${product.name}`); return;
      }
      existing[idx].quantity += 1;
    } else {
      existing.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existing));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartVersion((v) => v + 1);
    toast.success("Added to cart 🛒");
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(res.data);
      } catch { toast.error("Failed to load products"); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const categories = ["All", ...new Set(
    products.map((p) => p.category).filter((c) => c && c.trim())
  )];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "priceLow")  return a.price - b.price;
    if (sortOption === "priceHigh") return b.price - a.price;
    if (sortOption === "name")      return a.name.localeCompare(b.name);
    if (sortOption === "stock")     return b.stock - a.stock;
    return 0;
  });

  if (loading) {
    return (
      <div className="app-page products-page">
        <div className="app-container">
          <div className="products-skeleton-top" />
          <div className="grid-cards products-grid">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="products-skeleton-card">
                <div className="products-skeleton-image" />
                <div className="products-skeleton-body">
                  <div className="products-skeleton-line long" />
                  <div className="products-skeleton-line medium" />
                  <div className="products-skeleton-line short" />
                  <div className="products-skeleton-btn" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page products-page">
      <div className="app-container">

        {/* Top */}
        <div className="products-top-card">
          <div className="products-top-left">
            <div className="products-top-pill">✨ Premium Shopping</div>
            <h2 className="products-top-title">Products</h2>
            <p className="products-top-subtitle">
              Explore fresh groceries, compare availability and add your favourites to cart.
            </p>
          </div>
          <Link to="/cart" className="products-cart-link">
            <button className="primary-btn products-cart-btn" type="button">
              🛒 Cart {totalCartItems > 0 ? `(${totalCartItems})` : ""}
            </button>
          </Link>
        </div>

        {/* Count */}
        {products.length > 0 && (
          <div className="products-count-row">
            <span className="products-count-pill">
              🛍️ {sorted.length} of {products.length} Products
            </span>
          </div>
        )}

        {/* Filters */}
        {products.length > 0 && (
          <div className="products-filter-card">
            <h3 className="products-filter-title">Find Your Product</h3>
            <p className="products-filter-subtitle">Search, filter and sort to find what you need.</p>
            <div className="products-filter-grid">
              <div>
                <label className="label-text">Search</label>
                <input className="input-field products-input" placeholder="Search by product name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div>
                <label className="label-text">Category</label>
                <div className="products-category-list">
                  {categories.map((cat) => (
                    <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`products-category-btn ${selectedCategory === cat ? "active" : ""}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-text">Sort</label>
                <select className="input-field products-input" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="priceLow">Price: Low → High</option>
                  <option value="priceHigh">Price: High → Low</option>
                  <option value="name">Name: A → Z</option>
                  <option value="stock">Stock Available</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {products.length === 0 ? (
          <div className="app-card empty-state products-empty-card">
            <div className="products-empty-icon">🛍️</div>
            <h3 className="products-empty-title">No products yet</h3>
            <p className="products-empty-text">Products will appear here once added by admin.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="app-card empty-state products-empty-card">
            <div className="products-empty-icon">🔎</div>
            <h3 className="products-empty-title">No matching products</h3>
            <p className="products-empty-text">Try another keyword or category.</p>
            <button className="products-clear-filter-btn" type="button" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-cards products-grid">
            {sorted.map((product) => {
              const cartQty     = getCartQuantity(product._id);
              const isOutOfStock = product.stock <= 0;
              return (
                <div key={product._id} className={`products-card ${isOutOfStock ? "products-card-out" : ""}`}>
                  {isOutOfStock && <div className="products-out-overlay">Out of Stock</div>}

                  <div className="products-image-wrap">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="products-image" onError={(e) => { e.target.style.display = "none"; }} />
                      : <div className="products-image-fallback">🛍️</div>
                    }
                  </div>

                  <div className="products-card-body">
                    <div className="products-card-head">
                      <div className="products-card-head-left">
                        {product.category && <div className="products-category-pill">{product.category}</div>}
                        <h4 className="products-name">{product.name}</h4>
                      </div>
                      {cartQty > 0 && <span className="products-cart-qty-pill">🛒 {cartQty}</span>}
                    </div>

                    <p className="products-price">₹{product.price}</p>

                    {!isOutOfStock && product.stock <= 10 && (
                      <p className="products-low-stock-text">⚠️ Only {product.stock} left!</p>
                    )}

                    <div className={`products-stock-pill ${isOutOfStock ? "out" : "in"}`}>
                      {isOutOfStock ? "Out of Stock" : `✅ In Stock: ${product.stock}`}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock}
                      className={`products-add-btn ${isOutOfStock ? "disabled" : ""} ${cartQty > 0 ? "in-cart" : ""}`}
                      type="button"
                    >
                      {isOutOfStock ? "Coming Soon" : cartQty > 0 ? `+ Add More (${cartQty} in cart)` : "Add to Cart 🛒"}
                    </button>
                  </div>
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