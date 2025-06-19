import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import RegisterPage from './pages/registerPage'
import LoginPage from './pages/loginPage'
import ContactPage from './pages/contactPage'
import { Toaster } from 'sonner'

function App() {
  return (

    
     
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>

         
          <Route path="/" element={<Hero />} />
          <Route path="/cars" element={<div>Cars Page</div>} />
          <Route path="/locations" element={<div>Locations Page</div>} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
