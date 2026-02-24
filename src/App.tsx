/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/patient/Doctors';
import DoctorPublicProfile from './pages/patient/DoctorPublicProfile';
import NewCase from './pages/patient/NewCase';
import AdminDashboard from './pages/admin/Dashboard';
import DoctorProfile from './pages/doctor/Profile';
import DoctorCases from './pages/doctor/Cases';
import NewArticle from './pages/doctor/NewArticle';
import CaseDetails from './pages/CaseDetails';
import PatientProfile from './pages/patient/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorPublicProfile />} />
          <Route path="cases" element={<DoctorCases />} />
          <Route path="cases/new" element={<NewCase />} />
          <Route path="cases/:id" element={<CaseDetails />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="patient-profile" element={<PatientProfile />} />
          <Route path="articles/new" element={<NewArticle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
