import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Notification from '../components/Notification';

export default function MainLayout() {
  return (
    <>
      <Notification />
      <Navbar />
      <div className="pt-5 min-vh-100 d-flex flex-column">
        <Outlet />
        <Footer />
      </div>
    </>
  );
}