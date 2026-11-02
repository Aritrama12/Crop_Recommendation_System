// import '../scss/landing.scss';
// import { useState, useEffect } from 'react';  
// import Soil from '../assets/Soil.png';
// import weather from '../assets/weather.png';
// import Ai from '../assets/Ai.png';
// import market from '../assets/market.png';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Landing = () => {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState('signin');
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

// // password visibility states
//   const [showLoginPassword, setShowLoginPassword] = useState(false);
//   const [showSignupPassword, setShowSignupPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);



//   const [loginData, setLoginData] = useState({
//   username: '',
//   password: ''
// });

// const [signupData, setSignupData] = useState({
//   username: '',
//   email: '',
//   password: '',
//   password2: ''
// });


// const [showForgotPassword, setShowForgotPassword] = useState(false);

// const [forgotData, setForgotData] = useState({
//   email: '',
//   otp: '',
//   password: ''
// });


// const handleForgotPassword = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await axios.post(
//       'http://127.0.0.1:8000/api/auth/forgot-password',
//       {
//         email: forgotData.email
//       }
//     );

//     setError(null);
//     setSuccess(res.data.message);

//   } catch (err) {
//     const data = err.response?.data;

//     if (data) {
//       const messages = Object.values(data)
//         .flat()
//         .join(' ');

//       setError(messages);
//     } else {
//       setError('Something went wrong with forgot password');
//     }
//   }
// };






// const handleResetPassword = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await axios.post(
//       'http://127.0.0.1:8000/api/auth/reset-password',
//       forgotData
//     );

//     setError(null);

//     setSuccess(
//       'Password reset successful. Please sign in.'
//     );

//     setShowForgotPassword(false);

//     setForgotData({
//       email: '',
//       otp: '',
//       password: ''
//     });

//   } catch (err) {
//     const data = err.response?.data;

//     if (data) {
//       const messages = Object.values(data)
//         .flat()
//         .join(' ');

//       setError(messages);
//     } else {
//       setError('Something went wrong with reset password');
//     }
//   }
// };



//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         'http://127.0.0.1:8000/api/auth/register-request',
//         signupData
//       );
//       console.log(res.data);

//       setError(null);

//       setSuccess(
//         "Verification email sent. Please check your inbox and click the verification button."
//       );

//       setSignupData({
//         username: '',
//         email: '',
//         password: '',
//         password2: ''
//       });


//     } catch (err) {
//       const data = err.response?.data;
//         if (data) {
//           const messages = Object.values(data)
//             .flat()
//             .join(' ');

//           setError(messages);
//         } else {
//           setError('Something went wrong');
//         }
//       }
//   };


// //   const handleLogin = async (e) => {
// //   e.preventDefault();

// //   try {
// //     const res = await axios.post(
// //       "http://127.0.0.1:8000/api/auth/login",
// //       loginData
// //     );

// //     // Store JWT tokens
// //     localStorage.setItem(
// //       "access",
// //       res.data.access
// //     );

// //     localStorage.setItem(
// //       "refresh",
// //       res.data.refresh
// //     );

// //     // Store user data
// //     localStorage.setItem(
// //       "user",
// //       JSON.stringify(res.data.user)
// //     );

// //     navigate("/dashboard");

// //   } catch (err) {

// //     if (err.response?.data) {

// //       const messages = Object.values(
// //         err.response.data
// //       )
// //         .flat()
// //         .join(" ");

// //       setError(messages);

// //     } else {

// //       setError("Something went wrong");

// //     }
// //   }
// // };


// const handleLogin = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await axios.post(
//       "http://127.0.0.1:8000/api/auth/login",
//       loginData
//     );

//     console.log("LOGIN RESPONSE:", res.data);

//     setError(null);
//     setSuccess(null);

//     // Save tokens
//     if (res.data.access) {
//       localStorage.setItem("access", res.data.access);
//     }

//     if (res.data.refresh) {
//       localStorage.setItem("refresh", res.data.refresh);
//     }

//     // Save user ONLY if backend returns it
//     if (res.data.user) {
//       localStorage.setItem(
//         "user",
//         JSON.stringify(res.data.user)
//       );
//     } else {
//       console.warn("Backend did not return user object");
//       localStorage.removeItem("user");
//     }

//     if (res.data.user?.is_staff) {
//       navigate("/admin-dashboard");
//     } else {
//       navigate("/dashboard");
//     }

//   } catch (err) {
//     const data = err.response?.data;

//     if (data) {
//       const messages = Object.values(data)
//         .flat()
//         .join(" ");

//       setError(messages);
//     } else {
//       setError("Something went wrong");
//     }
//   }
// };

//   return (
//     <>
//     <div className="landing-page">
//       <Navbar />
//       <header className="tagline">Powered by AI & Machine Learning</header>

//       {/* Hero Section */}

//       <section className="hero">
//         <h1>Smart Farming <br/>Made Simple</h1>
//         <p>
//           Get AI-powered crop recommendations, weather insights, and analytics 
//           to maximize your harvest and profits.
//         </p>
//         <div className="hero-buttons">
//           <a href="/#contact" className="btn primary">Get Started</a>
//           <a href="#" className="btn secondary">Watch Demo</a>
//         </div>
//       </section>

//       {/* Stats */}
//       <div className="stats">
//         <div className="stat"><h2>500+</h2><span>Farmers</span></div>
//         <div className="stat"><h2>50+</h2><span>Crops</span></div>
//         <div className="stat"><h2>95%</h2><span>Success Rate</span></div>
//         <div className="stat"><h2>24/7</h2><span>Support</span></div>
//       </div>

//       {/* Features */}
//       <section className="features" id="features">
//         <h1>Everything You Need</h1>
//         <p>
//           Our comprehensive platform provides all the tools and insights you need 
//           to make informed farming decisions.
//         </p>
//         <div className="feature-cards">
//           {[
//             {
//               Image: Ai,
//               title: 'AI-Powered Recommendations',
//               desc: 'Get personalized crop suggestions based on your soil, weather, and market data.'
//             },
//             {
//               Image: weather,
//               title: 'Weather Insights',
//               desc: 'Access real-time weather forecasts and alerts to plan your farming activities.'
//             },
//             {
//               Image: Soil,
//               title: 'Soil Analysis',
//               desc: 'Understand your soil health with detailed analysis and improvement tips.'
//             },
//             {
//               Image: market,
//               title: 'Market Trends',
//               desc: 'Stay updated with the latest market prices and demand trends for various crops.'
//             }
//           ].map((feature, i) => (
//             <div className="feature-card" key={i}>
//               <img src={feature.Image} alt={feature.title} />
//               <h2>{feature.title}</h2>
//               <p>{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="testimonials" id="testimonials">
//         <h1>What Our Users Say ?</h1>
//         <div className="testimonial-cards">
//           {[
//             {
//               text: '"This platform transformed my farming business. The AI recommendations are spot on!"',
//               name: '- John D.'
//             },
//             {
//               text: '"The weather insights helped me avoid crop damage during unexpected storms."',
//               name: '- Sarah K.'
//             },
//             {
//               text: '"I increased my profits by 30% using the market trend analysis."',
//               name: '- Mike L.'
//             }
//           ].map((t, i) => (
//             <div className="testimonial-card" key={i}>
//               <p>{t.text}</p>
//               <h3>{t.name}</h3>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Auth Section */}
//       <section className="landing-auth" id='contact'>
//         <div className="auth-card">
//           <h2>Welcome</h2>
//           <p>Sign in to your account or create a new one to get started</p>

//           {/* Tabs */}
//           <div className="auth-tabs">
//             <button
//               className={activeTab === 'signin' ? 'active' : ''}
//               onClick={() => {
//                 setActiveTab('signin');
//                 setError(null);
//                 setSuccess(null);
//               }}
//             >
//               Sign In
//             </button>
//             <button
//               className={activeTab === 'signup' ? 'active' : ''}
//               onClick={() => {
//                 setActiveTab('signup')
//                 setError(null);
//                 setSuccess(null);
//               }}
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Forms */}
//           {activeTab === 'signin' ? (

//             showForgotPassword ? (

//               <form
//                 className="auth-form"
//                 onSubmit={handleResetPassword}
//               >

//                 <label>Email</label>

//                 <input
//                   type="email"
//                   value={forgotData.email}
//                   onChange={(e) =>
//                     setForgotData({
//                       ...forgotData,
//                       email: e.target.value
//                     })
//                   }
//                   required
//                 />

//                 <button
//                   type="button"
//                   className="btn secondary"
//                   onClick={handleForgotPassword}
//                 >
//                   Send OTP
//                 </button>

//                 <label>OTP</label>

//                 <input
//                   type="text"
//                   value={forgotData.otp}
//                   onChange={(e) =>
//                     setForgotData({
//                       ...forgotData,
//                       otp: e.target.value
//                     })
//                   }
//                   required
//                 />

//                 <label>New Password</label>

//                 <input
//                   type="password"
//                   value={forgotData.password}
//                   onChange={(e) =>
//                     setForgotData({
//                       ...forgotData,
//                       password: e.target.value
//                     })
//                   }
//                   required
//                 />

//                 {error && (
//                   <p style={{ color: "red" }}>
//                     {error}
//                   </p>
//                 )}

//                 {success && (
//                   <p style={{ color: "green" }}>
//                     {success}
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   className="btn primary"
//                 >
//                   Reset Password
//                 </button>

//                 <button
//                   type="button"
//                   className="btn secondary"
//                   onClick={() => {
//                     setShowForgotPassword(false);
//                     setError(null);
//                     setSuccess(null);
//                   }}
//                 >
//                   Back to Login
//                 </button>

//               </form>

//               ) : (

//             <form className="auth-form" onSubmit={handleLogin}>
//               <label>username</label>
//               <input 
//               type="text" 
//               placeholder="name_lastname@" 
//               value={loginData.username}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, username: e.target.value })
//               }
//               required />

//               <label>Password</label>
//               <div className="password-wrapper">
//                 <input
//                   type={showLoginPassword ? "text" : "password"}
//                   placeholder="password"
//                   value={loginData.password}
//                   onChange={(e) =>
//                     setLoginData({ ...loginData, password: e.target.value })
//                   }
//                   required
//                 />

//                 <span
//                   className="eye-icon"
//                   onClick={() => setShowLoginPassword(!showLoginPassword)}
//                 >
//                   {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>
//               <p
//                 className="forgot-password-link"
//                 onClick={() => {
//                   setShowForgotPassword(true);
//                   setError(null);
//                   setSuccess(null);
//                 }}
//               >
//                 Forgot Password?
//               </p>
//               {error && <p className="errorr" style={{ color: "red" }}>{error}</p>}
//               {success && (
//                 <p style={{ color: "green" }}>
//                   {success}
//                 </p>
//               )}
//               <button type="submit" className="btn primary">Sign In</button>

//             </form>
//             )
//             ) : (
//             <form className="auth-form" onSubmit={handleSignup}>
//               <label>Username</label>
//               <input 
//               type="text" 
//               placeholder="John_Doe12" 
//               value={signupData.username}
//               onChange={(e) =>
//                 setSignupData({ ...signupData, username: e.target.value })
//               }
//               required />

//               <label>Email</label>
//               <input 
//               type="email" 
//               placeholder="name@example.com" 
//               value={signupData.email}
//               onChange={(e) =>
//                 setSignupData({ ...signupData, email: e.target.value })
//               }
//               required />

//               <label>Password</label>
//               <div className="password-wrapper">
//                 <input
//                   type={showSignupPassword ? "text" : "password"}
//                   placeholder="password"
//                   value={signupData.password}
//                   onChange={(e) =>
//                     setSignupData({ ...signupData, password: e.target.value })
//                   }
//                   required
//                 />

//                 <span
//                   className="eye-icon"
//                   onClick={() => setShowSignupPassword(!showSignupPassword)}
//                 >
//                   {showSignupPassword  ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>

//               <label>Confirm Password</label>
//               <div className="password-wrapper">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="password"
//                   value={signupData.password2}
//                   onChange={(e) =>
//                     setSignupData({ ...signupData, password2: e.target.value })
//                   }
//                   required
//                 />

//                 <span
//                   className="eye-icon"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword  ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>

//               {error && <p className="errorr" style={{ color: "red" }}>{error}</p>}
//               {success && (
//                 <p style={{ color: "green" }}>
//                   {success}
//                 </p>
//               )}
//               <button type="submit" className="btn primary">Sign Up</button>
//             </form>
//           )}
//         </div>
//       </section>
//     </div>
//     <Footer/>
//     </>
//   );
// };

// export default Landing;

import { useTranslation } from "react-i18next";
import '../scss/landing.scss';
import { useState, useEffect } from 'react';  
import Soil from '../assets/Soil.png';
import weather from '../assets/weather.png';
import Ai from '../assets/Ai.png';
import market from '../assets/market.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

// password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



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


const [showForgotPassword, setShowForgotPassword] = useState(false);

const [forgotData, setForgotData] = useState({
  email: '',
  otp: '',
  password: ''
});


const handleForgotPassword = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/auth/forgot-password',
      {
        email: forgotData.email
      }
    );

    setError(null);
    setSuccess(res.data.message);

  } catch (err) {
    const data = err.response?.data;

    if (data) {
      const messages = Object.values(data)
        .flat()
        .join(' ');

      setError(messages);
    } else {
      setError('Something went wrong with forgot password');
    }
  }
};






const handleResetPassword = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/auth/reset-password',
      forgotData
    );

    setError(null);

    setSuccess(
      'Password reset successful. Please sign in.'
    );

    setShowForgotPassword(false);

    setForgotData({
      email: '',
      otp: '',
      password: ''
    });

  } catch (err) {
    const data = err.response?.data;

    if (data) {
      const messages = Object.values(data)
        .flat()
        .join(' ');

      setError(messages);
    } else {
      setError('Something went wrong with reset password');
    }
  }
};



  // const handleSignup = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.post(
  //       'http://127.0.0.1:8000/api/auth/register-request',
  //       signupData
  //     );
  //     console.log(res.data);

  //     setError(null);

  //     setSuccess(
  //       "Verification email sent. Please check your inbox and click the verification button."
  //     );

  //     setSignupData({
  //       username: '',
  //       email: '',
  //       password: '',
  //       password2: ''
  //     });


  //   } catch (err) {
  //     const data = err.response?.data;
  //       if (data) {
  //         const messages = Object.values(data)
  //           .flat()
  //           .join(' ');

  //         setError(messages);
  //       } else {
  //         setError('Something went wrong');
  //       }
  //     }
  // };

  
const handleSignup = async (e) => {
  e.preventDefault();

  setError(null);
  setSuccess(null);

  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/auth/register-request/',
      {
        username: signupData.username.trim(),
        email: signupData.email.trim(),
        password: signupData.password,
        password2: signupData.password2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('Registration response:', res.data);

    setSuccess(
      res.data.message ||
      'Verification email sent. Please check your inbox.'
    );

    setSignupData({
      username: '',
      email: '',
      password: '',
      password2: '',
    });

  } 
catch (err) {
  console.error("Registration error:", err);

  console.log("Status:", err.response?.status);
  console.log("Response data:", err.response?.data);
  console.log("Request URL:", err.config?.url);

  const data = err.response?.data;

  if (data && typeof data === "object") {
    setError(
      JSON.stringify(data, null, 2)
    );
  } else if (typeof data === "string") {
    setError(
      `HTTP ${err.response?.status || "Error"}: ${data.slice(0, 200)}`
    );
  } else {
    setError(
      "Cannot connect to Django. Check the backend terminal."
    );
  }
}

};



useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('verified') === 'true') {
    setActiveTab('signin');

    setSuccess(
      'Email verified successfully. Please sign in.'
    );
  }
}, []);




  
const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/auth/login/',
      loginData
    );

    // Store tokens
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);

    const user = res.data.user;

    localStorage.setItem('user', JSON.stringify(user));

    if (user?.is_staff) {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    if (err.response?.data) {
      const messages = Object.values(err.response.data)
        .flat()
        .join(' ');

      setError(messages);
    } else {
      setError('Something went wrong');
      console.error('Login error:', err);
    }
  }
};




  return (
    <>
    <div className="landing-page">
      <Navbar />
     <header className="tagline">
  {t("landing_tagline")}
</header>

      {/* Hero Section */}

      <section className="hero">
       <h1>
{t("landing_title_1")} <br />
{t("landing_title_2")}
</h1>
        <p>{t("landing_description")}</p>
        <div className="hero-buttons">
          <a href="/#contact" className="btn primary">{t("get_started")}</a>
          <a href="#" className="btn secondary">{t("watch_demo")}</a>
        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        {/* <div className="stat"><h2>500+</h2><span>{t("farmers")}</span></div> */}
        <div className="stat"><h2>20+</h2><span>{t("crops")}</span></div>
        <div className="stat"><h2>95%</h2><span>{t("success_rate")}</span></div>
        <div className="stat"><h2>24/7</h2><span>{t("support")}</span></div>
      </div>

      {/* Features */}
      <section className="features" id="features">
        <h1>{t("everything_you_need")}</h1>
        <p>
          {t("everything_you_need_desc")}
        </p>
        <div className="feature-cards">
          {[
            {
Image: Ai,
title: t("feature_ai_title"),
desc: t("feature_ai_desc")
},
{
Image: weather,
title: t("feature_weather_title"),
desc: t("feature_weather_desc")
},
{
Image: Soil,
title: t("feature_soil_title"),
desc: t("feature_soil_desc")
},
{
Image: market,
title: t("feature_market_title"),
desc: t("feature_market_desc")
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
        <h1>{t("testimonials_title")}</h1>
        <div className="testimonial-cards">
          {[
            {
text:t("testimonial1"),
name:t("testimonial1_name")
},
{
text:t("testimonial2"),
name:t("testimonial2_name")
},
{
text:t("testimonial3"),
name:t("testimonial3_name")
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
          <h2>{t("welcome")}</h2>
          <p>{t("auth_subtitle")}</p>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={activeTab === 'signin' ? 'active' : ''}
              onClick={() => {
                setActiveTab('signin');
                setError(null);
                setSuccess(null);
              }}
            >
             {t("sign_in")}
            </button>
            <button
              className={activeTab === 'signup' ? 'active' : ''}
              onClick={() => {
                setActiveTab('signup')
                setError(null);
                setSuccess(null);
              }}
            >
            {t("sign_up")}
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'signin' ? (

            showForgotPassword ? (

              <form
                className="auth-form"
                onSubmit={handleResetPassword}
              >

                <label>{t("email")}</label>

                <input
                  type="email"
                  value={forgotData.email}
                  onChange={(e) =>
                    setForgotData({
                      ...forgotData,
                      email: e.target.value
                    })
                  }
                  required
                />

                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleForgotPassword}
                >
                  {t("send_otp")}
                </button>

                <label>{t("otp")}</label>

                <input
                  type="text"
                  value={forgotData.otp}
                  onChange={(e) =>
                    setForgotData({
                      ...forgotData,
                      otp: e.target.value
                    })
                  }
                  required
                />

                <label>{t("new_password")}</label>

                <input
                  type="password"
                  value={forgotData.password}
                  onChange={(e) =>
                    setForgotData({
                      ...forgotData,
                      password: e.target.value
                    })
                  }
                  required
                />

                {error && (
                  <p style={{ color: "red" }}>
                    {error}
                  </p>
                )}

                {success && (
                  <p style={{ color: "green" }}>
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn primary"
                >
                  {t("reset_password")}
                </button>

                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                    setSuccess(null);
                  }}
                >
                 {t("back_to_login")}
                </button>

              </form>

              ) : (

            <form className="auth-form" onSubmit={handleLogin}>
              <label>{t("username")}</label>
              <input 
              type="text" 
             placeholder={t("username_placeholder")}
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              required />

              <label>{t("password")}</label>
              <div className="password-wrapper">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder={t("password")}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p
                className="forgot-password-link"
                onClick={() => {
                  setShowForgotPassword(true);
                  setError(null);
                  setSuccess(null);
                }}
              >
                {t("forgot_password")}
              </p>
              {error && <p className="errorr" style={{ color: "red" }}>{error}</p>}
              {success && (
                <p style={{ color: "green" }}>
                  {success}
                </p>
              )}
              <button type="submit" className="btn primary">{t("sign_in")}</button>

            </form>
            )
            ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <label>{t("username")}
</label>
              <input 
              type="text" 
              placeholder="John_Doe12" 
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
              required />

              <label>{t("email")}</label>
              <input 
              type="email" 
              placeholder="name@example.com" 
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              required />

              <label>{t("password")}</label>
              <div className="password-wrapper">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword  ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <label>{t("confirm_password")}</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="password"
                  value={signupData.password2}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password2: e.target.value })
                  }
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword  ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {error && <p className="errorr" style={{ color: "red" }}>{error}</p>}
              {success && (
                <p style={{ color: "green" }}>
                  {success}
                </p>
              )}
              <button type="submit" className="btn primary">{t("sign_up")}</button>
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