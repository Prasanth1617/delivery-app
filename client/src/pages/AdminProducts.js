import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

 const addProduct = async () => {
  if (!name || !price || !stock) {
    alert("Please fill all fields");
    return;
  }

  await axios.post("http://localhost:5000/api/products", {
    name,
    price,
    stock
  });

  setName("");
  setPrice("");
  setStock("");

  fetchProducts();
};
  const deleteProduct = async (id) => {

    await axios.delete(`http://localhost:5000/api/products/${id}`);

    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "40px" }}>

        <div style={{ marginBottom: "20px" }}>
  <Link to="/admin/dashboard">
    <button>Dashboard</button>
  </Link>

  <Link to="/admin/orders">
    <button style={{ marginLeft: "10px" }}>Orders</button>
  </Link>

  <Link to="/admin/products">
    <button style={{ marginLeft: "10px" }}>Products</button>
  </Link>
</div>

      <h2>Admin Product Manager</h2>

      <h3>Add Product</h3>

     <input
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  style={{ marginRight: "10px" }}
/>

<input
  placeholder="Price"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  style={{ marginRight: "10px" }}
/>

<input
  placeholder="Stock"
  value={stock}
  onChange={(e) => setStock(e.target.value)}
  style={{ marginRight: "10px" }}
/>

      <button onClick={addProduct}>Add Product</button>

      <hr />

      <h3>Products</h3>

      {products.map((p) => (

        <div key={p._id} style={{ border: "1px solid gray", padding: 10, margin: 10 }}>

          <b>{p.name}</b>

          <p>₹{p.price}</p>

          <p>Stock: {p.stock}</p>

          <button onClick={() => deleteProduct(p._id)}>
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default AdminProducts;