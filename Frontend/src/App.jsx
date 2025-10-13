
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Recommendation from './pages/Recommendation'
import Weather from './pages/Weather'
import Soilanalysis from './pages/Soilanalysis'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Settings from './pages/Settings'



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
