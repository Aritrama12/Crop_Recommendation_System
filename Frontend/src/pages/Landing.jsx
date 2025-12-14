import '../scss/landing.scss';
import { useState } from 'react';  
import Soil from '../assets/Soil.png';
import weather from '../assets/weather.png';
import Ai from '../assets/Ai.png';
import market from '../assets/market.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState(null);

  const [loginData, setLoginData] = useState({
  username: '',
  password: ''
});

const [signupData, setSignupData] = useState({
  username: '',
  email: '',
  password: '',
  password2: ''
});


  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/auth/register',
        signupData
      );
       console.log(res.data);

    setActiveTab('signin');
    setError(null);


    } catch (err) {
        if (err.response?.data) {
          const messages = Object.values(err.response.data).flat().join(' ');
          setError(messages);
        } else {
          setError('Something went wrong');
        }
      }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/auth/login',
        loginData
      );

      // store tokens
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      navigate('/dashboard');
    }catch (err) {
      if (err.response?.data) {
        const messages = Object.values(err.response.data).flat().join(' ');
        setError(messages);
      } else {
        setError('Something went wrong');
      }
    }
  };



  return (
    <>
    <div className="landing-page">
      <Navbar />
      <header className="tagline">Powered by AI & Machine Learning</header>

      {/* Hero Section */}

      <section className="hero">
        <h1>Smart Farming <br/>Made Simple</h1>
        <p>
          Get AI-powered crop recommendations, weather insights, and analytics 
          to maximize your harvest and profits.
        </p>
        <div className="hero-buttons">
          <a href="/login" className="btn primary">Get Started</a>
          <a href="#" className="btn secondary">Watch Demo</a>
        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        <div className="stat"><h2>500+</h2><span>Farmers</span></div>
        <div className="stat"><h2>50+</h2><span>Crops</span></div>
        <div className="stat"><h2>95%</h2><span>Success Rate</span></div>
        <div className="stat"><h2>24/7</h2><span>Support</span></div>
      </div>

      {/* Features */}
      <section className="features" id="features">
        <h1>Everything You Need</h1>
        <p>
          Our comprehensive platform provides all the tools and insights you need 
          to make informed farming decisions.
        </p>
        <div className="feature-cards">
          {[
            {
              Image: Ai,
              title: 'AI-Powered Recommendations',
              desc: 'Get personalized crop suggestions based on your soil, weather, and market data.'
            },
            {
              Image: weather,
              title: 'Weather Insights',
              desc: 'Access real-time weather forecasts and alerts to plan your farming activities.'
            },
            {
              Image: Soil,
              title: 'Soil Analysis',
              desc: 'Understand your soil health with detailed analysis and improvement tips.'
            },
            {
              Image: market,
              title: 'Market Trends',
              desc: 'Stay updated with the latest market prices and demand trends for various crops.'
            }
          ].map((feature, i) => (
            <div className="feature-card" key={i}>
              <img src={feature.Image} alt={feature.title} />
              <h2>{feature.title}</h2>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <h1>What Our Users Say ?</h1>
        <div className="testimonial-cards">
          {[
            {
              text: '"This platform transformed my farming business. The AI recommendations are spot on!"',
              name: '- John D.'
            },
            {
              text: '"The weather insights helped me avoid crop damage during unexpected storms."',
              name: '- Sarah K.'
            },
            {
              text: '"I increased my profits by 30% using the market trend analysis."',
              name: '- Mike L.'
            }
          ].map((t, i) => (
            <div className="testimonial-card" key={i}>
              <p>{t.text}</p>
              <h3>{t.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Auth Section */}
      <section className="landing-auth" id='contact'>
        <div className="auth-card">
          <h2>Welcome</h2>
          <p>Sign in to your account or create a new one to get started</p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={activeTab === 'signin' ? 'active' : ''}
              onClick={() => {
                setActiveTab('signin');
                setError(null);
              }}
            >
              Sign In
            </button>
            <button
              className={activeTab === 'signup' ? 'active' : ''}
              onClick={() => {
                setActiveTab('signup')
                setError(null);
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'signin' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label>username</label>
              <input 
              type="text" 
              placeholder="name_lastname@" 
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              required />

              <label>Password</label>
              <input 
              type="password" 
              placeholder="password" 
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required />
              {error && <p className="error" style={{ color: "red" }}>{error}</p>}
              <button type="submit" className="btn primary">Sign In</button>

            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <label>Username</label>
              <input 
              type="text" 
              placeholder="John_Doe12" 
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
              required />

              <label>Email</label>
              <input 
              type="email" 
              placeholder="name@example.com" 
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              required />

              <label>Password</label>
              <input 
              type="password" 
              placeholder="password" 
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              required />

              <label>Confirm Password</label>
              <input 
              type="password" 
              placeholder="password" 
              value={signupData.password2}
              onChange={(e) =>
                setSignupData({ ...signupData, password2: e.target.value })
              }
              required />
              {error && <p className="error" style={{ color: "red" }}>{error}</p>}
              <button type="submit" className="btn primary">Sign Up</button>
            </form>
          )}
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default Landing;
