import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.showNotification("Login successful.", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      window.showNotification("Invalid email or password.", "error");
      setLoading(false);
    }
  };

  return (
    <main className="container py-5 ">
      <section id="login" className="card shadow-lg mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body p-5">
          <h2 className="display-6 fw-bold text-center mb-4 text-white">Login</h2>
          <form id="login-form" className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <input type="email" id="email" className="form-control form-control-lg" placeholder="Email" required />
            <input type="password" id="password" className="form-control form-control-lg" placeholder="Password" required />
            <button type="submit" className="btn btn-primary btn-lg position-relative" disabled={loading}>
              Login
              <div id="login-spinner" className="spinner" style={{ display: loading ? 'block' : 'none' }}></div>
            </button>
            <p className="text-center mt-3 text-white">
              Don't have an account? <a href="/signup" className="text-gold">Sign Up</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}