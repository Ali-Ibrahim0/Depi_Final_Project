import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', email: '', role: 'employee', company: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      window.showNotification('Please login first.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    if (!['admin', 'super_admin'].includes(user.role)) {
      window.showNotification('Access denied. Admins only.', 'error');
      navigate('/dashboard', { replace: true });
      return;
    }

    setCurrentUser(user);
    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const companyUsers = allUsers.filter(u => u.company === currentUser?.company);
    setUsers(companyUsers);
  };

  const handleEdit = (user) => {
    setEditUser({
      id: user.id,
      email: user.email,
      role: user.role,
      company: user.company
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const { id, email, role, company } = editUser;

    if (!email || !role || !company) {
      window.showNotification('Please fill all fields.', 'error');
      setLoading(false);
      return;
    }

    let allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = allUsers.some(u => u.email === email && u.id !== id);

    if (emailExists) {
      window.showNotification('Email already exists.', 'error');
      setLoading(false);
      return;
    }

    allUsers = allUsers.map(u =>
      u.id === id ? { ...u, email, role, company } : u
    );

    localStorage.setItem('users', JSON.stringify(allUsers));

    //update currentuse
    if (currentUser.id === id) {
      const updatedUser = { ...currentUser, email, role, company };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    window.showNotification('User updated successfully!', 'success');
    setLoading(false);
    loadUsers();

    
    const modal = document.getElementById('edit-user-modal');
    const bsModal = window.bootstrap.Modal.getInstance(modal);
    bsModal?.hide();
  };

  const handleDelete = (id) => {
    if (id === currentUser.id) {
      window.showNotification('Cannot delete your own account!', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    let allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    allUsers = allUsers.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(allUsers));

    window.showNotification('User deleted successfully!', 'success');
    loadUsers();
  };

  if (!currentUser) return null;

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-white">User Management</h2>

        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Manage Users</h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">No users found.</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                        <td>{user.company}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-user-modal"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit User Modal */}
        <div className="modal fade" id="edit-user-modal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-dark">Edit User</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSave} className="d-flex flex-column gap-3">
                  <input type="hidden" value={editUser.id} />
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    required
                  />
                  <select
                    className="form-select"
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company Name"
                    value={editUser.company}
                    onChange={(e) => setEditUser({ ...editUser, company: e.target.value })}
                    required
                  />
                  <button type="submit" className="btn btn-primary position-relative" disabled={loading}>
                    Save Changes
                    <div className="spinner" style={{ display: loading ? 'block' : 'none' }}></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}