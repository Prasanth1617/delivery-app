import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminCoupons.css";

const DISCOUNT_TYPES = [
  { value: "flat", label: "Flat ₹ Off" },
  { value: "percentage", label: "Percentage %" },
  { value: "free_delivery", label: "Free Delivery" },
];

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "flat",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderValue: "",
    totalUsageLimit: "",
    perUserLimit: 1,
    expiresAt: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/coupons`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCoupons(res.data.coupons || []);
    } catch (err) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setForm({
      code: "",
      description: "",
      discountType: "flat",
      discountValue: "",
      maxDiscountAmount: "",
      minOrderValue: "",
      totalUsageLimit: "",
      perUserLimit: 1,
      expiresAt: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountType || !form.discountValue) {
      toast.warning("Code, type and value are required");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
      totalUsageLimit: form.totalUsageLimit ? Number(form.totalUsageLimit) : null,
      perUserLimit: Number(form.perUserLimit) || 1,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (editingId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/coupons/${editingId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Coupon updated");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/coupons`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Coupon created");
      }
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue ?? ""),
      maxDiscountAmount: coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : "",
      minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : "",
      totalUsageLimit: coupon.totalUsageLimit ? String(coupon.totalUsageLimit) : "",
      perUserLimit: coupon.perUserLimit || 1,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 10) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/coupons/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="app-page admin-coupons-page">
      <div className="app-container">
        <div className="app-card admin-coupons-top-card">
          <div>
            <div className="admin-dashboard-pill">🎟️ Coupon Manager</div>
            <h2 className="admin-dashboard-title">Manage Coupons</h2>
            <p className="admin-dashboard-subtitle">
              Create and manage discount coupons for customers
            </p>
          </div>
          <div className="admin-dashboard-top-actions">
            <button
              className="secondary-btn admin-dashboard-top-btn"
              onClick={() => navigate("/admin/dashboard")}
              type="button"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid-2 admin-coupons-layout">
          <div className="app-card admin-coupons-form-card">
            <h3 className="admin-dashboard-panel-title">
              {editingId ? "Edit Coupon" : "Create Coupon"}
            </h3>
            <form onSubmit={handleSubmit} className="admin-coupons-form">
              <label className="label-text">Coupon Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. WELCOME50"
                className="input-field"
              />

              <label className="label-text">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. 50% off on first order"
                className="input-field"
              />

              <label className="label-text">Discount Type *</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="input-field"
              >
                {DISCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              <label className="label-text">
                {form.discountType === "percentage" ? "Percentage (%) *" : "Discount Value (₹) *"}
              </label>
              <input
                type="number"
                min="0"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 100"}
                className="input-field"
              />

              {form.discountType === "percentage" && (
                <>
                  <label className="label-text">Max Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    placeholder="e.g. 150"
                    className="input-field"
                  />
                </>
              )}

              <label className="label-text">Min Order Value (₹)</label>
              <input
                type="number"
                min="0"
                value={form.minOrderValue}
                onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                placeholder="e.g. 299"
                className="input-field"
              />

              <div className="admin-coupons-row">
                <div>
                  <label className="label-text">Total Usage Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={form.totalUsageLimit}
                    onChange={(e) => setForm({ ...form, totalUsageLimit: e.target.value })}
                    placeholder="e.g. 100"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Per User Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={form.perUserLimit}
                    onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <label className="label-text">Expires At</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="input-field"
              />

              <div className="admin-coupons-form-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="primary-btn"
                >
                  {saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="secondary-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="app-card admin-coupons-list-card">
            <h3 className="admin-dashboard-panel-title">All Coupons ({coupons.length})</h3>
            {loading ? (
              <p className="admin-coupons-empty">Loading...</p>
            ) : coupons.length === 0 ? (
              <p className="admin-coupons-empty">No coupons yet</p>
            ) : (
              <div className="admin-coupons-list">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  return (
                    <div
                      key={coupon._id}
                      className={`admin-coupon-item ${!coupon.isActive ? "inactive" : ""} ${isExpired ? "expired" : ""}`}
                    >
                      <div className="admin-coupon-main">
                        <div className="admin-coupon-header">
                          <span className="admin-coupon-code">{coupon.code}</span>
                          <span className={`admin-coupon-badge ${coupon.discountType}`}>
                            {coupon.discountType === "flat" ? `₹${coupon.discountValue}` : coupon.discountType === "percentage" ? `${coupon.discountValue}%` : "FREE DELIVERY"}
                          </span>
                        </div>
                        {coupon.description && (
                          <p className="admin-coupon-desc">{coupon.description}</p>
                        )}
                        <div className="admin-coupon-meta">
                          <span>Min: ₹{coupon.minOrderValue || 0}</span>
                          <span>Used: {coupon.usedCount}{coupon.totalUsageLimit ? `/${coupon.totalUsageLimit}` : ""}</span>
                          <span>Per user: {coupon.perUserLimit || 1}</span>
                        </div>
                        {coupon.expiresAt && (
                          <p className={`admin-coupon-expiry ${isExpired ? "text-red" : ""}`}>
                            {isExpired ? "Expired" : "Expires"}: {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}
                          </p>
                        )}
                        {!coupon.isActive && (
                          <p className="admin-coupon-expiry text-red">Inactive</p>
                        )}
                      </div>
                      <div className="admin-coupon-actions">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="admin-coupon-edit-btn"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="admin-coupon-delete-btn"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;
