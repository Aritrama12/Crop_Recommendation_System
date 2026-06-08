import './App.css'
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Recommendation from './pages/Recommendation'
import FarmRecords from './pages/FarmRecords'
import Weather from './pages/Weather'
import Soilanalysis from './pages/Soilanalysis'
import Analytics from './pages/Analytics'
import Markets from './pages/Markets'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ProtectedRoute from './authMiddleware/protected'
import NotificationPanel from './components/NotificationPanel'
import { Outlet } from 'react-router-dom';


function App() {


  function TopBarLayout() {
    return (
      <div className="protectedd-layout">
        <header className="topp-header">
          <NotificationPanel />
        </header>

        <main className="pagee-content">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
   <div className="container">


    {/* ✅ HOT TOAST GLOBAL NOTIFIER */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#1f8f4a",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#d9534f",
              color: "#fff",
            },
          },
          duration: 3000,
        }}
      />
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<TopBarLayout />}>
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/recommendations' element={<Recommendation/>} />
            <Route path='/farm-records' element={<FarmRecords/>} />
            <Route path='/weather' element={<Weather/>}/>
            <Route path='/soil-analysis' element={<Soilanalysis/>}/>
            <Route path='/analytics' element={<Analytics/>}/>
            <Route path='/markets' element={<Markets/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/settings' element={<Settings/>}/>
          </Route>
        <Route path='/login' element={<Landing/>}/>
        </Route>
        
      </Routes>
    </Router>
   </div>
  )
}

export default App
