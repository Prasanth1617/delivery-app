import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ ADDED
  const [, setCartVersion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");

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
      toast.error(`${product.name} is out of stock`);
      return;
    }

    if (index !== -1) {
      if (existingCart[index].quantity >= product.stock) {
        toast.warning(`Only ${product.stock} item(s) available for ${product.name}`);
        return;
      }
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartVersion((prev) => prev + 1);
    toast.success("Added to cart 🛒");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // ✅ ADDED
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false); // ✅ ADDED
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(
      products
        .map((p) => p.category)
        .filter((c) => c && c.trim() !== "")
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceLow")  return a.price - b.price;
    if (sortOption === "priceHigh") return b.price - a.price;
    if (sortOption === "name")      return a.name.localeCompare(b.name);
    if (sortOption === "stock")     return b.stock - a.stock;
    return 0;
  });

  // ✅ ADDED - Skeleton loader
  if (loading) {
    return (
      <div className="app-page products-page">
        <div className="app-container">

          {/* Top card skeleton */}
          <div className="products-skeleton-top">
            <div className="products-skeleton-line long" />
            <div className="products-skeleton-line short" />
            <div className="products-skeleton-line medium" />
          </div>

          {/* Product cards skeleton */}
          <div className="grid-cards products-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="products-skeleton-card">
                <div className="products-skeleton-image" />
                <div className="products-skeleton-pill" />
                <div className="products-skeleton-line long" />
                <div className="products-skeleton-line short" />
                <div className="products-skeleton-btn" />
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

        {/* Top card */}
        <div className="app-card topbar-card products-top-card">
          <div className="products-top-left">
            <div className="products-top-pill">✨ Premium Shopping Experience</div>
            <h2 className="app-section-title products-top-title">Products</h2>
            <p className="app-section-subtitle products-top-subtitle">
              Explore curated products, compare availability, and add your
              favorites to cart with a smoother shopping experience.
            </p>
          </div>

          <Link to="/cart" className="products-cart-link">
            <button className="primary-btn products-cart-btn" type="button">
              🛒 Cart {totalCartItems > 0 ? `(${totalCartItems})` : ""}
            </button>
          </Link>
        </div>

        {/* ✅ Products count pill */}
        {products.length > 0 && (
          <div className="products-count-row">
            <span className="products-count-pill">
              🛍️ {sortedProducts.length} of {products.length} Products
            </span>
          </div>
        )}

        {/* Filter card */}
        {products.length > 0 && (
          <div className="app-card products-filter-card">
            <div className="products-filter-head">
              <h3 className="products-filter-title">Find Your Product</h3>
              <p className="products-filter-subtitle">
                Search, filter and sort products to quickly find what you need.
              </p>
            </div>

            <div className="products-filter-grid">
              <div>
                <label className="label-text">Search Products</label>
                <input
                  className="input-field products-input"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="label-text">Filter by Category</label>
                <div className="products-category-list">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`products-category-btn ${selectedCategory === category ? "active" : ""}`}
                      type="button"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-text">Sort Products</label>
                <select
                  className="input-field products-input"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
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

        {/* Empty states */}
        {products.length === 0 ? (
          <div className="app-card empty-state products-empty-card">
            <div className="products-empty-icon">🛍️</div>
            <h3 className="products-empty-title">No products found</h3>
            <p className="products-empty-text">
              Products will appear here once they are added by admin.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="app-card empty-state products-empty-card">
            <div className="products-empty-icon">🔎</div>
            <h3 className="products-empty-title">No matching products</h3>
            <p className="products-empty-text">
              Try another search keyword, category, or sorting option.
            </p>
            <button
              className="products-clear-filter-btn"
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              type="button"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-cards products-grid">
            {sortedProducts.map((product) => {
              const cartQty = getCartQuantity(product._id);
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product._id}
                  className={`app-card products-card ${isOutOfStock ? "products-card-out" : ""}`}
                >
                  {/* ✅ Out of stock overlay */}
                  {isOutOfStock && (
                    <div className="products-out-overlay">
                      <span>Coming Soon</span>
                    </div>
                  )}

                  <div className="products-image-wrap">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="products-image"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="products-image-fallback">🛍️</div>
                    )}
                  </div>

                  <div className="products-card-head">
                    <div className="products-card-head-left">
                      {product.category && (
                        <div className="products-category-pill">{product.category}</div>
                      )}
                      <h4 className="products-name">{product.name}</h4>
                    </div>

                    {cartQty > 0 && (
                      <span className="products-cart-qty-pill">🛒 {cartQty}</span>
                    )}
                  </div>

                  <p className="products-price">₹{product.price}</p>

                  {/* ✅ Stock bar */}
                  {!isOutOfStock && product.stock <= 10 && (
                    <p className="products-low-stock-text">
                      ⚠️ Only {product.stock} left!
                    </p>
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
                    {isOutOfStock
                      ? "Coming Soon"
                      : cartQty > 0
                      ? `+ Add One More (${cartQty} in cart)`
                      : "Add to Cart 🛒"}
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