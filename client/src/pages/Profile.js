import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="app-page profile-page">
      <div className="app-container">
        <div
          className={`app-card topbar-card profile-top-card ${
            user?.role === "admin" ? "admin" : "user"
          }`}
        >
          <div>
            <div
              className={`profile-top-pill ${
                user?.role === "admin" ? "admin" : "user"
              }`}
            >
              {user?.role === "admin" ? "⚙️ Admin Account" : "✨ My Account"}
            </div>

            <h2 className="app-section-title profile-top-title">
              {user?.role === "admin" ? "Admin Profile" : "Welcome Back"}
            </h2>

            <p className="app-section-subtitle profile-top-subtitle">
              {user?.role === "admin"
                ? "Manage your admin account, platform access and operational actions from one place."
                : "Manage your profile, review account details and continue your shopping journey smoothly."}
            </p>
          </div>
        </div>

        {user ? (
          <div className="profile-grid">
            <div className="app-card fade-card profile-main-card">
              <div className="profile-user-head">
                <div
                  className={`profile-avatar ${
                    user.role === "admin" ? "admin" : "user"
                  }`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <div>
                  <h3 className="profile-user-name">{user.name}</h3>
                  <p className="profile-user-subtext">
                    {user.role === "admin"
                      ? "Your admin account details and platform access overview."
                      : "Your account details, saved delivery info and shopping access."}
                  </p>
                </div>
              </div>

              <div className="profile-info-list">
                <div className="profile-info-box">
                  <p className="profile-info-label">Phone Number</p>
                  <p className="profile-info-value">{user.phone}</p>
                </div>

                <div className="profile-info-box">
                  <p className="profile-info-label">
                    {user.role === "admin" ? "Admin Address" : "Delivery Address"}
                  </p>
                  <p className="profile-info-address">{user.address}</p>
                </div>

                <div
                  className={`profile-status-box ${
                    user.role === "admin" ? "admin" : "user"
                  }`}
                >
                  <p
                    className={`profile-status-label ${
                      user.role === "admin" ? "admin" : "user"
                    }`}
                  >
                    Account Status
                  </p>
                  <p
                    className={`profile-status-value ${
                      user.role === "admin" ? "admin" : "user"
                    }`}
                  >
                    {user.role === "admin" ? "Admin User" : "Active User"}
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-side-grid">
              <div className="app-card fade-card profile-side-card">
                <h3 className="profile-side-title">Quick Actions</h3>

                <div className="profile-actions">
                  {user.role === "admin" ? (
                    <>
                      <button
                        className="primary-btn profile-action-btn"
                        onClick={() => navigate("/admin/dashboard")}
                        type="button"
                      >
                        Open Dashboard
                      </button>

                      <button
                        className="secondary-btn profile-action-btn"
                        onClick={() => navigate("/admin/products")}
                        type="button"
                      >
                        Manage Products
                      </button>

                      <button
                        className="profile-ghost-action"
                        onClick={() => navigate("/admin/orders")}
                        type="button"
                      >
                        Manage Orders
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="primary-btn profile-action-btn"
                        onClick={() => navigate("/products")}
                        type="button"
                      >
                        Shop Now
                      </button>

                      <button
                        className="secondary-btn profile-action-btn"
                        onClick={() => navigate("/cart")}
                        type="button"
                      >
                        Open Cart
                      </button>

                      <button
                        className="profile-ghost-action"
                        onClick={() => navigate("/orders")}
                        type="button"
                      >
                        View My Orders
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="app-card fade-card profile-side-card">
                <h3 className="profile-side-title">
                  {user.role === "admin" ? "Admin Notes" : "Shopping Tips"}
                </h3>

                {user.role === "admin" ? (
                  <ul className="profile-notes-list">
                    <li>Keep product stock updated regularly.</li>
                    <li>Monitor pending orders and update statuses quickly.</li>
                    <li>Maintain accurate product names, pricing and images.</li>
                  </ul>
                ) : (
                  <ul className="profile-notes-list">
                    <li>Check product availability before ordering.</li>
                    <li>Keep your delivery address updated.</li>
                    <li>Track your order status from the Orders page.</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="app-card empty-state profile-loading-card">
            <div className="profile-loading-icon">👤</div>
            <h3 className="profile-loading-title">Loading profile...</h3>
            <p className="profile-loading-text">
              Please wait while we fetch your details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;