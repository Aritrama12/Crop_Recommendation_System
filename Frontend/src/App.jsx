
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/LandingPage/Landing'
import Dashboard from './components/Dashboard'
import Recommendation from './components/Recommendation'
import Weather from './components/Weather'
import Soilanalysis from './components/Soilanalysis'
import Analytics from './components/Analytics'
import Profile from './components/Profile'
import Settings from './components/Settings'



function App() {

  return (
   <div className="container">
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/recommendations' element={<Recommendation/>} />
        <Route path='/weather' element={<Weather/>}/>
        <Route path='/soil-analysis' element={<Soilanalysis/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/settings' element={<Settings/>}/>
        
      </Routes>
    </Router>
   </div>
  )
}

export default App
