export default function Home() {
  return (
    <main className="container py-5">
      <section id="hero" className="text-center py-5">
        <h1 className="display-4 fw-bold">Welcome to PresenceHub</h1>
        <p className="lead">Streamline your workforce management with real-time attendance tracking and analytics.</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          {/* لم يتم التعديل على الأزرار لعدم الرغبة في تغيير الألوان */}
          <a href="/signup" className="btn btn-primary btn-lg btn-clear">Get Started</a>
          <a href="/login" className="btn btn-outline-primary btn-lg btn-clear">Login</a>
        </div>
      </section>

      <section id="features" className="py-5">
        <h2 className="display-6 fw-bold text-center mb-5">Why Choose PresenceHub?</h2>
        {/*
          التعديل ١: إضافة d-flex و align-items-stretch على الصف (row)
          لتفعيل Flexbox وجعل الأعمدة تتمدد لأقصى ارتفاع.
        */}
        <div className="row g-4 d-flex align-items-stretch">
          <div className="col-md-4">
            {/* التعديل ٢: إضافة h-100 على البطاقة لتأخذ كامل ارتفاع العمود الأب. */}
            <div className="card shadow-sm feature-card h-100">
              <div className="card-body text-white">
                <h3 className="h5 fw-bold">Real-Time Tracking</h3>
                <p>Monitor employee attendance with geofenced check-ins.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {/* التعديل ٢: إضافة h-100 على البطاقة. */}
            <div className="card shadow-sm feature-card h-100">
              <div className="card-body text-white">
                <h3 className="h5 fw-bold">Detailed Reports</h3>
                <p>Generate insightful analytics for better decision-making.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {}
            <div className="card shadow-sm feature-card h-100">
              <div className="card-body text-white">
                <h3 className="h5 fw-bold">Seamless Integrations</h3>
                <p>Connect with your existing HR systems effortlessly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}