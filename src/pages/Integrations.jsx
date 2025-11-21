import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Integrations() {
  const [currentUser, setCurrentUser] = useState(null);
  const [integrations, setIntegrations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      window.showNotification('Please login first.', 'error');
      navigate('/login', { replace: true });
      return;
    }
    setCurrentUser(user);

    const saved = JSON.parse(localStorage.getItem('integrations') || '[]');
    setIntegrations(saved);
  }, [navigate]);

  const toggleIntegration = (type) => {
    let updated;
    const exists = integrations.find(i => i.type === type);

    if (exists) {
      updated = integrations.filter(i => i.type !== type);
      window.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} integration disconnected.`, 'error');
    } else {
      updated = [...integrations, { type, status: 'connected', date: new Date().toISOString() }];
      window.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} integration connected successfully!`, 'success');
    }

    setIntegrations(updated);
    localStorage.setItem('integrations', JSON.stringify(updated));
  };

  const isConnected = (type) => integrations.some(i => i.type === type);

  if (!currentUser) return null;

  const integrationList = [
    { type: 'hr', name: 'HR Systems', icon: '👤', desc: 'Connect with BambooHR, Workday, and SAP SuccessFactors' },
    { type: 'email', name: 'Email', icon: '📧', desc: 'Gmail, Outlook, and Office 365 integration' },
    { type: 'payroll', name: 'Payroll', icon: '💳', desc: 'ADP, Paychex, and Gusto payroll sync' }
  ];

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-white">Integrations</h2>

        {/* Available Integrations */}
        <div className="row g-4 mb-5">
          {integrationList.map(item => (
            <div key={item.type} className="col-md-6 col-lg-4">
              <div className="card shadow-sm integration-card h-100 text-center">
                <div className="card-body">
                  <div className="integration-icon mb-3 fs-1">{item.icon}</div>
                  <h5 className="card-title text-white">{item.name}</h5>
                  <p className="card-text text-white-50 small">{item.desc}</p>

                  <button
                    className={`btn ${isConnected(item.type) ? 'btn-danger' : 'btn-outline-primary'} button mt-3`}
                    onClick={() => toggleIntegration(item.type)}
                  >
                    {isConnected(item.type) ? 'Disconnect' : 'Connect'}
                  </button>

                  {}
                  {isConnected(item.type) && (
                    <div className="integration-status mt-3 text-success fw-bold fs-5">
                      Connected
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connected Integrations Section */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Connected Integrations</h3>
            <div className="row">
              {integrations.length === 0 ? (
                <div className="col-12">
                  <p className="text-muted">
                    No integrations connected yet. Click "Connect" above to get started!
                  </p>
                </div>
              ) : (
                integrations.map((intg, i) => (
                  <div key={i} className="col-md-6 col-lg-4 mb-3">
                    <div className="card bg-dark border-success">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white mb-1">
                            {intg.type.charAt(0).toUpperCase() + intg.type.slice(1)}
                          </h6>
                          <small className="text-white-50">
                            Connected: {new Date(intg.date).toLocaleDateString()}
                          </small>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => toggleIntegration(intg.type)}
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}