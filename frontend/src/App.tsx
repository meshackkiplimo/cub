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

          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;