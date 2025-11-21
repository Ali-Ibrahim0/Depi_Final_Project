import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    window.showNotification("تم تسجيل الخروج بنجاح!", "success");
    localStorage.removeItem("currentUser");
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  };

  // ناف بار للزوار (غير مسجلين دخول)
  if (!currentUser) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            PresenceHub
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                  to="/login"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`}
                  to="/signup"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // الناف بار الكاملة للمستخدم المسجل دخول
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          PresenceHub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            {[
              { path: "/", label: "Home" },
              { path: "/dashboard", label: "Dashboard" },
              { path: "/reports", label: "Reports" },
              { path: "/user-management", label: "User Management" },
              { path: "/complaints", label: "Complaints" },
              { path: "/integrations", label: "Integrations" },
              { path: "/vacations", label: "Vacations" },
              { path: "/subscription", label: "Subscription" },
              { path: "/settings", label: "Account" }
            ].map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {}
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="nav-link text-danger btn btn-link p-0 m-0 border-0 bg-transparent fw-bold"
                style={{ cursor: "pointer", fontSize: "1.1rem" }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}