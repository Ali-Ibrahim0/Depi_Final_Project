import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Complaints() {
  const [currentUser, setCurrentUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
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
    const savedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setComplaints(savedComplaints);
    setUsers(allUsers);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !description.trim()) {
      window.showNotification('Please fill all required fields.', 'error');
      return;
    }

    setLoading(true);

    const newComplaint = {
      id: complaints.length + 1,
      user_id: currentUser.id,
      type,
      description: description.trim(),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      attachment: attachment ? attachment.name : null
    };

    const updated = [...complaints, newComplaint];
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));

    window.showNotification('Complaint submitted successfully!', 'success');
    setType('');
    setDescription('');
    setAttachment(null);
    document.getElementById('complaint-attachment').value = '';
    setLoading(false);
  };

  const updateStatus = (id, status) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
    window.showNotification(`Complaint ${status.toLowerCase()} successfully.`, 'success');
  };

  if (!currentUser) return null;

  const isAdmin = ['admin', 'super_admin'].includes(currentUser.role);
  const userComplaints = complaints.filter(c => c.user_id === currentUser.id);
  const companyComplaints = complaints.filter(c => {
    const user = users.find(u => u.id === c.user_id);
    return user && user.company === currentUser.company;
  });

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-white">Complaints & Feedback</h2>

        {/* Submit Complaint Form */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Submit Complaint</h3>
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="technical">Technical Issue</option>
                <option value="hr">HR Issue</option>
                <option value="management">Management</option>
                <option value="other">Other</option>
              </select>

              <textarea
                className="form-control"
                placeholder="Describe your complaint..."
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <input
                type="file"
                id="complaint-attachment"
                className="form-control"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setAttachment(e.target.files[0] || null)}
              />

              <button
                type="submit"
                className="btn btn-primary position-relative mx-auto"
                style={{ width: 'fit-content', borderRadius: '20px' }}
                disabled={loading}
              >
                Submit Complaint
                <div className="spinner" style={{ display: loading ? 'block' : 'none' }}></div>
              </button>
            </form>
          </div>
        </div>

        {/* Admin Section - All Complaints */}
        {isAdmin && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3 text-white">All Complaints</h3>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyComplaints.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No complaints found.</td></tr>
                    ) : (
                      companyComplaints.map(c => {
                        const user = users.find(u => u.id === c.user_id);
                        return (
                          <tr key={c.id}>
                            <td>{user?.email || 'Unknown'}</td>
                            <td>{c.type.charAt(0).toUpperCase() + c.type.slice(1)}</td>
                            <td>{c.description.substring(0, 30)}{c.description.length > 30 ? '...' : ''}</td>
                            <td>{c.date}</td>
                            <td>
                              <span className={`badge bg-${c.status === 'Resolved' ? 'success' : 'warning'}`}>
                                {c.status}
                              </span>
                            </td>
                            <td>
                              {c.status === 'Pending' && (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => updateStatus(c.id, 'Resolved')}
                                >
                                  Resolve
                                </button>
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

        {/* User's Own Complaints */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Your Complaints</h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userComplaints.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No complaints found.</td></tr>
                  ) : (
                    userComplaints.map(c => (
                      <tr key={c.id}>
                        <td>{c.type.charAt(0).toUpperCase() + c.type.slice(1)}</td>
                        <td>{c.description.substring(0, 50)}{c.description.length > 50 ? '...' : ''}</td>
                        <td>{c.date}</td>
                        <td>
                          <span className={`badge bg-${c.status === 'Resolved' ? 'success' : 'warning'}`}>
                            {c.status}
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