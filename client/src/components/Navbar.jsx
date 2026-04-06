import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  return (
    <div style={{ padding: "10px", background: "#333" }}>
      <Link to="/" style={{ margin: "10px", color: "#fff" }}>
        Home
      </Link>

      {!token && (
        <>
          <Link to="/login" style={{ margin: "10px", color: "#fff" }}>
            Login
          </Link>

          <Link to="/register" style={{ margin: "10px", color: "#fff" }}>
            Register
          </Link>
        </>
      )}

      {token && (
        <>
          <Link to="/dashboard" style={{ margin: "10px", color: "#fff" }}>
            Dashboard
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Navbar;