import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import AdminDashboard from './pages/admin/Dashboard';
import AdminVolunteers from './pages/admin/Volunteers';
import AdminVolunteerDetails from './pages/admin/VolunteerDetails';
import AdminDonors from './pages/admin/Donors';
import AdminDonorDetails from './pages/admin/DonorDetails';
import AdminEvents from './pages/admin/Events';
import AdminEventDetails from './pages/admin/EventDetails';
import AdminCreateEvent from './pages/admin/CreateEvent';
import AdminDonations from './pages/admin/Donations';
import AdminDonationDetails from './pages/admin/DonationDetails';
import AdminDonationReceipt from './pages/admin/DonationReceipt';
import AdminApplications from './pages/admin/Applications';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

import VolunteerDashboard from './pages/volunteer/Dashboard';
import VolunteerProfile from './pages/volunteer/Profile';
import VolunteerSkills from './pages/volunteer/Skills';
import VolunteerEvents from './pages/volunteer/Events';
import VolunteerMyEvents from './pages/volunteer/MyEvents';
import VolunteerEventDetails from './pages/volunteer/EventDetails';
import VolunteerHours from './pages/volunteer/Hours';

import DonorDashboard from './pages/donor/Dashboard';
import DonorProfile from './pages/donor/Profile';
import DonorMyDonations from './pages/donor/MyDonations';
import DonorDonationReceipt from './pages/donor/DonationReceipt';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout allow={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/volunteers" element={<AdminVolunteers />} />
        <Route path="/admin/volunteers/:id" element={<AdminVolunteerDetails />} />
        <Route path="/admin/donors" element={<AdminDonors />} />
        <Route path="/admin/donors/:id" element={<AdminDonorDetails />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/events/new" element={<AdminCreateEvent />} />
        <Route path="/admin/events/:id" element={<AdminEventDetails />} />
        <Route path="/admin/donations" element={<AdminDonations />} />
        <Route path="/admin/donations/:id" element={<AdminDonationDetails />} />
        <Route path="/admin/donations/:id/receipt" element={<AdminDonationReceipt />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route element={<DashboardLayout allow={['volunteer']} />}>
        <Route path="/volunteer" element={<VolunteerDashboard />} />
        <Route path="/volunteer/profile" element={<VolunteerProfile />} />
        <Route path="/volunteer/skills" element={<VolunteerSkills />} />
        <Route path="/volunteer/events" element={<VolunteerEvents />} />
        <Route path="/volunteer/my-events" element={<VolunteerMyEvents />} />
        <Route path="/volunteer/events/:id" element={<VolunteerEventDetails />} />
        <Route path="/volunteer/hours" element={<VolunteerHours />} />
      </Route>

      <Route element={<DashboardLayout allow={['donor']} />}>
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/donor/profile" element={<DonorProfile />} />
        <Route path="/donor/donations" element={<DonorMyDonations />} />
        <Route path="/donor/donations/:id/receipt" element={<DonorDonationReceipt />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
