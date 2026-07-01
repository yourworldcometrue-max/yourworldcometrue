import { useLocation, Link } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const username = location.state?.username || "Guest";

  return (
    <div>
      <nav
        style={{
          background: "#222",
          padding: "15px",
          display: "flex",
          gap: "20px",
        }}
      >
        <Link to="/about" style={{ color: "white" }}>About</Link>
        <Link to="/shop" style={{ color: "white" }}>Shop</Link>
        <Link to="/food" style={{ color: "white" }}>Food</Link>
        <Link to="/travel" style={{ color: "white" }}>Travel</Link>
        <Link to="/health" style={{ color: "white" }}>Health</Link>
        <Link to="/others" style={{ color: "white" }}>Others</Link>
      </nav>

      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Hi {username} 👋</h1>
        <h2>Welcome to Your World Come True Today</h2>
      </div>
    </div>
  );
}