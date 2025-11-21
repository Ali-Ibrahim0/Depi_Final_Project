import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const role = e.target.role.value;
    const company = e.target.company.value.trim();

    if (!email || !password || !role || !company) {
      window.showNotification("Please fill all fields.", "error");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      window.showNotification("Password must be at least 6 characters.", "error");
      setLoading(false);
      return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) {
      window.showNotification("Email already exists.", "error");
      setLoading(false);
      return;
    }

    const user = { id: users.length + 1, email, password, role, company };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    window.showNotification("Sign up successful.", "success");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <main className="container py-5 ">
      <section id="signup" className="card shadow-lg mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body p-5">
          <h2 className="display-6 fw-bold text-center mb-4 text-white">Sign Up</h2>
          <form id="signup-form" className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <input type="email" id="email" className="form-control form-control-lg" placeholder="Email" required />
            <input type="password" id="password" className="form-control form-control-lg" placeholder="Password" required />
            <select id="role" className="form-select form-control-lg" required>
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <input type="text" id="company" className="form-control form-control-lg" placeholder="Company Name" required />
            <button type="submit" className="btn btn-primary btn-lg position-relative" disabled={loading}>
              Sign Up
              <div id="signup-spinner" className="spinner" style={{ display: loading ? 'block' : 'none' }}></div>
            </button>
            <p className="text-center mt-3 text-white">
              Already have an account? <a href="/login" className="text-gold">Login</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}