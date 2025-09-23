
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/LandingPage/Landing'


function App() {

  return (
   <div className="container">
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>} />
      </Routes>
    </Router>
   </div>
  )
}

export default App
