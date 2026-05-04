import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollToTop from './ScrollToTop';
import Header from './components/Header';

// Lazy load all route components for code splitting
const Barber = lazy(() => import('./barber/barber'));
const Spa = lazy(() => import('./spa/spa'));
const Parlour = lazy(() => import('./parlour/parlour'));
const Hotel = lazy(() => import('./RoomSearch/RoomSearch'));
const SearchResults = lazy(() => import('./RoomSearch/SearchResults'));
const Gym = lazy(() => import('./gym/gym'));
const Signup = lazy(() => import('./components/Signup'));
const Login = lazy(() => import('./components/Login'));
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About/About'));
const Profile = lazy(() => import('./components/Profile'));
const ServiceInfo = lazy(() => import('./barber/ServiceInfo'));
const Contact = lazy(() => import('./components/Contact'));
const BookedOrders = lazy(() => import('./components/BookedOrders'));
const History = lazy(() => import('./components/History'));
const Funeral = lazy(() => import('./Funeral/Funeral'));
const Function = lazy(() => import('./Function/Function'));
const Form = lazy(() => import('./components/Form'));
const TermsAndConditions = lazy(() => import('./components/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyAndPolicy'));
const Refund = lazy(() => import('./components/Refund'));
const Points = lazy(() => import('./components/Points'));
const Gallery = lazy(() => import('./components/Gallery/Gallery'));


const App = () => {
  const [user, setUser] = useState(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("loggedInUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [points, setPoints] = useState(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const storedPoints = localStorage.getItem(`points_${userId}`);
      return storedPoints ? JSON.parse(storedPoints) : null;
    }
    return null;
  });
  const [url, setUrl] = useState(() => {
    // Check if user is logged in from localStorage
    const storedUrl = localStorage.getItem("url");
    return storedUrl ? JSON.parse(storedUrl) : null;
  })
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [aadhar, setAadhar] = useState(() => {
    // Check if user is logged in from localStorage
    const storedAadhar = localStorage.getItem("aadhar");
    return storedAadhar ? false : true;
  })
  const [showSplash, setShowSplash] = useState(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    return !splashShown;
  });
  // Function to toggle login modal
  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  // Load user from localStorage and handle loading state

  useEffect(() => {
    if (showSplash) {
      const splashTimeout = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true'); // Set flag after splash is shown
      }, 3000);

      return () => clearTimeout(splashTimeout);
    }
  }, [showSplash]);


  // Sync points to localStorage when they change
  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId && points !== null) {
      localStorage.setItem(`points_${userId}`, JSON.stringify(points));
    }
  }, [points]);

  const handleLogin = (userData) => {
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    localStorage.setItem(`points_${userData.user_id}`, JSON.stringify(userData.points))
    localStorage.setItem("currentUserId", JSON.stringify(userData.user_id))
    setUser(userData);
    setPoints(userData.points)
    setShowLoginModal(false); // Close the modal if it was open
  };


  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('currentUserId');
    setUser(null);
    setPoints(null);
  };

  if (showSplash) {
    return (
      <div className="splash-screen d-flex align-items-center justify-content-center">
        <div className="simple-loader"></div> {/* Add loading spinner */}
      </div>
    );
  }

  const handleScroll = () => {
    const section = document.getElementById("homeCards");
    section.scrollIntoView({ behavior: "smooth" });
  }
    // localStorage.setItem('fcm_token', JSON.stringify('de985ad4e255a320cda6c55cf79809b4a2c2e7d3'))

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="route-loading-fallback d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <div className="simple-loader"></div>
    </div>
  );

  return (
    <Router>
      <ScrollToTop />
      {/* <Header user={user} onLogout={handleLogout} /> */}
      {/* Hide Header only on Login and Signup pages */}
      {window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        <Header user={user} setUser={setUser} onLogout={handleLogout} ScrollDown={handleScroll} points={points} setPoints={setPoints} url={url}
          onLoginClick={handleShowLoginModal} // Pass function to show login modal
        />
      }

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/*  <Route path="/" element={<Navigate replace to="/home" />} />*/}
        <Route path="/signup" element={<Signup setUser={handleLogin} setPoints={setPoints} setUrl={setUrl} />} />
        <Route path="/login" element={<Login setUser={handleLogin} setPoints={setPoints} setUrl={setUrl} setAadhar={setAadhar} />} />
        <Route path="/" element={<Home user={user} setUser={setUser} points={points} setPoints={setPoints} />} />
        <Route path="/barber" element={<Barber user={user} setUser={setUser} points={points} setPoints={setPoints} />} />
        <Route path="/spa" element={<Spa user={user} setUser={setUser} points={points} setPoints={setPoints} />} />
        <Route path="/parlour" element={<Parlour user={user} setUser={setUser} points={points} setPoints={setPoints} />} />
        <Route path="/RoomSearch" element={<Hotel />} />
        <Route path="/search-results" element={<SearchResults user={user} setUser={setUser} points={points} setPoints={setPoints} aadhar={aadhar} setAadhar={setAadhar} />} />
        <Route path="/gym" element={<Gym user={user} setUser={setUser} points={points} setPoints={setPoints} />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/service-info/:id" element={<ServiceInfo />} />
        <Route path="/bookedOrders" element={<BookedOrders user={user} points={points} setPoints={setPoints} />} />
        <Route path="/history" element={<History points={points} setPoints={setPoints} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/funeral' element={<Funeral user={user} setUser={setUser} points={points} setPoints={setPoints} />} />
        <Route path='/function' element={<Function user={user} setUser={setUser} points={points} setPoints={setPoints} />} />
        <Route path="/form" element={<Form user={user} setUser={setUser} />} />
        <Route path='/terms' element={<TermsAndConditions/>} />
        <Route path="/policy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/points" element={<Points points={points} setPoints={setPoints} />} />
        <Route path="/gallery" element={<Gallery />} />

      </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
