import { useStore } from '../store/useStore';
import PatientDashboard from './patient/Dashboard';
import DoctorDashboard from './doctor/Dashboard';
import AdminDashboard from './admin/Dashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const currentUser = useStore(state => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  switch (currentUser.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}
