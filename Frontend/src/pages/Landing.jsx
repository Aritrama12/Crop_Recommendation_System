import '../scss/landing.scss';
import { useState } from 'react';  

const Landing = () => {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="landing-page">
      <header className="tagline">Powered by AI & Machine Learning</header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Smart Farming Made Simple</h1>
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
              title: 'AI-Powered Recommendations',
              desc: 'Get personalized crop suggestions based on your soil, weather, and market data.'
            },
            {
              title: 'Weather Insights',
              desc: 'Access real-time weather forecasts and alerts to plan your farming activities.'
            },
            {
              title: 'Soil Analysis',
              desc: 'Understand your soil health with detailed analysis and improvement tips.'
            },
            {
              title: 'Market Trends',
              desc: 'Stay updated with the latest market prices and demand trends for various crops.'
            }
          ].map((feature, i) => (
            <div className="feature-card" key={i}>
              <h2>{feature.title}</h2>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <h1>What Our Users Say</h1>
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
      <section className="landing-auth">
        <div className="auth-card">
          <h2>Welcome</h2>
          <p>Sign in to your account or create a new one to get started</p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={activeTab === 'signin' ? 'active' : ''}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              className={activeTab === 'signup' ? 'active' : ''}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'signin' ? (
            <form className="auth-form">
              <label>Email</label>
              <input type="email" placeholder="name@example.com" required />
              <label>Password</label>
              <input type="password" placeholder="password" required />
              <button type="submit" className="btn primary">Sign In</button>
            </form>
          ) : (
            <form className="auth-form">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
              <label>Email</label>
              <input type="email" placeholder="name@example.com" required />
              <label>Password</label>
              <input type="password" placeholder="password" required />
              <button type="submit" className="btn primary">Sign Up</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
