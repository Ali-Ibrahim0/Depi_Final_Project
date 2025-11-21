import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="container">
        <p className="mb-0">
          &copy; 2025 PresenceHub | 
          <Link to="/privacy" className="text-gold mx-2 text-decoration-none">
            Privacy Policy
          </Link>
          |
          <Link to="/terms" className="text-gold mx-2 text-decoration-none">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
}