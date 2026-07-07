import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function CouponSection({ cartTotal, deliveryFee, onCouponApplied, appliedCoupon, onRemoveCoupon }) {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.warning("Enter a coupon code");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/coupons/validate`,
        { code: code.trim(), cartTotal, deliveryFee },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCouponApplied(res.data.coupon);
      toast.success(`Coupon applied! You saved ₹${res.data.coupon.discountAmount.toFixed(2)}`);
      setExpanded(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onRemoveCoupon();
    setCode("");
    toast.info("Coupon removed");
  };

  if (appliedCoupon) {
    return (
      <div style={{
        background: "#f3ecff",
        border: "1.5px solid #c9a84c",
        borderRadius: "12px",
        padding: "14px 16px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "#1e0a3c", fontSize: "14px" }}>
            🎉 {appliedCoupon.code} applied
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#5e2080" }}>
            {appliedCoupon.freeDelivery
              ? "Free delivery applied"
              : `You saved ₹${appliedCoupon.discountAmount.toFixed(2)}`}
          </p>
        </div>
        <button
          onClick={handleRemove}
          style={{
            background: "none",
            border: "none",
            color: "#c9a84c",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div style={{
      border: "1px solid #5e208033",
      borderRadius: "12px",
      marginBottom: "16px",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          background: "#f3ecff",
          border: "none",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          touchAction: "manipulation",
        }}
      >
        <span style={{ fontWeight: 600, color: "#1e0a3c", fontSize: "14px" }}>
          🎟️ Apply Coupon
        </span>
        <span style={{ color: "#5e2080", fontSize: "13px" }}>
          {expanded ? "Close ▲" : "View offers ▼"}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "14px 16px", background: "#ffffff" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              style={{
                flex: 1,
                padding: "12px 14px",
                fontSize: "16px",
                border: "1.5px solid #5e2080",
                borderRadius: "10px",
                background: "#f3ecff",
                color: "#1e0a3c",
                touchAction: "manipulation",
                minHeight: "44px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            <button
              onClick={handleApply}
              disabled={loading}
              style={{
                padding: "0 20px",
                background: "#c9a84c",
                color: "#1e0a3c",
                border: "none",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                minWidth: "84px",
                touchAction: "manipulation",
              }}
            >
              {loading ? "..." : "Apply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponSection;
