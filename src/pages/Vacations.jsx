import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Vacations() {
  const [currentUser, setCurrentUser] = useState(null);
  const [vacations, setVacations] = useState([]);
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      window.showNotification('Please login first.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    setCurrentUser(user);
    const saved = JSON.parse(localStorage.getItem('vacations') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setVacations(saved);
    setUsers(allUsers);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      window.showNotification('Please fill all fields.', 'error');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      window.showNotification('Start date must be before end date.', 'error');
      return;
    }

    setLoading(true);

    const newVacation = {
      id: vacations.length + 1,
      user_id: currentUser.id,
      start_date: startDate,
      end_date: endDate,
      reason: reason.trim(),
      status: 'Pending'
    };

    const updated = [...vacations, newVacation];
    setVacations(updated);
    localStorage.setItem('vacations', JSON.stringify(updated));

    window.showNotification('Vacation request submitted successfully!', 'success');
    setStartDate('');
    setEndDate('');
    setReason('');
    setLoading(false);
  };

  const updateStatus = (id, status) => {
    const updated = vacations.map(v => v.id === id ? { ...v, status } : v);
    setVacations(updated);
    localStorage.setItem('vacations', JSON.stringify(updated));
    window.showNotification(`Vacation ${status.toLowerCase()} successfully.`, 'success');
  };

  if (!currentUser) return null;

  const isAdmin = ['admin', 'super_admin'].includes(currentUser.role);
  const userVacations = vacations.filter(v => v.user_id === currentUser.id);
  const companyVacations = vacations.filter(v => {
    const user = users.find(u => u.id === v.user_id);
    return user && user.company === currentUser.company;
  });

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-white">Vacations</h2>

        {/* Request Vacation */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Request Vacation</h3>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <textarea
                className="form-control"
                placeholder="Reason for vacation"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn btn-primary position-relative mx-auto"
                style={{ width: 'fit-content', borderRadius: '20px', minWidth: '200px' }}
                disabled={loading}
              >
                Submit Request
                <div className="spinner" style={{ display: loading ? 'block' : 'none' }}></div>
              </button>
            </form>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3 text-white">Vacation Requests</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyVacations.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No vacation requests found.</td></tr>
                    ) : (
                      companyVacations.map(v => {
                        const user = users.find(u => u.id === v.user_id);
                        return (
                          <tr key={v.id}>
                            <td>{user?.email || 'Unknown'}</td>
                            <td>{v.start_date}</td>
                            <td>{v.end_date}</td>
                            <td>{v.reason}</td>
                            <td>
                              <span className={`badge bg-${v.status === 'Approved' ? 'success' : v.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                {v.status}
                              </span>
                            </td>
                            <td>
                              {v.status === 'Pending' && (
                                <>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => updateStatus(v.id, 'Approved')}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => updateStatus(v.id, 'Rejected')}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User's Requests */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Your Vacation Requests</h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userVacations.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No vacation requests found.</td></tr>
                  ) : (
                    userVacations.map(v => (
                      <tr key={v.id}>
                        <td>{v.start_date}</td>
                        <td>{v.end_date}</td>
                        <td>{v.reason}</td>
                        <td>
                          <span className={`badge bg-${v.status === 'Approved' ? 'success' : v.status === 'Rejected' ? 'danger' : 'warning'}`}>
                            {v.status}
                          </span>
                        </td>
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