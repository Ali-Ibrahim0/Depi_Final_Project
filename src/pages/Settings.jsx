import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [loadingPic, setLoadingPic] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      window.showNotification('Please login first.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);
    setCurrentUser(user);

    setEmail(user.email || '');
    setCompany(user.company || '');
    setProfilePic(user.profilePicture || 'https://via.placeholder.com/100');
  }, [navigate]);

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingPic(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      const updatedUser = { ...currentUser, profilePicture: base64 };
      setCurrentUser(updatedUser);
      setProfilePic(base64);

      // Update in users array
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      window.showNotification('Profile picture updated successfully!', 'success');
      setLoadingPic(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!email.trim() || !company.trim()) {
      window.showNotification('Please fill all fields.', 'error');
      return;
    }

    const emailExists = users.some(u => u.email === email && u.id !== currentUser.id);
    if (emailExists) {
      window.showNotification('This email is already taken.', 'error');
      return;
    }

    setLoadingProfile(true);
    const updatedUser = { ...currentUser, email, company };
    setCurrentUser(updatedUser);

    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    window.showNotification('Profile updated successfully!', 'success');
    setLoadingProfile(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (currentPass !== currentUser.password) {
      window.showNotification('Current password is incorrect.', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      window.showNotification('New passwords do not match.', 'error');
      return;
    }
    if (newPass.length < 6) {
      window.showNotification('New password must be at least 6 characters.', 'error');
      return;
    }

    setLoadingPassword(true);
    const updatedUser = { ...currentUser, password: newPass };
    setCurrentUser(updatedUser);

    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    window.showNotification('Password changed successfully!', 'success');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setLoadingPassword(false);
  };

  if (!currentUser) return null;

  return (
    <main className="container py-5">
      <section>
        <h2 className="display-6 fw-bold mb-4 text-white">Account Settings</h2>

        {/* Profile Picture */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Profile Picture</h3>
            <div className="d-flex align-items-center gap-4">
              <img
                src={profilePic}
                alt="Profile"
                className="rounded-circle border border-3 border-gold"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={handlePictureUpload}
                />
                <button
                  className="btn btn-primary position-relative"
                  disabled={loadingPic}
                >
                  Upload Picture
                  <div className="spinner" style={{ display: loadingPic ? 'block' : 'none' }}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Profile Information</h3>
            <form onSubmit={handleProfileUpdate} className="d-flex flex-column gap-3">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Role"
                value={currentUser.role || ''}
                disabled
              />
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-lg mx-auto"
                style={{ width: '250px', borderRadius: '30px' }}
                disabled={loadingProfile}
              >
                Update Profile
                <div className="spinner" style={{ display: loadingProfile ? 'block' : 'none' }}></div>
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="h5 fw-bold mb-3 text-white">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="d-flex flex-column gap-3">
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Current Password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Confirm New Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-primary btn-lg mx-auto"
                style={{ width: '250px', borderRadius: '30px' }}
                disabled={loadingPassword}
              >
                Change Password
                <div className="spinner" style={{ display: loadingPassword ? 'block' : 'none' }}></div>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}