import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="container py-5 mt-5">
      <section>
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-dark text-white">
              <div className="card-header text-center py-5 border-0" style={{background: 'linear-gradient(90deg, var(--primary), var(--dark-bg))'}}>
                <h1 className="display-4 fw-bold mb-3 text-gold">
                  Privacy Policy
                </h1>
                <p className="lead mb-0 opacity-75">
                  Last Updated: November 21, 2025
                </p>
              </div>

              <div className="card-body p-5 p-lg-6">

                <div className="mb-5 p-4 bg-black-10 rounded-3 border-start border-4 border-gold">
                  <h2 className="h3 fw-bold mb-3 text-gold">1. Introduction</h2>
                  <p className="text-white-75 fs-6">
                    PresenceHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
                  </p>
                </div>

                <div className="mb-5 p-4 bg-black-10 rounded-3 border-start border-4 border-gold">
                  <h2 className="h3 fw-bold mb-4 text-gold">2. Information We Collect</h2>
                  <ul className="list-unstyled text-white-75 fs-6">
                    <li className="mb-3"><strong>Personal Information:</strong> Email, name, company, phone number</li>
                    <li className="mb-3"><strong>Usage Data:</strong> IP address, browser type, pages visited</li>
                    <li className="mb-3"><strong>Location Data:</strong> GPS coordinates for attendance tracking</li>
                    <li className="mb-3"><strong>Attendance Records:</strong> Check-in/out times, vacation requests, complaints</li>
                  </ul>
                </div>

                <div className="mb-5 p-4 bg-black-10 rounded-3 border-start border-4 border-gold">
                  <h2 className="h3 fw-bold mb-4 text-gold">3. How We Use Your Information</h2>
                  <div className="row g-4">
                    {["Attendance tracking", "Report generation", "Vacation management", "Complaint handling"].map((item, i) => (
                      <div key={i} className="col-md-6">
                        <div className="bg-primary text-white py-3 px-4 rounded-3 text-center fw-600 shadow-sm">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5 p-4 bg-success-25 rounded-3 border-start border-4 border-success">
                  <h2 className="h3 fw-bold mb-3 text-success">4. Data Security</h2>
                  <p className="text-white-75 fs-6">
                    We use industry-standard encryption (AES-256) and secure servers. Access is limited to authorized personnel only.
                  </p>
                </div>

                <div className="mb-5 p-4 bg-black-10 rounded-3 border-start border-4 border-gold">
                  <h2 className="h3 fw-bold mb-4 text-gold">5. Your Rights</h2>
                  <ul className="list-group list-group-flush bg-transparent">
                    {["Access your data", "Delete your data", "Export your data"].map((right, i) => (
                      <li key={i} className="list-group-item d-flex justify-content-between align-items-center py-3 bg-black-10 rounded-3 mb-2 border-0">
                        <span className="text-white-75 fs-6">{right}</span>
                        <span className="badge bg-success rounded-pill px-4 py-2 fw-bold">FREE</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center mt-6">
                  <Link to="/" className="btn btn-lg btn-warning text-dark fw-bold px-5 py-3 rounded-pill shadow-lg hover-lift">
                    Back to Home
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}