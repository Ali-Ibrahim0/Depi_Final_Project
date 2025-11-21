import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import gsap from 'gsap';

export default function NotFound() {
  useEffect(() => {
    gsap.from('.error-icon', { scale: 0, duration: 1, ease: 'back.out(1.7)' });
    gsap.from('h1', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
    gsap.from('h2', { opacity: 0, y: 50, duration: 1, delay: 0.7 });
    gsap.from('p', { opacity: 0, y: 30, duration: 1, delay: 0.9 });
    gsap.from('.btn', { opacity: 0, scale: 0.8, duration: 1, delay: 1.1 });
  }, []);

  return (
    <>
      {/* Navbar  404 */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ background: 'rgba(10, 108, 116, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">PresenceHub</Link>
        </div>
      </nav>

      <main className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div className="text-center text-white">
          <div className="error-icon mb-4">No entry</div>
          <h1 className="display-1 fw-bold mb-3 text-danger">404</h1>
          <h2 className="display-5 fw-bold mb-4">Page Not Found</h2>
          <p className="lead mb-5">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn btn-primary btn-lg px-5">
            Back to Home
          </Link>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-4 position-fixed bottom-0 w-100">
        &copy; 2025 PresenceHub
      </footer>
    </>
  );
}