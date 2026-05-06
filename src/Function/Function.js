import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Modal, Button, Tab, Tabs, Form, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaDumbbell, FaUsers, FaClock, FaAward, FaTrophy, FaFire, FaPhoneAlt } from 'react-icons/fa';
import Swal from "sweetalert2";
import axios from "axios";
import {
  Menu, X, Scissors, ChevronLeft, ChevronRight, Star, Clock, Award,
  User, Sparkles, DollarSign, Users, Calendar, Phone, Mail, CreditCard,
  Check, MapPin, Instagram, Facebook, Twitter, Home, Calendar as CalendarIcon, CheckCircle
} from "lucide-react";
import "./Function.css";
import { PaymentPage, ConfirmationPage } from '../components/Payment';
import { FaScissors } from "react-icons/fa6";
import { useInView } from 'react-intersection-observer';

// Lazy Image Component
const LazyImage = ({ src, alt, className, style, ...props }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px 0px',
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (inView) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
    }
  }, [inView, src]);

  return (
    <div ref={ref} className="lazy-image-wrapper">
      {inView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`lazy-image ${className || ''} ${isLoaded ? 'image-loaded' : 'image-loading'}`}
          style={style}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
      {!isLoaded && inView && <div className="image-skeleton" style={style} />}
    </div>
  );
};

const SingleBarberPage = ({ user, setUser, points, setPoints, setAadhar }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Booking State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [usedPoints, setUsedPoints] = useState();
  const [paytype, setPaytype] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [showDemoConfirmation, setShowDemoConfirmation] = useState(false);
  const [demoPaymentResult, setDemoPaymentResult] = useState(null);
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState("");
  
  const [userData, setUserData] = useState({
    username: "",
    phone_number: "",
    password: ""
  });

  const [booking, setBooking] = useState({
    services: [],
    location: 'Door Step',
    employee: null,
    date: '',
    time: null,
    customerInfo: {
      name: '',
      phone: '',
      email: '',
      notes: ''
    }
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  // Hero Slides Data
  const slides = [
    {
      title: "Function Grooming",
      subtitle: "Making Every Event Memorable",
      description: "Experience the finest grooming services for your special occasions. Our expert stylists deliver perfection for weddings, parties, and corporate events.",
      image: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg",
    },
    {
      title: "Event Styling Experts",
      subtitle: "Perfection for Your Special Day",
      description: "Every event deserves perfect grooming. Our skilled stylists combine creativity with precision to ensure you look your best for every occasion.",
      image: "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg",
    },
    {
      title: "Luxury Event Grooming",
      subtitle: "Where Style Meets Celebration",
      description: "Step into the spotlight with confidence. Transform your look for any event with our premium grooming services tailored for special moments.",
      image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg",
    },
  ];

  // Services Data
  const services = [
    {
      id: 'f1',
      category: 'Function',
      name: 'Function Services',
      description: 'Complete grooming package for weddings, parties, and special events',
      price: 500,
      image: 'https://images.pexels.com/photos/13918932/pexels-photo-13918932.jpeg',
      duration: '60-90 min'
    },
  ];

  const employees = [
    {
      id: 'emp4',
      name: 'Isabella',
      speciality: 'Event & Function Specialist',
      rating: 4.9,
      image: '',
      categories: ['Function']
    },
    {
      id: 'emp5',
      name: 'Sophia',
      speciality: 'Bridal Stylist',
      rating: 4.8,
      image: '',
      categories: ['Function']
    }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM',
  ];

  const stats = [
    { icon: Star, value: "4.9", label: "Rating" },
    { icon: Clock, value: "25+", label: "Years" },
    { icon: Award, value: "500+", label: "Happy Clients" },
  ];

  const stepConfig = [
    { number: 1, title: 'Select Service', icon: Scissors },
    { number: 2, title: 'Choose Specialist', icon: Star },
    { number: 3, title: 'Date & Time', icon: CalendarIcon },
    { number: 4, title: 'Your Details', icon: Phone },
    { number: 5, title: 'Confirmation', icon: CheckCircle }
  ];

  // Effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  useEffect(() => {
    setAmount(calculateTotal());
  }, [booking.services]);

  useEffect(() => {
    if (status && paytype) {
      setTimeout(() => {
        paytype === "offline" ? handleFreeService() : handlePayupi();
      }, 500);
    }
  }, [status, paytype]);

  // Helper Functions
  const calculateTotal = () => {
    const serviceTotal = booking.services.reduce((sum, service) => sum + service.price, 0);
    return booking.location === 'Door Step' ? serviceTotal + 250 : serviceTotal;
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0: return booking.services.length > 0;
      case 1: return booking.employee !== null;
      case 2: return booking.date !== '' && booking.time !== null;
      case 3:
        const isPhoneValid = booking.customerInfo.phone && /^[\d\s\-\(\)]+$/.test(booking.customerInfo.phone) && booking.customerInfo.phone.replace(/[^\d]/g, '').length >= 10;
        const isEmailValid = booking.customerInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customerInfo.email);
        const isAddressValid = booking.location === 'Door Step' ? !!address : true;
        return booking.customerInfo.name && isPhoneValid && isEmailValid && isAddressValid;
      default: return true;
    }
  };

  const isTimeSlotPassed = (timeSlot, selectedDate) => {
    if (!selectedDate) return false;
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    if (!isToday) return false;
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;
    const slotTime = new Date();
    slotTime.setHours(hour24, minutes, 0, 0);
    return slotTime <= today;
  };

  const handleServiceSelect = (service) => {
    if (!selectedCategory) setSelectedCategory(service.category);
    const isSelected = booking.services.some(s => s.id === service.id);
    setBooking(prev => ({
      ...prev,
      services: isSelected ? prev.services.filter(s => s.id !== service.id) : [...prev.services, service]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setShowErrors(false);
      // Skip Step 3 (Details) if user is logged in
      if (currentStep === 2 && user) {
        setCurrentStep(4);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setShowErrors(false);
      // Skip back from Confirmation to Date/Time if user is logged in
      if (currentStep === 4 && user) {
        setCurrentStep(2);
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  const handlePayment = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    const user = JSON.parse(loggedInUser);
    setUser(user);
    setShowDemoPayment(true);
  };

  const handleDemoPaymentSuccess = (result) => {
    setDemoPaymentResult(result);
    setShowDemoPayment(false);
    setStatus("completed");
    setPaytype("online");
    if (result.address) setAddress(result.address);
    functionOrder(result.address);
    setTimeout(() => setShowDemoConfirmation(true), 500);
  };

  const handleDemoPaymentFailure = (error) => {
    console.log("Payment failed:", error);
  };

  const handleDemoBookNowPayLater = (info) => {
    setStatus("pending");
    setPaytype("offline");
    setShowDemoPayment(false);
    if (info.address) setAddress(info.address);
    functionOrder(info.address);
    setTimeout(() => {
      setDemoPaymentResult({ paymentMethod: "offline", amount: amount });
      setShowDemoConfirmation(true);
    }, 500);
  };

  const handleFreeService = () => {
    setShowModal(false);
    functionOrder();
  };

  const handlePayupi = () => {
    setShowModal(false);
    functionOrder();
    setTimeout(() => createPayment(), 3000);
  };

  const functionOrder = async (overrideAddress) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const finalAddress = overrideAddress || address;

    const data = {
      order_type: booking.location,
      category: selectedCategory,
      services: booking.services.map(service => service.name).join(", "),
      amount: amount,
      date: formattedDate,
      time: booking.time,
      payment_status: status,
      payment_type: paytype,
      customer_id: user.user_id,
      status: "booked",
      points: usedPoints,
      branch: "",
      phone: booking.customerInfo.phone,
      address: finalAddress,
      latitude: location ? location.lat : null,
      longitude: location ? location.lng : null
    };

    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/saloon/orders/",
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      localStorage.setItem("functionId", String(response.data.order.id));
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong!" });
    }
  };

  const createPayment = async () => {
    const url = 'https://api.codingboss.in/kovais/payment/create/';
    const orderId = localStorage.getItem('functionId');
    const payload = {
      amount: amount,
      order_type: 'saloon',
      order_id: orderId,
      gateway: 'cashfree',
      fcm_token: 'de985ad4e255a320cda6c55cf79809b4a2c2e7d3',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      localStorage.setItem('payment_db_id', String(data.payment_db_id));
      localStorage.setItem('order_id', String(data.order_id));
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = data.upi_link;
      }
      await verifyPayment();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const verifyPayment = async () => {
    const url = "https://api.codingboss.in/kovais/payment/verify/";
    const payment_id = localStorage.getItem("payment_db_id");
    const order_id = localStorage.getItem("order_id");
    const payload = {
      gateway: "cashfree",
      order_id: order_id,
      payment_id: String(payment_id),
      signature: null,
      fcm_token: 'de985ad4e255a320cda6c55cf79809b4a2c2e7d3'
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const status = (data.status || "").toUpperCase().trim();
      if (["FAILED", "FAILURE", "ERROR", "DECLINED"].includes(status)) {
        console.warn("Payment Failed.");
      } else if (["PENDING", "PROCESSING", "AWAITED"].includes(status)) {
        pollVerify();
      }
      return data;
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const pollVerify = (interval = 10000) => {
    const check = async () => {
      const result = await verifyPayment();
      if (result && (result.status === "PAID" || result.status === "FAILED")) return;
      setTimeout(check, interval);
    };
    check();
  };

  const loginUser = async () => {
    if (!userData.username || !userData.password) {
      setErrorMessage('Username and password are required');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/customer-login/",
        { username: userData.username, password: userData.password },
        { headers: { "Content-Type": "application/json", "Accept": "application/json" } }
      );
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      localStorage.setItem("currentUserId", JSON.stringify(response.data.user_id));
      setUser(response.data);
      setPoints(response.data.points);
      Swal.fire({ icon: "success", title: "Login Successful!", timer: 1500, showConfirmButton: false });
      setTimeout(() => {
        setErrorMessage('');
        setShowLoginModal(false);
      }, 500);
    } catch (error) {
      const errorMsg = error.response?.data?.login || error.response?.data?.message || "Invalid credentials.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    if (!userData.username || (isNewUser && !userData.phone_number) || !userData.password) {
      setErrorMessage('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "https://api.codingboss.in/kovais/create-customer/",
        { name: userData.username, phone_number: userData.phone_number, password: userData.password },
        { headers: { "Content-Type": "application/json", "Accept": "application/json" } }
      );
      localStorage.setItem("signedUpUser", JSON.stringify(userData));
      Swal.fire({ icon: "success", title: "Account Created!", text: "Please sign in with your new account" });
      setIsNewUser(false);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Sign-Up Failed.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = (number) => {
    if (!number) { setPhoneError('Phone number is required.'); return false; }
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(number)) { setPhoneError('Only digits and common symbols allowed.'); return false; }
    const digitsOnly = number.replace(/[^\d]/g, '');
    if (digitsOnly.length < 10) { setPhoneError('Phone number must be at least 10 digits.'); return false; }
    setPhoneError('');
    return true;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setUserData({ ...userData, phone_number: value });
    if (isNewUser) validatePhoneNumber(value);
  };

  const handleSignUpClick = () => {
    if (isNewUser && validatePhoneNumber(userData.phone_number) && userData.username && userData.password) {
      signUp();
    }
  };

  const handleTabSelect = (key) => {
    setIsNewUser(key === 'signup');
    setErrorMessage('');
  };

  const isButtonDisabled = loading || (isNewUser && !!phoneError);

  // Rendering helpers
  const filteredServices = selectedCategory 
    ? services.filter(service => service.category === selectedCategory) 
    : services;

  const availableEmployees = selectedCategory 
    ? employees.filter(emp => emp.categories.includes(selectedCategory)) 
    : employees;

  return (
    <motion.div
      className="function-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="hero-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LazyImage
              src={slides[currentSlide].image}
              alt="Hero background"
              className="hero-bg-image"
            />
            <div className="hero-overlay" />
          </motion.div>
        </AnimatePresence>

        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="hero-subtitle">{slides[currentSlide].subtitle}</p>
            <h1 className="hero-title">{slides[currentSlide].title}</h1>
            <p className="hero-description">{slides[currentSlide].description}</p>
            
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Book Service
              </button>
              <button className="btn-outline" onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}>
                View Services
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={stat.label} className="stat-item">
                  <stat.icon className="stat-icon" />
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hero-slider-controls">
            <button className="slider-btn" onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}>
              <ChevronLeft size={20} />
            </button>
            <div className="slider-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'dot-active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <button className="slider-btn" onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="services-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Our Function Services</h2>
            <p className="section-subtitle">Professional grooming for your special occasions</p>
          </motion.div>

          {/* Service Type */}
          <div className="service-type-selector">
            <div 
              className={`type-card ${booking.location === 'Salon' ? 'selected' : ''}`}
              onClick={() => setBooking(prev => ({ ...prev, location: 'Salon' }))}
              style={{ cursor: 'pointer' }}
            >
              <Users className="type-icon" />
              <h4>At Salon</h4>
              <p>Visit our premium outlet for your session</p>
              <span className="type-charge">No Service Charge</span>
              <span className="type-badge">Standard</span>
            </div>
            
            <div 
              className={`type-card ${booking.location === 'Door Step' ? 'selected' : ''}`}
              onClick={() => setBooking(prev => ({ ...prev, location: 'Door Step' }))}
              style={{ cursor: 'pointer' }}
            >
              <Home className="type-icon" />
              <h4>Doorstep Service</h4>
              <p>Professional event grooming at your venue</p>
              <span className="type-charge">+ ₹250 Service Charge</span>
              <span className="type-badge">Premium</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {['Function'].map((category) => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  if (booking.services.length === 0) {
                    setSelectedCategory(category === selectedCategory ? null : category);
                  }
                  document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                disabled={booking.services.length > 0 && selectedCategory !== category}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <motion.div 
            id="services-grid" 
            className="services-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                className={`service-card ${booking.services.some(s => s.id === service.id) ? 'selected' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                whileHover={{ y: -10 }}
              >
                <div className="service-image">
                  <LazyImage src={service.image} alt={service.name} className="service-img" />
                  <span className="duration-badge">{service.duration}</span>
                </div>
                <div className="service-info">
                  <h5 className="service-name">{service.name}</h5>
                  <p className="service-description">{service.description}</p>
                  <div className="service-footer">
                    <span className="service-price">₹ {service.price}</span>
                    <button
                      className={`select-btn ${booking.services.some(s => s.id === service.id) ? 'selected' : ''}`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      {booking.services.some(s => s.id === service.id) ? 'Selected ✓' : 'Select'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="booking-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Book Your Service</h2>
            <p className="section-subtitle">Simple 5-step booking process</p>
          </motion.div>

          <div className="booking-card">
            {/* Progress Steps */}
            <div className="progress-steps">
              {stepConfig.map((step, index) => {
                // If logged in, don't show the "Your Details" step in the progress bar
                if (user && index === 3) return null;
                
                const isActive = currentStep >= index;
                const isCurrent = currentStep === index;
                
                // Adjust step numbering for display if logged in
                const displayStepNumber = (user && index > 3) ? index : index + 1;
                
                return (
                  <div key={step.number} className={`step-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="step-circle">
                      <step.icon size={18} />
                    </div>
                    <div className="step-info">
                      <span className="step-number">Step {displayStepNumber}</span>
                      <span className="step-title">{step.title}</span>
                    </div>
                    {index < stepConfig.length - 1 && !(user && index === 2) && (
                      <div className={`step-line ${index < currentStep ? 'filled' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="step-content">
              <AnimatePresence mode="wait">
                {/* Step 0: Services */}
                {currentStep === 0 && (
                  <motion.div key="step0" className="step-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-heading">Selected Services</h3>
                    {booking.services.length === 0 ? (
                      <div className="empty-state">
                        <Scissors size={48} />
                        <p>No services selected. Please select from above.</p>
                      </div>
                    ) : (
                      <div className="selected-services">
                        {booking.services.map(service => (
                          <div key={service.id} className="selected-service-item">
                            <div>{service.name}</div>
                            <div className="price">₹ {service.price}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="step-actions">
                      <button className="btn-primary" onClick={nextStep} disabled={booking.services.length === 0}>
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Specialist */}
                {currentStep === 1 && (
                  <motion.div key="step1" className="step-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-heading">Choose Specialist</h3>
                    <motion.div 
                      className="specialist-grid"
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {availableEmployees.map(employee => (
                        <motion.div
                          key={employee.id}
                          className={`specialist-card ${booking.employee?.id === employee.id ? 'selected' : ''}`}
                          onClick={() => setBooking(prev => ({ ...prev, employee }))}
                          variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            show: { opacity: 1, scale: 1 }
                          }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="specialist-avatar">
                            <User size={32} />
                          </div>
                          <div className="specialist-info">
                            <h5>{employee.name}</h5>
                            <p>{employee.speciality}</p>
                            <div className="rating">
                              <Star size={14} fill="#FFD700" color="#FFD700" />
                              <span>{employee.rating}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    <div className="step-actions">
                      <button className="btn-outline" onClick={prevStep}>Previous</button>
                      <button className="btn-primary" onClick={nextStep} disabled={!booking.employee}>Continue</button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Date & Time */}
                {currentStep === 2 && (
                  <motion.div key="step2" className="step-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-heading">Select Date & Time</h3>
                    <div className="datetime-grid">
                      <div className="date-picker">
                        <label>Date</label>
                        <input
                          type="date"
                          value={booking.date}
                          onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value, time: null }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="time-picker">
                        <label>Available Times</label>
                        <div className="time-slots">
                          {timeSlots.map(time => {
                            const isPassed = isTimeSlotPassed(time, booking.date ? new Date(booking.date) : null);
                            const isSelected = booking.time === time;
                            return (
                              <button
                                key={time}
                                className={`time-slot ${isSelected ? 'selected' : ''}`}
                                onClick={() => setBooking(prev => ({ ...prev, time }))}
                                disabled={isPassed}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="step-actions">
                      <button className="btn-outline" onClick={prevStep}>Previous</button>
                      <button className="btn-primary" onClick={nextStep} disabled={!booking.date || !booking.time}>Continue</button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Customer Details */}
                {currentStep === 3 && (
                  <motion.div key="step3" className="step-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-heading">Your Details</h3>
                    <div className="customer-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            value={booking.customerInfo.name}
                            onChange={(e) => setBooking(prev => ({ ...prev, customerInfo: { ...prev.customerInfo, name: e.target.value } }))}
                            className={showErrors && !booking.customerInfo.name ? 'error' : ''}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone *</label>
                          <input
                            type="tel"
                            value={booking.customerInfo.phone}
                            onChange={(e) => setBooking(prev => ({ ...prev, customerInfo: { ...prev.customerInfo, phone: e.target.value } }))}
                            className={showErrors && (!booking.customerInfo.phone || booking.customerInfo.phone.replace(/[^\d]/g, '').length < 10) ? 'error' : ''}
                          />
                        </div>
                        <div className="form-group full-width">
                          <label>Email *</label>
                          <input
                            type="email"
                            value={booking.customerInfo.email}
                            onChange={(e) => setBooking(prev => ({ ...prev, customerInfo: { ...prev.customerInfo, email: e.target.value } }))}
                            className={showErrors && (!booking.customerInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customerInfo.email)) ? 'error' : ''}
                          />
                        </div>
                        {booking.location === 'Door Step' && (
                          <div className="form-group full-width">
                            <label>Doorstep Address *</label>
                            <textarea
                              rows="2"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Enter your full address for doorstep service..."
                              className={showErrors && !address ? 'error' : ''}
                            />
                          </div>
                        )}
                        <div className="form-group full-width">
                          <label>Event Details (Optional)</label>
                          <textarea
                            rows="3"
                            value={booking.customerInfo.notes}
                            onChange={(e) => setBooking(prev => ({ ...prev, customerInfo: { ...prev.customerInfo, notes: e.target.value } }))}
                            placeholder="Tell us about your event..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="step-actions">
                      <button className="btn-outline" onClick={prevStep}>Previous</button>
                      <button
                        className="btn-primary"
                        onClick={() => {
                          if (isStepValid(3)) { setShowErrors(false); nextStep(); }
                          else { setShowErrors(true); }
                        }}
                      >
                        Review Booking
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <motion.div key="step4" className="step-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="step-heading">Booking Summary</h3>
                    <div className="booking-summary">
                      <div className="summary-section">
                        <h4>Services</h4>
                        {booking.services.map(service => (
                          <div key={service.id} className="summary-row">
                            <span>{service.name}</span>
                            <span>₹ {service.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="summary-section">
                        <h4>Details</h4>
                        <div className="summary-row"><span>Date</span><span>{booking.date}</span></div>
                        <div className="summary-row"><span>Time</span><span>{booking.time}</span></div>
                        <div className="summary-row"><span>Specialist</span><span>{booking.employee?.name}</span></div>
                        <div className="summary-row"><span>Service Type</span><span>Doorstep</span></div>
                      </div>
                      <div className="summary-total">
                        <span>Total Amount</span>
                        <span className="total-price">₹ {calculateTotal()}</span>
                      </div>
                    </div>
                    <div className="step-actions">
                      <button className="btn-outline" onClick={prevStep}>Previous</button>
                      <button className="btn-primary" onClick={handlePayment}>Confirm Booking</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h5><FaScissors className="me-2" />KOVAIS BEAUTY PARLOUR</h5>
              <p>097, SH 15, Otthakkuthirai, Gobichettipalayam, Tamil Nadu 638455</p>
              <div className="footer-links">
                <a href="tel:9234567891">9234567891</a>
                <span className="separator">|</span>
                <a href="mailto:info@kovaisbeauty.com">info@kovaisbeauty.com</a>
              </div>
            </Col>
          </Row>
          <hr />
          <p className="text-center copyright">© 2024 KOVAIS. All Rights Reserved.</p>
        </Container>
      </footer>

      {/* Payment Modal */}
      <PaymentPage
        show={showDemoPayment}
        onHide={() => setShowDemoPayment(false)}
        bookingSummary={{
          services: booking.services,
          date: booking.date,
          time: booking.time,
          amount: amount,
          location: booking.location,
          specialist: booking.employee?.name,
        }}
        onPaymentSuccess={handleDemoPaymentSuccess}
        onPaymentFailure={handleDemoPaymentFailure}
        onBookNowPayLater={handleDemoBookNowPayLater}
        points={points}
        onUsePoints={(pts, discount) => {
          setUsedPoints(pts);
          setPoints(prev => prev - pts);
          setAmount(prev => Math.max(0, prev - discount));
        }}
        showAddressInput={booking.location === 'Door Step' && !address}
      />

      <ConfirmationPage
        show={showDemoConfirmation}
        onHide={() => setShowDemoConfirmation(false)}
        transactionId={demoPaymentResult?.transactionId}
        amount={demoPaymentResult?.amount || amount}
        paymentMethod={demoPaymentResult?.paymentMethod}
        bookingSummary={{
          services: booking.services,
          date: booking.date,
          time: booking.time,
          specialist: booking.employee?.name,
        }}
        onDone={() => setShowDemoConfirmation(false)}
      />

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={isNewUser ? 'signup' : 'login'} onSelect={handleTabSelect} className="mb-3">
            <Tab eventKey="login" title="Login" />
            <Tab eventKey="signup" title="Sign Up" />
          </Tabs>
          <Form>
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text><FaUser /></InputGroup.Text>
                <Form.Control
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  placeholder="Username"
                />
              </InputGroup>
            </Form.Group>
            {isNewUser && (
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text><FaPhoneAlt /></InputGroup.Text>
                  <Form.Control
                    type="tel"
                    value={userData.phone_number}
                    onChange={handlePhoneNumberChange}
                    placeholder="Phone Number"
                    isInvalid={!!phoneError}
                  />
                  <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text><FaLock /></InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="Password"
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
            <Button
              variant="danger"
              className="w-100"
              onClick={isNewUser ? handleSignUpClick : loginUser}
              disabled={isButtonDisabled}
            >
              {loading ? 'Please wait...' : isNewUser ? 'Create Account' : 'Login'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default SingleBarberPage;