import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ContactPage from './pages/contactPage';
import AboutPage from './pages/AboutPage';
import CarPage from './pages/CarPage';
import Verify from './components/auth/Verify';
import Profile from './components/Profile';
import { ToastProvider } from './components/toaster/ToasterContext';
import CreateCarPage from './pages/CreateCarPage';
import UserFetch from './dashboardd/adminDsshbor/manageusers/UserFetch';
import AdminDashboard from './dashboardd/adminDsshbor/AdminDashboard';
import Login from './components/auth/Login';
import GetBookings from './dashboardd/adminDsshbor/bookings/GetBookings';
import Reservation from './dashboardd/adminDsshbor/reservation/Reservation';
import Payments from './dashboardd/adminDsshbor/payments/Payments';
import Analytics from './dashboardd/adminDsshbor/analytics/Analytics';
import UserProfile from './dashboardd/adminDsshbor/profile/UserProfile';
import Cars from './dashboardd/adminDsshbor/cars/Cars';
import UserDashboard from './dashboardd/userDashboard/userDashboard';


function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/cars" element={<CarPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/profile" element={<Profile />} />
             <Route path="/create-car" element={<CreateCarPage />} />
             <Route path="/users" element={<UserFetch />} />
              {/* User Dashboard Route (from your example) */}
           
              <Route path="analytics" element={<h1>Analytics</h1>} />
            <Route path="cars" element={<CarPage/>} />
               <Route path="profile" element={<Profile />} />
             {/* </Route> */}
            {/* Admin Dashboard Route */}
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />  }
            >
                 <Route path="bookings" element={<GetBookings/>} />
                  <Route path="reservations" element={<Reservation/>} />
                 <Route path="cars" element={<Cars/>} />
                  <Route path="payments" element={<Payments/>} />
                  <Route path="analytics" element={<Analytics/>} />
                      <Route path="profile" element={<UserProfile/>} />
              {/* <Route path="analytics" element={<AdminAnalytics />} /> */}
              <Route path="users" element={<UserFetch />} />
              {/* <Route path="settings" element={<AdminSettings />} /> */}
            </Route>
             <Route
              path="/user/dashboard"
              element={<UserDashboard />  }
            >
                 <Route path="bookings" element={<GetBookings/>} />
                  <Route path="reservations" element={<Reservation/>} />
                 <Route path="cars" element={<Cars/>} />
                  <Route path="payments" element={<Payments/>} />
                  <Route path="analytics" element={<Analytics/>} />
                      <Route path="profile" element={<UserProfile/>} />
              {/* <Route path="analytics" element={<AdminAnalytics />} /> */}
              <Route path="users" element={<UserFetch />} />
              {/* <Route path="settings" element={<AdminSettings />} /> */}
            </Route>

          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;