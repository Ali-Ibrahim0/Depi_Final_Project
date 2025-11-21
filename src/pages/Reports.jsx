import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
      window.showNotification('Please login first.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    setCurrentUser(user);

    const savedCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');

    setCheckIns(savedCheckIns);
    setUsers(allUsers);

    
    filterReports(user.id);
  }, [navigate]);

  const filterReports = (userId = currentUser?.id, start = null, end = null) => {
    if (!currentUser) return;

    let filtered = checkIns.filter(c => c.user_id === parseInt(userId));

    if (start && end) {
      const startD = new Date(start);
      const endD = new Date(end);
      endD.setHours(23, 59, 59, 999);

      filtered = filtered.filter(c => {
        const date = new Date(c.timestamp);
        return date >= startD && date <= endD;
      });
    }

    setFilteredData(filtered);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedUser || !startDate || !endDate) {
      window.showNotification('Please fill all fields.', 'error');
      setLoading(false);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      window.showNotification('Start date must be before end date.', 'error');
      setLoading(false);
      return;
    }

    filterReports(selectedUser, startDate, endDate);
    window.showNotification('Report generated successfully!', 'success');
    setLoading(false);
  };

  if (!currentUser) return null;

  const isAdmin = ['admin', 'super_admin'].includes(currentUser.role);
  const companyUsers = users.filter(u => u.company === currentUser.company);

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-white">Reports</h2>

        {/* Admin Report Form */}
        {isAdmin && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3 text-white">Generate Report</h3>
              <form onSubmit={handleGenerate} className="d-flex flex-column gap-3">
                <select
                  className="form-select"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  required
                >
                  <option value="">Select User</option>
                  {companyUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.email}</option>
                  ))}
                </select>

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

                <button
                  type="submit"
                  className="btn btn-primary position-relative"
                  style={{ width: 'fit-content', margin: '0 auto', borderRadius: '20px' }}
                  disabled={loading}
                >
                  Generate Report
                  <div className="spinner" style={{ display: loading ? 'block' : 'none' }}></div>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reports Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">
              {isAdmin && selectedUser ? 'Employee' : 'Your'} Reports
            </h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">No check-ins found.</td>
                    </tr>
                  ) : (
                    filteredData.map((c, i) => {
                      const user = users.find(u => u.id === c.user_id);
                      return (
                        <tr key={i}>
                          <td>{user?.email || 'Unknown'}</td>
                          <td>{new Date(c.timestamp).toLocaleDateString()}</td>
                          <td>{new Date(c.timestamp).toLocaleTimeString()}</td>
                          <td>Lat: {c.location.lat.toFixed(4)}, Lon: {c.location.lon.toFixed(4)}</td>
                          <td>{c.type === 'check-out' ? 'Check-Out' : 'Check-In'}</td>
                        </tr>
                      );
                    })
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