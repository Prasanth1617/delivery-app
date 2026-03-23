import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const FEATURES = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Order placed in under 60 seconds. No friction, no waiting.",
  },
  {
    icon: "📍",
    title: "Theni Exclusive",
    desc: "Built only for Theni. Every product sourced locally.",
  },
  {
    icon: "💵",
    title: "Cash on Delivery",
    desc: "Pay when it arrives. No advance, no hassle, no risk.",
  },
  {
    icon: "📦",
    title: "Live Tracking",
    desc: "Watch every stage — packed, dispatched, delivered.",
  },
  {
    icon: "🥬",
    title: "Always Fresh",
    desc: "Daily restocked directly from Ganapathy Silks store.",
  },
  {
    icon: "🔒",
    title: "Fully Secure",
    desc: "Your data, your orders, your privacy — protected always.",
  },
];

const STEPS = [
  { num: "01", title: "Create Account", desc: "Sign up in 30 seconds with your phone number." },
  { num: "02", title: "Browse Products", desc: "Explore fresh groceries organized by category." },
  { num: "03", title: "Add to Cart", desc: "Pick your items, set quantities, review your order." },
  { num: "04", title: "Get Delivered", desc: "We deliver to your door. Pay cash on arrival." },
];

function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      navigate(role === "admin" ? "/admin/dashboard" : "/products", { replace: true });
    }
  }, [navigate]);

  // Parallax orb effect on mouse move
  useEffect(() => {
    const handleMouse = (e) => {
      const orbs = document.querySelectorAll(".landing-orb");
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orbs.forEach((orb, i) => {
        const factor = i % 2 === 0 ? 1 : -1;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="landing">

      {/* ── Background orbs ── */}
      <div className="landing-orb landing-orb-1" />
      <div className="landing-orb landing-orb-2" />
      <div className="landing-orb landing-orb-3" />

      {/* ════════════════════
          NAVBAR
      ════════════════════ */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-header-brand">
            <div className="landing-header-logo">🛒</div>
            <div>
              <div className="landing-header-name">Theni Retail</div>
              <div className="landing-header-sub">Theni's First Smart Grocery App</div>
            </div>
          </div>

          <nav className="landing-header-nav">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#how" className="landing-nav-link">How it works</a>
            <button
              className="landing-nav-login"
              onClick={() => navigate("/login")}
              type="button"
            >
              Login
            </button>
            <button
              className="landing-nav-signup"
              onClick={() => navigate("/signup")}
              type="button"
            >
              Get Started →
            </button>
          </nav>

          {/* Mobile CTA */}
          <button
            className="landing-header-mobile-cta"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ════════════════════
          HERO
      ════════════════════ */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero-inner">

          {/* Badge */}
          <div className="landing-hero-badge">
            <span className="landing-badge-dot" />
            Now live in Theni — Order groceries today
          </div>

          {/* Headline */}
          <h1 className="landing-hero-title">
            Grocery delivery
            <br />
            <span className="landing-hero-title-accent">reimagined</span>
            <br />
            for Theni.
          </h1>

          <p className="landing-hero-desc">
            Fresh groceries from Ganapathy Silks — delivered to your door.
            No minimum order. Cash on delivery. Track every step.
          </p>

          {/* CTA buttons */}
          <div className="landing-hero-cta">
            <button
              className="landing-cta-primary"
              onClick={() => navigate("/signup")}
              type="button"
            >
              <span>Start Shopping Free</span>
              <span className="landing-cta-arrow">→</span>
            </button>

            <button
              className="landing-cta-secondary"
              onClick={() => navigate("/login")}
              type="button"
            >
              Already a member? Login
            </button>
          </div>

          {/* Trust bar */}
          <div className="landing-trust-bar">
            <div className="landing-trust-item">
              <span className="landing-trust-icon">✅</span>
              <span>Free to use</span>
            </div>
            <div className="landing-trust-divider" />
            <div className="landing-trust-item">
              <span className="landing-trust-icon">💵</span>
              <span>Cash on delivery</span>
            </div>
            <div className="landing-trust-divider" />
            <div className="landing-trust-item">
              <span className="landing-trust-icon">📍</span>
              <span>Theni only</span>
            </div>
            <div className="landing-trust-divider" />
            <div className="landing-trust-item">
              <span className="landing-trust-icon">🔒</span>
              <span>100% secure</span>
            </div>
          </div>
        </div>

        {/* Hero visual card */}
        <div className="landing-hero-visual">
          <div className="landing-phone-card">
            <div className="landing-phone-header">
              <div className="landing-phone-logo">🛒</div>
              <div>
                <div className="landing-phone-title">Theni Retail</div>
                <div className="landing-phone-sub">12 items in cart</div>
              </div>
              <div className="landing-phone-badge">LIVE</div>
            </div>

            <div className="landing-phone-items">
              {[
                { name: "Ponni Rice 5kg",    price: "₹320", tag: "Rice & Grains" },
                { name: "Toor Dal 1kg",      price: "₹145", tag: "Dal & Pulses" },
                { name: "Sunflower Oil 1L",  price: "₹180", tag: "Oil & Ghee" },
                { name: "MDH Masala 100g",   price: "₹65",  tag: "Spices" },
              ].map((item, i) => (
                <div key={i} className="landing-phone-item" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="landing-phone-item-left">
                    <div className="landing-phone-item-name">{item.name}</div>
                    <div className="landing-phone-item-tag">{item.tag}</div>
                  </div>
                  <div className="landing-phone-item-price">{item.price}</div>
                </div>
              ))}
            </div>

            <div className="landing-phone-footer">
              <div className="landing-phone-total">
                <span>Total</span>
                <span className="landing-phone-total-val">₹710</span>
              </div>
              <div className="landing-phone-order-btn">Place Order — COD</div>
            </div>

            {/* Floating status pill */}
            <div className="landing-phone-status">
              <span className="landing-status-pulse" />
              Order #1042 — Out for Delivery 🚚
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════
          FEATURES
      ════════════════════ */}
      <section className="landing-features" id="features">
        <div className="landing-section-inner">
          <div className="landing-section-label">Why Theni Retail</div>
          <h2 className="landing-section-title">
            Everything you need.<br />Nothing you don't.
          </h2>
          <p className="landing-section-sub">
            Built from scratch for Theni shoppers — not a copy of Zepto or Blinkit. 
            Designed for how Theni actually shops.
          </p>

          <div className="landing-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="landing-feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="landing-feature-icon">{f.icon}</div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════
          HOW IT WORKS
      ════════════════════ */}
      <section className="landing-how" id="how">
        <div className="landing-section-inner">
          <div className="landing-section-label">Simple Process</div>
          <h2 className="landing-section-title">
            Order in 4 simple steps.
          </h2>

          <div className="landing-steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="landing-step-card">
                <div className="landing-step-num">{s.num}</div>
                <h3 className="landing-step-title">{s.title}</h3>
                <p className="landing-step-desc">{s.desc}</p>
                {i < STEPS.length - 1 && <div className="landing-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════
          FINAL CTA
      ════════════════════ */}
      <section className="landing-final-cta">
        <div className="landing-final-inner">
          <div className="landing-final-badge">🌿 Theni's Smartest Grocery App</div>
          <h2 className="landing-final-title">
            Ready to experience<br />premium grocery delivery?
          </h2>
          <p className="landing-final-sub">
            Join Theni Retail today. Free signup. No subscription. Just groceries, delivered.
          </p>
          <div className="landing-final-btns">
            <button
              className="landing-cta-primary large"
              onClick={() => navigate("/signup")}
              type="button"
            >
              <span>Create Free Account</span>
              <span className="landing-cta-arrow">→</span>
            </button>
            <button
              className="landing-cta-ghost"
              onClick={() => navigate("/login")}
              type="button"
            >
              Login to existing account
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════
          FOOTER
      ════════════════════ */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-footer-logo">🛒</span>
            <span className="landing-footer-name">Theni Retail</span>
          </div>
          <p className="landing-footer-copy">
            © 2025 Theni Retail. Built for Theni. Powered by Ganapathy Silks.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Landing;