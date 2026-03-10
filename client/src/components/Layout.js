import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;