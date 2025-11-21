import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <main className="container py-5 mt-5">
      <section id="terms">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card bg-dark text-white shadow-lg border-0">
              <div className="card-body p-5">
                <h1 className="display-4 fw-bold mb-4 text-center">Terms of Service</h1>
                <p className="lead text-center text-gold mb-5">Effective: November 20, 2025</p>

                <div className="terms-section mb-5">
                  <h2 className="h3 fw-bold text-gold mb-3">1. Acceptance of Terms</h2>
                  <p className="text-white-50">
                    By accessing and using PresenceHub, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                  </p>
                </div>

                <div className="terms-section mb-5">
                  <h2 className="h3 fw-bold text-gold mb-3">2. Service Description</h2>
                  <p className="text-white-50">
                    PresenceHub provides attendance tracking, vacation management, reporting, and HR integration services for businesses.
                  </p>
                </div>

                <div className="terms-section mb-5">
                  <h2 className="h3 fw-bold text-gold mb-3">3. User Responsibilities</h2>
                  <div className="row g-3">
                    <div className="col-md-6"><div className="alert alert-warning py-3"><strong>Checkmark</strong> Use accurate location data</div></div>
                    <div className="col-md-6"><div className="alert alert-warning py-3"><strong>Checkmark</strong> Keep account secure</div></div>
                    <div className="col-md-6"><div className="alert alert-warning py-3"><strong>Cross</strong> No fake check-ins</div></div>
                    <div className="col-md-6"><div className="alert alert-warning py-3"><strong>Cross</strong> No data sharing</div></div>
                  </div>
                </div>

                <div className="terms-section mb-5">
                  <h2 className="h3 fw-bold text-gold mb-3">4. Subscription & Payments</h2>
                  <ul className="list-unstyled text-white-50">
                    <li className="mb-2"><strong>Basic:</strong> Free - 10 employees</li>
                    <li className="mb-2"><strong>Pro:</strong> $29/month - 100 employees</li>
                    <li className="mb-2"><strong>Enterprise:</strong> $99/month - Unlimited</li>
                  </ul>
                </div>

                <div className="terms-section mb-5">
                  <h2 className="h3 fw-bold text-gold mb-3">5. Termination</h2>
                  <p className="text-danger fw-bold">
                    We may terminate your account for violation of these terms without notice.
                  </p>
                </div>

                <div className="text-center mt-5">
                  <Link to="/" className="btn btn-primary btn-lg px-5">Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}