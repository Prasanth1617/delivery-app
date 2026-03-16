import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
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

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter((category) => category && category.trim() !== "")
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceLow") return a.price - b.price;
    if (sortOption === "priceHigh") return b.price - a.price;
    if (sortOption === "name") return a.name.localeCompare(b.name);
    if (sortOption === "stock") return b.stock - a.stock;
    return 0;
  });

  return (
    <div
      className="app-page"
      style={{
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)",
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
              ✨ Premium Shopping Experience
            </div>

            <h2
              className="app-section-title"
              style={{
                marginBottom: "8px",
                fontSize: "34px",
                letterSpacing: "-0.4px",
              }}
            >
              Products
            </h2>
            <p
              className="app-section-subtitle"
              style={{
                fontSize: "15px",
                maxWidth: "540px",
                lineHeight: "1.7",
              }}
            >
              Explore curated products, compare availability, and add your
              favorites to cart with a smoother shopping experience.
            </p>
          </div>

          <Link to="/cart" style={{ textDecoration: "none" }}>
            <button
              className="primary-btn"
              style={{
                padding: "14px 20px",
                borderRadius: "14px",
                boxShadow: "0 14px 28px rgba(79, 70, 229, 0.24)",
              }}
            >
              Go to Cart 🛒 {totalCartItems > 0 ? `(${totalCartItems})` : ""}
            </button>
          </Link>
        </div>

        {products.length > 0 && (
          <div
            className="app-card"
            style={{
              padding: "24px",
              marginBottom: "28px",
              borderRadius: "22px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
              background: "#ffffff",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <h3
                style={{
                  margin: "0 0 6px",
                  color: "#111827",
                  fontSize: "22px",
                }}
              >
                Find Your Product
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Search, filter and sort products to quickly find what you need.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <div>
                <label className="label-text">Search Products</label>
                <input
                  className="input-field"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderRadius: "14px",
                    background: "#f9fafb",
                  }}
                />
              </div>

              <div>
                <label className="label-text">Filter by Category</label>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: "10px 15px",
                        borderRadius: "999px",
                        border:
                          selectedCategory === category
                            ? "none"
                            : "1px solid #dbeafe",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "13px",
                        background:
                          selectedCategory === category
                            ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                            : "#f8fafc",
                        color:
                          selectedCategory === category ? "#ffffff" : "#4338ca",
                        boxShadow:
                          selectedCategory === category
                            ? "0 10px 20px rgba(79, 70, 229, 0.20)"
                            : "none",
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-text">Sort Products</label>
                <select
                  className="input-field"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{
                    borderRadius: "14px",
                    background: "#f9fafb",
                  }}
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

        {products.length === 0 ? (
          <div
            className="app-card empty-state"
            style={{
              borderRadius: "24px",
              padding: "56px 24px",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "14px" }}>🛍️</div>
            <h3
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "24px",
              }}
            >
              No products found
            </h3>
            <p
              style={{
                color: "#6b7280",
                marginTop: "12px",
                fontSize: "15px",
                maxWidth: "460px",
                marginInline: "auto",
              }}
            >
              Products will appear here once they are added by admin.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            className="app-card empty-state"
            style={{
              borderRadius: "24px",
              padding: "56px 24px",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "14px" }}>🔎</div>
            <h3
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "24px",
              }}
            >
              No matching products found
            </h3>
            <p
              style={{
                color: "#6b7280",
                marginTop: "12px",
                fontSize: "15px",
                maxWidth: "460px",
                marginInline: "auto",
              }}
            >
              Try another search keyword, category, or sorting option.
            </p>
          </div>
        ) : (
          <div
            className="grid-cards"
            style={{
              gap: "24px",
            }}
          >
            {sortedProducts.map((product) => {
              const cartQty = getCartQuantity(product._id);
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product._id}
                  className="app-card"
                  style={{
                    padding: "18px",
                    borderRadius: "24px",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    boxShadow: "0 16px 34px rgba(15, 23, 42, 0.08)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "190px",
                      background:
                        "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
                      borderRadius: "18px",
                      marginBottom: "18px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #eef2ff",
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
                      <div style={{ fontSize: "40px" }}>🛍️</div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      {product.category && (
                        <div
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: "#f3e8ff",
                            color: "#6d28d9",
                            fontSize: "12px",
                            fontWeight: "700",
                            marginBottom: "12px",
                          }}
                        >
                          {product.category}
                        </div>
                      )}

                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          color: "#111827",
                          lineHeight: "1.35",
                          letterSpacing: "-0.2px",
                        }}
                      >
                        {product.name}
                      </h4>
                    </div>

                    {cartQty > 0 && (
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          padding: "7px 10px",
                          borderRadius: "999px",
                          background: "#ede9fe",
                          color: "#5b21b6",
                          fontSize: "12px",
                          fontWeight: "800",
                          boxShadow: "0 6px 12px rgba(91, 33, 182, 0.10)",
                        }}
                      >
                        In Cart: {cartQty}
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: "26px",
                      fontWeight: "800",
                      color: "#4f46e5",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    ₹{product.price}
                  </p>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: isOutOfStock ? "#fee2e2" : "#dcfce7",
                      color: isOutOfStock ? "#991b1b" : "#166534",
                      fontSize: "12px",
                      fontWeight: "800",
                      marginBottom: "18px",
                    }}
                  >
                    {isOutOfStock ? "Coming Soon" : `In Stock: ${product.stock}`}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock}
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "none",
                      borderRadius: "14px",
                      background: isOutOfStock
                        ? "#9ca3af"
                        : "linear-gradient(135deg, #111827, #1f2937)",
                      color: "#ffffff",
                      fontWeight: "800",
                      fontSize: "14px",
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                      boxShadow: isOutOfStock
                        ? "none"
                        : "0 12px 22px rgba(17, 24, 39, 0.16)",
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