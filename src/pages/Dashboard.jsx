import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [checkIns, setCheckIns] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 
  const [loadingIn, setLoadingIn] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
      window.showNotification('Please login first.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    setCurrentUser(user);
    const saved = JSON.parse(localStorage.getItem('checkIns') || '[]');
    setCheckIns(saved);
  }, [navigate]);

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const already = checkIns.some(c => c.user_id === currentUser.id && !c.type && new Date(c.timestamp).toISOString().split('T')[0] === today);
    if (already) return window.showNotification('Already checked in today.', 'error');

    setLoadingIn(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const newCheckIn = {
          user_id: currentUser.id,
          timestamp: new Date().toISOString(),
          location: { lat: pos.coords.latitude, lon: pos.coords.longitude }
        };
        const updated = [...checkIns, newCheckIn];
        setCheckIns(updated);
        localStorage.setItem('checkIns', JSON.stringify(updated));
        window.showNotification('Checked in successfully!', 'success');
        setLoadingIn(false);
      },
      () => {
        window.showNotification('Location denied.', 'error');
        setLoadingIn(false);
      }
    );
  };

  const handleCheckOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const checkedIn = checkIns.find(c => c.user_id === currentUser.id && !c.type && new Date(c.timestamp).toISOString().split('T')[0] === today);
    if (!checkedIn) return window.showNotification('Check in first.', 'error');

    const alreadyOut = checkIns.some(c => c.user_id === currentUser.id && c.type === 'check-out' && new Date(c.timestamp).toISOString().split('T')[0] === today);
    if (alreadyOut) return window.showNotification('Already checked out.', 'error');

    setLoadingOut(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const newCheckOut = {
          user_id: currentUser.id,
          timestamp: new Date().toISOString(),
          location: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          type: 'check-out'
        };
        const updated = [...checkIns, newCheckOut];
        setCheckIns(updated);
        localStorage.setItem('checkIns', JSON.stringify(updated));
        window.showNotification('Checked out successfully!', 'success');
        setLoadingOut(false);
      },
      () => {
        window.showNotification('Location denied.', 'error');
        setLoadingOut(false);
      }
    );
  };

  if (!currentUser) return null; // مهم عشان ما يعملش render قبل التحقق

  const userCheckIns = checkIns
    .filter(c => c.user_id === currentUser.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const isAdmin = ['admin', 'super_admin'].includes(currentUser.role);

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-white">Dashboard</h2>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Check-In / Check-Out</h3>
            <button className="btn btn-primary me-2 position-relative" onClick={handleCheckIn} disabled={loadingIn}>
              Check In
              <div className="spinner" style={{ display: loadingIn ? 'block' : 'none' }}></div>
            </button>
            <button className="btn btn-outline-secondary position-relative text-white" onClick={handleCheckOut} disabled={loadingOut}>
              Check Out
              <div className="spinner" style={{ display: loadingOut ? 'block' : 'none' }}></div>
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3 text-white">Employee Status</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Last In</th><th>Last Out</th><th>Time</th></tr></thead>
                  <tbody>
                    {JSON.parse(localStorage.getItem('users') || '[]')
                      .filter(u => u.company === currentUser.company)
                      .map(u => {
                        const entries = checkIns.filter(c => c.user_id === u.id);
                        const lastIn = entries.find(c => !c.type);
                        const lastOut = entries.find(c => c.type === 'check-out');
                        const status = !lastIn ? 'Not In' : (lastOut && new Date(lastOut.timestamp) > new Date(lastIn.timestamp) ? 'Out' : 'In');
                        return (
                          <tr key={u.id}>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{status}</td>
                            <td>{lastIn ? new Date(lastIn.timestamp).toLocaleString() : '-'}</td>
                            <td>{lastOut ? new Date(lastOut.timestamp).toLocaleString() : '-'}</td>
                            <td>-</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Your Check-Ins</h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead><tr><th>Type</th><th>Date</th><th>Time</th><th>Location</th></tr></thead>
                <tbody>
                  {userCheckIns.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No check-ins yet.</td></tr>
                  ) : (
                    userCheckIns.map((c, i) => (
                      <tr key={i}>
                        <td>{c.type === 'check-out' ? 'Check Out' : 'Check In'}</td>
                        <td>{new Date(c.timestamp).toLocaleDateString()}</td>
                        <td>{new Date(c.timestamp).toLocaleTimeString()}</td>
                        <td>Lat: {c.location.lat.toFixed(4)}, Lon: {c.location.lon.toFixed(4)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}