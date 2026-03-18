import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Orders error:", err);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          background: "#dcfce7",
          color: "#166534",
        };
      case "Cancelled":
        return {
          background: "#fee2e2",
          color: "#991b1b",
        };
      case "Out for Delivery":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };
      case "Packed":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };
      default:
        return {
          background: "#ede9fe",
          color: "#5b21b6",
        };
    }
  };

  const orderSteps = ["Pending", "Packed", "Out for Delivery", "Delivered"];

  const getStepIndex = (status) => {
    return orderSteps.indexOf(status);
  };

  const renderOrderTimeline = (status) => {
    if (status === "Cancelled") {
      return (
        <div
          style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "18px",
            padding: isMobile ? "14px" : "16px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: "800",
              color: "#be123c",
              fontSize: "15px",
            }}
          >
            ❌ This order was cancelled
          </p>

          <p
            style={{
              margin: "8px 0 0",
              color: "#9f1239",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            This order is no longer being processed. You can place a new order
            anytime from the products page.
          </p>
        </div>
      );
    }

    const activeIndex = getStepIndex(status);

    return (
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: isMobile ? "14px" : "18px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "14px",
            fontWeight: "800",
            color: "#374151",
          }}
        >
          Delivery Progress
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          {orderSteps.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div
                key={step}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "10px",
                  padding: isMobile ? "8px" : "0",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "800",
                    color: isCompleted ? "#ffffff" : "#6b7280",
                    background: isCompleted
                      ? isCurrent
                        ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                        : "#111827"
                      : "#e5e7eb",
                    boxShadow: isCurrent
                      ? "0 12px 22px rgba(79, 70, 229, 0.20)"
                      : "none",
                  }}
                >
                  {index + 1}
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      fontWeight: "800",
                      color: isCompleted ? "#111827" : "#6b7280",
                      lineHeight: "1.5",
                    }}
                  >
                    {step}
                  </p>

                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12px",
                      color: isCurrent ? "#4f46e5" : "#9ca3af",
                      fontWeight: "700",
                    }}
                  >
                    {isCurrent
                      ? "Current"
                      : isCompleted
                      ? "Done"
                      : "Waiting"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="app-page"
      style={{
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
        minHeight: "100vh",
        padding: isMobile ? "16px 12px" : "32px 20px",
      }}
    >
      <div className="app-container">
        <div
          className="app-card topbar-card"
          style={{
            padding: isMobile ? "18px" : "28px",
            borderRadius: "24px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(238,242,255,0.92))",
          }}
        >
          <div style={{ minWidth: 0 }}>
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
                flexWrap: "wrap",
              }}
            >
              📦 Order Tracking Center
            </div>

            <h2
              className="app-section-title"
              style={{
                marginBottom: "8px",
                fontSize: isMobile ? "26px" : "34px",
                letterSpacing: "-0.4px",
                lineHeight: "1.2",
              }}
            >
              My Orders
            </h2>

            <p
              className="app-section-subtitle"
              style={{
                fontSize: isMobile ? "14px" : "15px",
                maxWidth: "560px",
                lineHeight: "1.7",
              }}
            >
              Track your placed orders, monitor delivery progress and review
              item details in one clean view.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <button
              className="primary-btn"
              onClick={() => navigate("/products")}
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                boxShadow: "0 14px 28px rgba(79, 70, 229, 0.24)",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Shop More
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/profile")}
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Back to Profile
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div
            className="app-card empty-state"
            style={{
              borderRadius: "24px",
              padding: isMobile ? "40px 18px" : "56px 24px",
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "14px" }}>📦</div>

            <h3
              style={{
                margin: 0,
                color: "#111827",
                fontSize: isMobile ? "22px" : "24px",
              }}
            >
              No orders yet
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
              Your placed orders will appear here once you complete checkout.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: isMobile ? "18px" : "24px",
            }}
          >
            {orders.map((order) => (
              <div
                key={order._id}
                className="app-card"
                style={{
                  padding: isMobile ? "18px" : "26px",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "flex-start",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "7px 11px",
                        borderRadius: "999px",
                        background: "#f8fafc",
                        color: "#475569",
                        fontSize: "12px",
                        fontWeight: "700",
                        border: "1px solid #e5e7eb",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      🧾 Order Summary
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: isMobile ? "20px" : "22px",
                        color: "#111827",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      Order Details
                    </h3>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "#6b7280",
                        fontSize: "14px",
                        wordBreak: "break-all",
                        lineHeight: "1.6",
                      }}
                    >
                      Order ID: {order._id}
                    </p>
                  </div>

                  <span
                    style={{
                      ...getStatusStyle(order.status),
                      padding: "9px 15px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: "800",
                      boxShadow: "0 8px 16px rgba(15, 23, 42, 0.05)",
                      alignSelf: isMobile ? "flex-start" : "auto",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {renderOrderTimeline(order.status)}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "13px",
                        color: "#6b7280",
                        fontWeight: "700",
                      }}
                    >
                      Total Amount
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: isMobile ? "22px" : "24px",
                        fontWeight: "800",
                        color: "#4f46e5",
                        letterSpacing: "-0.2px",
                        wordBreak: "break-word",
                      }}
                    >
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "18px",
                      padding: "16px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "13px",
                        color: "#6b7280",
                        fontWeight: "700",
                      }}
                    >
                      Items Count
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: isMobile ? "22px" : "24px",
                        fontWeight: "800",
                        color: "#111827",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {order.items.length}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "18px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "13px",
                      color: "#6b7280",
                      fontWeight: "700",
                    }}
                  >
                    Delivery Address
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#111827",
                      fontWeight: "600",
                      lineHeight: "1.7",
                      wordBreak: "break-word",
                    }}
                  >
                    {order.deliveryAddress || order.address || "Address not available"}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 14px",
                      fontSize: "15px",
                      fontWeight: "800",
                      color: "#374151",
                    }}
                  >
                    Ordered Items
                  </p>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          justifyContent: "space-between",
                          alignItems: isMobile ? "flex-start" : "center",
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "16px",
                          padding: "14px 16px",
                          gap: "10px",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: "800",
                              color: "#111827",
                              fontSize: "15px",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.name}
                          </p>

                          <p
                            style={{
                              margin: "6px 0 0",
                              fontSize: "13px",
                              color: "#6b7280",
                              fontWeight: "500",
                            }}
                          >
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p
                          style={{
                            margin: 0,
                            fontWeight: "800",
                            color: "#4f46e5",
                            fontSize: "16px",
                            whiteSpace: isMobile ? "normal" : "nowrap",
                            wordBreak: "break-word",
                          }}
                        >
                          ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;