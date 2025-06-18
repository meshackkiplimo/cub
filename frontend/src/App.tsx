import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

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
          <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
