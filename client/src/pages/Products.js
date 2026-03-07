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
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      
     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2>Products</h2>

  <Link to="/cart">
    <button>Go to Cart 🛒</button>
  </Link>
</div>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{product.name}</h4>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.stock}</p>

            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Products;