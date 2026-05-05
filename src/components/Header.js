import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Navbar, Nav, Container, Modal, Form, Button, InputGroup, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

// Import Images
import logo from "./Image/logo.jpg";

// Import Icons
import { FaHotel, FaCut, FaSpa, FaDumbbell, FaUser, FaLock, FaEye, FaEyeSlash, FaPhoneAlt, FaChevronDown, FaShieldAlt, FaFileContract, FaMoneyBillWave, FaPaintBrush, FaHome, FaInfoCircle } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { BsArrowDownRightSquareFill } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import "./Header.css";

function Header({ user, setUser, points, setPoints, url }) {
  const navigate = useNavigate();

  // --- State Management ---
  const [emblemUrl, setEmblemUrl] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userData, setUserData] = useState({ username: '', password: '', phone_number: '' });
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // --- Side Drawer State ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // --- Dropdown States (Desktop) ---
  const [showDesktopBooking, setShowDesktopBooking] = useState(false);
  const [showDesktopProfile, setShowDesktopProfile] = useState(false);
  const [showDesktopInfo, setShowDesktopInfo] = useState(false);

  // --- Dropdown States (Mobile/Drawer) ---
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  // --- Refs ---
  const bookingRef = useRef(null);
  const profileRef = useRef(null);
  const infoRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bookingRef.current && !bookingRef.current.contains(event.target)) setShowDesktopBooking(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowDesktopProfile(false);
      if (infoRef.current && !infoRef.current.contains(event.target)) setShowDesktopInfo(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      const storedPoints = localStorage.getItem(`points_${parsedUser.user_id}`);
      if (storedPoints) {
        setPoints(JSON.parse(storedPoints));
      } else if (parsedUser.points !== undefined) {
        setPoints(parsedUser.points);
      }
      
      const rawUrl = localStorage.getItem("url");
      if (rawUrl) {
        try {
          setEmblemUrl(JSON.parse(rawUrl));
        } catch (e) {
          setEmblemUrl(rawUrl);
        }
      } else if (url) {
        setEmblemUrl(url);
      }
    }
  }, [setUser, url, setPoints]);

  // --- Handlers ---
  const handleNavigation = useCallback((path) => {
    navigate(path);
    setIsDrawerOpen(false);
    setShowDesktopBooking(false);
    setShowDesktopProfile(false);
    setShowDesktopInfo(false);
  }, [navigate]);

  const handleAuthClick = useCallback(() => {
    if (user) {
      Swal.fire({
        title: 'Logout?',
        text: "Are you sure you want to exit?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#daa520',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Logout'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          setUser(null);
          setPoints(0);
          setEmblemUrl("");
          navigate("/");
        }
      });
    } else {
      setShowLoginModal(true);
    }
    setIsDrawerOpen(false);
  }, [user, setUser, setPoints, navigate]);

  const validatePhoneNumber = useCallback((number) => {
    if (!number) { setPhoneError('Required'); return false; }
    const digits = number.replace(/[^\d]/g, '');
    if (digits.length < 10) { setPhoneError('10 digits min'); return false; }
    setPhoneError(''); return true;
  }, []);

  const loginUser = useCallback(async () => {
    if (!userData.username || !userData.password) { setErrorMessage('Required fields missing'); return; }
    setLoading(true);
    try {
      const response = await axios.post("https://api.codingboss.in/kovais/customer-login/", {
        username: userData.username,
        password: userData.password,
      });
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      localStorage.setItem("currentUserId", JSON.stringify(response.data.user_id));
      if (response.data.emblem_url) localStorage.setItem("url", JSON.stringify(response.data.emblem_url));
      setUser(response.data);
      setPoints(response.data.points || 0);
      setEmblemUrl(response.data.emblem_url || "");
      setShowLoginModal(false);
      Swal.fire({ icon: 'success', title: 'Welcome Back!', timer: 1500, showConfirmButton: false });
    } catch (error) {
      setErrorMessage("Invalid credentials.");
    } finally { setLoading(false); }
  }, [userData.username, userData.password, setUser, setPoints]);

  const signUp = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post("https://api.codingboss.in/kovais/create-customer/", {
        name: userData.username,
        phone_number: userData.phone_number,
        password: userData.password,
      });
      Swal.fire({ icon: "success", title: "Account Created!", text: "Please login." });
      setIsNewUser(false);
    } catch (error) {
      setErrorMessage("Sign-up failed.");
    } finally { setLoading(false); }
  }, [userData.username, userData.phone_number, userData.password]);

  // --- Data - Memoized to prevent re-renders ---
  const bookingItems = useMemo(() => [
    { path: "/search-results", icon: FaHotel, label: "Hotels" },
    { path: "/barber", icon: FaCut, label: "Barber Shop" },
    { path: "/spa", icon: FaSpa, label: "Spa Center" },
    { path: "/parlour", icon: FaPaintBrush, label: "Parlour" },
    { path: "/gym", icon: FaDumbbell, label: "Gym" },
    { path: "/function", icon: FaCut, label: "Function" },
    { path: "/funeral", icon: FaCut, label: "Funeral" }
  ], []);

  const profileItems = useMemo(() => [
    { path: "/profile", icon: ImProfile, label: "My Profile" },
    { path: "/bookedOrders", icon: BsArrowDownRightSquareFill, label: "Orders" },
    { path: "/history", icon: MdWorkHistory, label: "History" }
  ], []);

  const infoItems = useMemo(() => [
    { path: "/contact", icon: FaPhoneAlt, label: "Contact Us" },
    { path: "/policy", icon: FaShieldAlt, label: "Privacy" },
    { path: "/terms", icon: FaFileContract, label: "Terms" },
    { path: "/refund", icon: FaMoneyBillWave, label: "Refunds" }
  ], []);

  return (
    <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
      <Navbar className="modern-navbar">
        <Container className="navbar-container">
          
          {/* Logo Section */}
          <div className="brand-wrapper" onClick={() => handleNavigation("/")} style={{ cursor: 'pointer' }}>
            <div className="logo-container">
              <img src={logo} alt="Kovais Logo" className="brand-logo" />
              <div className="logo-shine"></div>
            </div>
            <span className="brand-name">KOVAIS</span>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-menu d-none d-lg-flex">
            <button className="nav-item-link" onClick={() => handleNavigation("/")}>
              <span className="link-text">Home</span>
              <span className="link-underline"></span>
            </button>
            <button className="nav-item-link" onClick={() => handleNavigation("/about")}>
              <span className="link-text">About</span>
              <span className="link-underline"></span>
            </button>

            {/* Booking Dropdown */}
            <div className="dropdown-wrapper" ref={bookingRef}>
              <button 
                className={`nav-item-link dropdown-trigger ${showDesktopBooking ? 'active' : ''}`}
                onClick={() => { setShowDesktopBooking(!showDesktopBooking); setShowDesktopProfile(false); setShowDesktopInfo(false); }}
              >
                <span className="link-text">Booking</span>
                <FaChevronDown className="dropdown-arrow" />
                <span className="link-underline"></span>
              </button>
              <div className={`mega-dropdown ${showDesktopBooking ? 'show' : ''}`}>
                <div className="dropdown-grid">
                  {bookingItems.map((item, i) => (
                    <button key={i} className="dropdown-card" onClick={() => handleNavigation(item.path)}>
                      <item.icon className="card-icon" />
                      <span className="card-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Dropdown */}
            <div className="dropdown-wrapper" ref={infoRef}>
              <button 
                className={`nav-item-link dropdown-trigger ${showDesktopInfo ? 'active' : ''}`}
                onClick={() => { setShowDesktopInfo(!showDesktopInfo); setShowDesktopBooking(false); setShowDesktopProfile(false); }}
              >
                <span className="link-text">Info</span>
                <FaChevronDown className="dropdown-arrow" />
                <span className="link-underline"></span>
              </button>
              <div className={`mega-dropdown ${showDesktopInfo ? 'show' : ''}`} style={{ minWidth: '220px' }}>
                <div className="dropdown-list">
                  {infoItems.map((item, i) => (
                    <button key={i} className="dropdown-list-item" onClick={() => handleNavigation(item.path)}>
                      <item.icon className="list-icon" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Points & Profile */}
            {user && (
              <>
                <div className="points-link" onClick={() => handleNavigation("/points")} style={{ cursor: 'pointer' }}>
                  <div className="points-badge">
                    <img src={emblemUrl || url} alt="Medal" className="points-icon" />
                    <span className="points-text">{points}</span>
                    <span className="points-label">pts</span>
                  </div>
                </div>

                <div className="dropdown-wrapper" ref={profileRef}>
                  <button 
                    className={`nav-item-link dropdown-trigger ${showDesktopProfile ? 'active' : ''}`}
                    onClick={() => { setShowDesktopProfile(!showDesktopProfile); setShowDesktopBooking(false); setShowDesktopInfo(false); }}
                  >
                    <span className="link-text">Profile</span>
                    <FaChevronDown className="dropdown-arrow" />
                    <span className="link-underline"></span>
                  </button>
                  <div className={`mega-dropdown ${showDesktopProfile ? 'show' : ''}`} style={{ minWidth: '220px' }}>
                    <div className="dropdown-list">
                      {profileItems.map((item, i) => (
                        <button key={i} className="dropdown-list-item" onClick={() => handleNavigation(item.path)}>
                          <item.icon className="list-icon" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button className={`auth-btn ${user ? 'logout' : ''}`} onClick={handleAuthClick}>
              {user ? 'Logout' : 'Login'}
            </button>
          </div>

          {/* Mobile Hamburger - Single button that transforms */}
<button 
  className={`mobile-toggle ${isDrawerOpen ? 'open' : ''}`}
  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
  aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
>
  {isDrawerOpen ? <HiX /> : <HiMenuAlt3 />}
</button>

</Container>
</Navbar>

{/* ─── SIDE DRAWER (MOBILE) - REMOVE the duplicate close button ─── */}
<div className={`drawer-overlay ${isDrawerOpen ? 'show' : ''}`} onClick={() => setIsDrawerOpen(false)}></div>
<div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
  {/* REMOVE THIS ENTIRE LINE - Delete the button with HiX */}
  {/* <button className="mobile-toggle" style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'block' }} onClick={() => setIsDrawerOpen(false)}>
    <HiX />
  </button> */}

  <div className="brand-wrapper mb-5" onClick={() => handleNavigation("/")}>
    <div className="logo-container" style={{ width: '40px', height: '40px' }}>
      <img src={logo} alt="Logo" className="brand-logo" />
    </div>
    <span className="brand-name" style={{ fontSize: '1.4rem' }}>KOVAIS</span>
  </div>

  {/* Rest of your drawer content remains the same */}
  <button className="mobile-dropdown-trigger" onClick={() => handleNavigation("/")}>
    <FaHome className="me-2" /> Home
  </button>
  
  <button className="mobile-dropdown-trigger" onClick={() => handleNavigation("/about")}>
    <FaInfoCircle className="me-2" /> About Us
  </button>

  {/* Mobile Booking */}
  <div className="mobile-dropdown-section">
    <button className={`mobile-dropdown-trigger ${showMobileBooking ? 'active' : ''}`} onClick={() => setShowMobileBooking(!showMobileBooking)}>
      <span><FaHotel className="me-2" /> Booking</span>
      <FaChevronDown className="mobile-arrow" />
    </button>
    <div className={`mobile-dropdown-content ${showMobileBooking ? 'show' : ''}`}>
      {bookingItems.map((item, i) => (
        <button key={i} className="mobile-dropdown-item" onClick={() => handleNavigation(item.path)}>
          <item.icon className="me-2" /> {item.label}
        </button>
      ))}
    </div>
  </div>

  {/* Mobile Info */}
  <div className="mobile-dropdown-section">
    <button className={`mobile-dropdown-trigger ${showMobileInfo ? 'active' : ''}`} onClick={() => setShowMobileInfo(!showMobileInfo)}>
      <span><FaInfoCircle className="me-2" /> Information</span>
      <FaChevronDown className="mobile-arrow" />
    </button>
    <div className={`mobile-dropdown-content ${showMobileInfo ? 'show' : ''}`}>
      {infoItems.map((item, i) => (
        <button key={i} className="mobile-dropdown-item" onClick={() => handleNavigation(item.path)}>
          <item.icon className="me-2" /> {item.label}
        </button>
      ))}
    </div>
  </div>

  {/* Add Profile section if user is logged in */}
  {user && (
    <div className="mobile-dropdown-section">
      <button className={`mobile-dropdown-trigger ${showMobileProfile ? 'active' : ''}`} onClick={() => setShowMobileProfile(!showMobileProfile)}>
        <span><FaUser className="me-2" /> My Account</span>
        <FaChevronDown className="mobile-arrow" />
      </button>
      <div className={`mobile-dropdown-content ${showMobileProfile ? 'show' : ''}`}>
        {profileItems.map((item, i) => (
          <button key={i} className="mobile-dropdown-item" onClick={() => handleNavigation(item.path)}>
            <item.icon className="me-2" /> {item.label}
          </button>
        ))}
      </div>
    </div>
  )}

  <div className="mt-auto">
    {user && (
      <div className="points-badge mb-4" onClick={() => handleNavigation("/points")}>
        <img src={emblemUrl || url} alt="Medal" className="points-icon" />
        <span className="points-text">{points} pts</span>
      </div>
    )}
    <button className={`auth-btn w-100 m-0 ${user ? 'logout' : ''}`} onClick={handleAuthClick}>
      {user ? 'Logout' : 'Login / Register'}
    </button>
  </div>
</div>

      {/* ─── AUTH MODAL ─── */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered className="modern-auth-modal">
        <Modal.Header closeButton className="modal-header-custom p-4">
          <Modal.Title className="modal-title-custom-white w-100 text-center">Welcome to Kovais</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Tabs activeKey={isNewUser ? 'signup' : 'login'} onSelect={(k) => setIsNewUser(k === 'signup')} className="auth-tabs mb-4 nav-fill">
            <Tab eventKey="login" title="Sign In" />
            <Tab eventKey="signup" title="Join Now" />
          </Tabs>

          <Form>
            <Form.Group className="mb-4">
              <InputGroup className="input-group-custom">
                <InputGroup.Text className="bg-transparent border-0"><FaUser color="#daa520"/></InputGroup.Text>
                <Form.Control 
                  className="form-input-custom"
                  type="text" 
                  placeholder="Username" 
                  value={userData.username} 
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })} 
                />
              </InputGroup>
            </Form.Group>

            {isNewUser && (
              <Form.Group className="mb-4">
                <InputGroup className="input-group-custom">
                  <InputGroup.Text className="bg-transparent border-0"><FaPhoneAlt color="#daa520"/></InputGroup.Text>
                  <Form.Control 
                    className="form-input-custom"
                    type="tel" 
                    placeholder="Phone Number" 
                    value={userData.phone_number} 
                    onChange={(e) => {
                      setUserData({ ...userData, phone_number: e.target.value });
                      validatePhoneNumber(e.target.value);
                    }} 
                    isInvalid={!!phoneError}
                  />
                  <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <InputGroup className="input-group-custom">
                <InputGroup.Text className="bg-transparent border-0"><FaLock color="#daa520"/></InputGroup.Text>
                <Form.Control 
                  className="form-input-custom"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={userData.password} 
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                />
                <InputGroup.Text className="bg-transparent border-0 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            {errorMessage && <div className="text-danger small mb-3 text-center">{errorMessage}</div>}

            <Button 
              className="submit-btn w-100" 
              onClick={isNewUser ? signUp : loginUser} 
              disabled={loading || (isNewUser && !!phoneError)}
            >
              {loading ? "Verifying..." : (isNewUser ? "Create Account" : "Secure Login")}
            </Button>
            
            <p className="text-muted small text-center mt-4">
              Experience the pinnacle of luxury grooming and hospitality.
            </p>
          </Form>
        </Modal.Body>
      </Modal>
    </header>
  );
}

export default React.memo(Header);