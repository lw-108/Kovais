import React, { useEffect, useState } from 'react';
import {
  Carousel, Card, Button, Container, Row, Form, Col, Modal,
  InputGroup, Tabs, Tab, Badge, Alert
} from 'react-bootstrap';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook,
  FaDumbbell, FaUsers, FaClock, FaAward, FaTrophy, FaFire, FaPhoneAlt
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import AOS from "aos";
import Swal from 'sweetalert2';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

import "aos/dist/aos.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import "./gym.css";

// Import images
import Gymjpg from "./Img/Gym.jpg";
import men from "./Img/men.jpg";

// Import payment components (adjust path as needed)
// import { PaymentPage, ConfirmationPage } from '../components/Payment';

const Gym = ({ user, setUser, points, setPoints }) => {
  // State declarations
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [amount, setAmount] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [paytype, setPaytype] = useState("");
  const [usedPoints, setUsedPoints] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState('');
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [showDemoConfirmation, setShowDemoConfirmation] = useState(false);
  const [demoPaymentResult, setDemoPaymentResult] = useState(null);
  
  const [userData, setUserData] = useState({
    username: "",
    phone_number: "",
    password: ""
  });

  // Data arrays
  const purchaseddate = [
    { amount: '1', duration: '1 /Month' },
    { amount: '1', duration: '3 /Months' },
    { amount: '1', duration: '6 /Months' },
    { amount: '1', duration: '1 /Year' }
  ];

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM",
  ];

  const gymFeatures = [
    {
      icon: <FaDumbbell className="feature-icon" />,
      title: "Modern Equipment",
      description: "State-of-the-art fitness equipment for all your workout needs"
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Expert Trainers",
      description: "Certified personal trainers to guide your fitness journey"
    },
    {
      icon: <FaClock className="feature-icon" />,
      title: "Flexible Hours",
      description: "Extended operating hours to fit your busy schedule"
    },
    {
      icon: <FaAward className="feature-icon" />,
      title: "Premium Quality",
      description: "Top-notch facilities with attention to hygiene and safety"
    }
  ];

  const successStories = [
    {
      name: "Rajesh Kumar",
      achievement: "Lost 25kg in 6 months",
      image: "https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-young-man-model-dressed-red-checkered-shirt-fashion-man-posing_158538-4909.jpg",
      testimonial: "KOVAIS Gym transformed my life completely. The trainers are amazing!"
    },
    {
      name: "Priya Sharma",
      achievement: "Built muscle & strength",
      image: "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
      testimonial: "Best gym in town! Great equipment and supportive environment."
    },
    {
      name: "Arjun Patel",
      achievement: "Marathon runner now",
      image: "https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-hips_176420-18743.jpg",
      testimonial: "Started from zero fitness level, now I'm running marathons!"
    }
  ];

  // Utility functions
  const isSlotBooked = (slot) => false; // Replace with actual logic
  const isPastSlot = (slot) => {
    if (!selectedDate) return false;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    if (today.getTime() === selectedDay.getTime()) {
      const [time, modifier] = slot.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      const slotDateTime = new Date(
        now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes || 0
      );
      return slotDateTime.getTime() <= now.getTime();
    }
    return false;
  };

  const isProceedEnabled = selectedGender && selectedAge && selectedAmount && selectedTime && plan;

  // Handlers
  const handlePlanClick = (amount, duration) => {
    setSelectedAmount(amount);
    setPlan(duration);
  };

  const handleSelectSlot = (slot) => setSelectedTime(slot);

  const handleScroll = () => {
    const row = document.getElementById("target-section");
    row?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDates = () => {
    const section = document.getElementById("dates");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToOffer = () => {
    const section = document.getElementById("membershipplanssection");
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePayment = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser && selectedTime) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      setShowLoginModal(false);
      setShowDemoPayment(true);
    } else {
      setShowLoginModal(true);
      setShowModal(false);
    }
  };

  const handleDemoPaymentSuccess = (result) => {
    setDemoPaymentResult(result);
    setShowDemoPayment(false);
    setStatus("completed");
    setPaytype("online");
    gymRequest();
    setTimeout(() => setShowDemoConfirmation(true), 500);
  };

  const handleDemoBookNowPayLater = (info) => {
    setStatus("pending");
    setPaytype("offline");
    setShowDemoPayment(false);
    gymRequest();
    setTimeout(() => {
      setDemoPaymentResult({ paymentMethod: "offline", amount: amount || selectedAmount });
      setShowDemoConfirmation(true);
    }, 500);
  };

  const handleUsePoints = (value) => {
    const pointsToUse = parseInt(value);
    setUsedPoints(pointsToUse);
    const totalAmount = selectedAmount ? parseFloat(selectedAmount) : 0;
    if (isNaN(pointsToUse) || pointsToUse <= 0) {
      Swal.fire({ icon: "warning", title: "Invalid Points", text: "Enter a valid number of points." });
      return;
    }
    if (pointsToUse > points) {
      Swal.fire({ icon: "error", title: "Not Enough Points", text: `You only have ${points} points.` });
      return;
    }
    const discountValue = pointsToUse * 0.10;
    if (discountValue > totalAmount) {
      Swal.fire({ icon: "error", title: "Too Many Points Used", text: `You can't use points worth more than your total price (₹${totalAmount}).` });
      return;
    }
    const newPoints = points - pointsToUse;
    const newPrice = totalAmount - discountValue;
    setPoints(newPoints);
    setAmount(newPrice);
    localStorage.setItem("reducedPrice", JSON.stringify(newPrice));
    Swal.fire({
      icon: "success",
      title: "Points Applied",
      html: `<b>${pointsToUse}</b> points used (worth ₹${discountValue.toFixed(2)}).<br/>New total: <b>₹${newPrice.toFixed(2)}</b>`
    });
  };

  const validatePhoneNumber = (number) => {
    if (!number) {
      setPhoneError('Phone number is required.');
      return false;
    }
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(number)) {
      setPhoneError('Only digits and common symbols (-, (,), space) are allowed.');
      return false;
    }
    const digitsOnly = number.replace(/[^\d]/g, '');
    if (digitsOnly.length < 10) {
      setPhoneError('Phone number must be at least 10 digits.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setUserData({ ...userData, phone_number: value });
    if (isNewUser) validatePhoneNumber(value);
  };

  const signUp = async () => {
    if (!userData.username || !userData.phone_number || !userData.password) {
      setErrorMessage('All fields are required');
      return;
    }
    setLoading(true);
    const formattedData = {
      name: userData.username,
      phone_number: userData.phone_number,
      password: userData.password,
    };
    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/create-customer/",
        formattedData,
        { headers: { "Content-Type": "application/json", "Accept": "application/json" } }
      );
      localStorage.setItem("signedUpUser", JSON.stringify(formattedData));
      setErrorMessage('');
      setTimeout(() => {
        setIsNewUser(false);
        setLoading(false);
        Swal.fire({ icon: "success", title: "Account Created!", text: "Please sign in with your new account" });
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Sign-Up Failed";
      setErrorMessage(errorMsg);
      Swal.fire({ icon: "error", title: "Signup Failed", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    if (!userData.username || !userData.password) {
      setErrorMessage('Username and password are required');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/customer-login/",
        { username: userData.username, password: userData.password },
        { headers: { "Content-Type": "application/json", "Accept": "application/json" } }
      );
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      localStorage.setItem("currentUserId", JSON.stringify(response.data.user_id));
      if (response.data.emblem_url || response.data.points) {
        localStorage.setItem("url", JSON.stringify(response.data.emblem_url));
        localStorage.setItem(`points_${response.data.user_id}`, JSON.stringify(response.data.points));
      }
      setUser(response.data);
      setPoints(response.data.points);
      Swal.fire({ icon: "success", title: "Login Successful!", timer: 1500, showConfirmButton: false });
      setTimeout(() => {
        setErrorMessage('');
        setShowLoginModal(false);
        setShowModal(true);
      }, 500);
    } catch (error) {
      const errorMsg = error.response?.data?.login || error.response?.data?.message || "Invalid credentials";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    if (isNewUser) {
      const phoneValid = validatePhoneNumber(userData.phone_number);
      if (phoneValid && userData.username && userData.password) signUp();
    } else {
      loginUser();
    }
  };

  const handleTabSelect = (key) => {
    setIsNewUser(key === 'signup');
    setErrorMessage('');
  };

  const gymRequest = async () => {
    if (!selectedGender || !selectedAge || !selectedAmount || !selectedTime) {
      console.error("Please select all fields before proceeding.");
      return;
    }
    const data = {
      gender: selectedGender,
      age: selectedAge,
      amount: selectedAmount,
      plan: plan,
      payment_status: status,
      payment_type: paytype,
      timeslot: selectedTime,
      purchaseddate: selectedDate,
      status: "booked",
      customer_id: user?.user_id,
      username: user?.username,
      points: usedPoints,
    };
    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/gym/orders/",
        data,
        { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
      );
      localStorage.setItem("gymId", JSON.stringify(response.data.order.id));
      Swal.fire({ title: "Success", icon: "success", draggable: false });
    } catch (error) {
      console.error("Axios Error:", error.response ? error.response.data : error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong!" });
    }
  };

  // Effects
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }, []);

  useEffect(() => {
    if (status && paytype) {
      setTimeout(() => gymRequest(), 500);
    }
  }, [status, paytype]);

  const isButtonDisabled = loading || (isNewUser && !!phoneError);

  return (
    <div className="gym-container">
      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-in">
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <Row className="align-items-center min-vh-50">
            <Col lg={6} className="hero-text" data-aos="fade-right">
              <h1 className="hero-title">
                Transform Your <span className="accent-text">Body</span>
              </h1>
              <p className="hero-description">
                Join KOVAIS Gym and embark on your fitness journey with modern equipment,
                expert trainers, and a supportive community in Gobichettipalayam.
              </p>
              <div className="hero-stats" data-aos="fade-up">
                <Row>
                  <Col xs={4}>
                    <h3 className="stat-number"><FaTrophy /> 500+</h3>
                    <small>Happy Members</small>
                  </Col>
                  <Col xs={4}>
                    <h3 className="stat-number"><FaFire /> 3+</h3>
                    <small>Years Experience</small>
                  </Col>
                  <Col xs={4}>
                    <h3 className="stat-number"><FaAward /> 24/7</h3>
                    <small>Support</small>
                  </Col>
                </Row>
              </div>
              <div className="hero-buttons">
                <Button variant="primary" className="btn-primary-custom" onClick={() => document.getElementById('gender-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Your Journey
                </Button>
                <Button variant="outline-light" onClick={() => document.getElementById('gym-gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Gallery
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-image-col" data-aos="fade-left">
              <img src="https://img.freepik.com/free-photo/young-fitness-man-studio_7502-5008.jpg" alt="Gym Hero" className="hero-image" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section" data-aos="fade-up">
        <Container>
          <div className="section-header">
            <h2>Why Choose <span className="accent-text">KOVAIS Gym?</span></h2>
            <p>Experience fitness like never before with our premium facilities</p>
          </div>
          <Row>
            {gymFeatures.map((feature, index) => (
              <Col md={6} lg={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon-wrapper">{feature.icon}</div>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Offers Section */}
      <section className="offers-section" data-aos="fade-right">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2>Limited Time Offers!</h2>
              <div className="offer-card">
                <Badge bg="warning" className="offer-badge">New Member Special</Badge>
                <h4>Get 1 Month FREE!</h4>
                <p>Join any 6-month or annual plan and get your first month absolutely free.</p>
              </div>
              <div className="offer-card">
                <Badge bg="success" className="offer-badge">Group Discount</Badge>
                <h4>Bring 3 Friends, Save 25%!</h4>
                <p>Special group rates for friends and family joining together.</p>
              </div>
              <Button variant="warning" onClick={scrollToOffer}>Claim Your Offer</Button>
            </Col>
            <Col lg={6} className="text-center">
              <img src="https://static.vecteezy.com/system/resources/previews/023/842/631/non_2x/fitness-center-gym-equipment-retro-posters-vector.jpg" alt="Offer" className="offer-image" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gender Selection */}
      <section id="gender-section" className="selection-section">
        <Container>
          <h2 className="section-title">Select Your <span className="accent-text">Category</span></h2>
          <Row className="selection-row">
            <Col xs={10} sm={6} md={4} lg={3}>
              <Card className={`selection-card ${selectedGender === 'Men' ? 'selected' : ''}`} onClick={() => { setSelectedGender('Men'); handleScroll(); }}>
                <div className="card-image-wrapper"><img src={men} alt="Men" className="selection-image" /></div>
                <Card.Body><Card.Title>Men</Card.Title></Card.Body>
              </Card>
            </Col>
            <Col xs={10} sm={6} md={4} lg={3}>
              <Card className={`selection-card ${selectedGender === 'Women' ? 'selected' : ''}`} onClick={() => { setSelectedGender('Women'); handleScroll(); }}>
                <div className="card-image-wrapper"><img src="https://img.freepik.com/premium-photo/girl-red-shirt-stands-front-window-with-sun-shining-through-window_427757-32950.jpg" alt="Women" className="selection-image" /></div>
                <Card.Body><Card.Title>Women</Card.Title></Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Age Selection */}
      <section className="selection-section bg-light">
        <Container>
          <h2 className="section-title">Select Your <span className="accent-text">Age Group</span></h2>
          <Row className="selection-row">
            <Col xs={10} sm={6} md={4} lg={3}>
              <Card className={`selection-card ${selectedAge === 'Under 18' ? 'selected' : ''}`} onClick={() => { setSelectedAge('Under 18'); handleDates(); }}>
                <div className="card-image-wrapper"><img src="https://img.freepik.com/free-photo/children-sport_23-2148108576.jpg" alt="Under 18" className="selection-image" /></div>
                <Card.Body><Card.Title>Under 18</Card.Title></Card.Body>
              </Card>
            </Col>
            <Col xs={10} sm={6} md={4} lg={3}>
              <Card className={`selection-card ${selectedAge === 'Above 20' ? 'selected' : ''}`} onClick={() => { setSelectedAge('Above 20'); handleDates(); }}>
                <div className="card-image-wrapper"><img src="https://img.freepik.com/free-photo/medium-shot-people-training-with-kettlebells_23-2149307721.jpg" alt="Above 20" className="selection-image" /></div>
                <Card.Body><Card.Title>Above 20</Card.Title></Card.Body>
              </Card>
            </Col>
            <Col xs={10} sm={6} md={4} lg={3}>
              <Card className={`selection-card ${selectedAge === 'Above 30' ? 'selected' : ''}`} onClick={() => { setSelectedAge('Above 30'); handleDates(); }}>
                <div className="card-image-wrapper"><img src="https://img.freepik.com/free-photo/group-happy-people-standing-against-wall-gym_23-2147949689.jpg" alt="Above 30" className="selection-image" /></div>
                <Card.Body><Card.Title>Above 30</Card.Title></Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Date & Time Selection */}
      <section className="schedule-section" id="dates">
        <Container>
          <h2 className="section-title">Choose Your <span className="accent-text">Schedule</span></h2>
          <Row>
            <Col md={6} className="date-picker-col">
              <div className="date-picker-wrapper">
                <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="MMMM d, yyyy" inline minDate={new Date()} />
              </div>
            </Col>
            <Col md={6}>
              <h4 className="time-slots-title">Available Time Slots</h4>
              <Row className="time-slots-grid">
                {timeSlots.map((slot, index) => {
                  const disabled = isSlotBooked(slot) || isPastSlot(slot);
                  return (
                    <Col key={slot} md={4} className="time-slot-col">
                      <Button
                        variant="warning"
                        className={`time-slot ${disabled ? 'booked' : selectedTime === slot ? 'selected' : 'available'}`}
                        onClick={() => handleSelectSlot(slot)}
                        disabled={disabled}
                      >
                        <FaClock className="me-2" />
                        {slot}
                      </Button>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Membership Plans */}
      <section className="plans-section bg-light" id="membershipplanssection">
        <Container>
          <h2 className="section-title">Choose Your <span className="accent-text">Membership Plan</span></h2>
          <Row className="plans-row">
            <Col md={6} lg={3}>
              <Card className={`plan-card ${selectedAmount === '399' ? 'selected' : ''}`} onClick={() => handlePlanClick('399', '1 /Month')}>
                <Card.Body>
                  <FaDumbbell className="plan-icon" />
                  <h5>Monthly Plan</h5>
                  <div className="plan-price">₹399<span>/month</span></div>
                  <ul className="plan-features">
                    <li>✓ Access to all gym facilities</li>
                    <li>✓ Unlimited group classes</li>
                    <li>✓ Locker facility</li>
                    <li>✓ Free Wi-Fi</li>
                  </ul>
                  <Button variant={selectedAmount === '399' ? 'warning' : 'outline-warning'}>{selectedAmount === '399' ? 'Selected' : 'Choose Plan'}</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className={`plan-card ${selectedAmount === '1099' ? 'selected' : ''}`} onClick={() => handlePlanClick('1099', '3 /Months')}>
                <Card.Body>
                  <FaUsers className="plan-icon" />
                  <h5>Quarterly Plan</h5>
                  <div className="plan-price">₹1099<span>/3 months</span></div>
                  <Badge bg="warning" className="save-badge">Save 8%</Badge>
                  <ul className="plan-features">
                    <li>✓ All Monthly benefits</li>
                    <li>✓ 1 Personal training session/month</li>
                    <li>✓ Nutrition consultation</li>
                    <li>✓ Priority booking</li>
                  </ul>
                  <Button variant={selectedAmount === '1099' ? 'warning' : 'outline-warning'}>{selectedAmount === '1099' ? 'Selected' : 'Choose Plan'}</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className={`plan-card ${selectedAmount === '2199' ? 'selected' : ''}`} onClick={() => handlePlanClick('2199', '6 /Months')}>
                <Card.Body>
                  <FaAward className="plan-icon" />
                  <h5>Semi-Annual Plan</h5>
                  <div className="plan-price">₹2199<span>/6 months</span></div>
                  <Badge bg="warning" className="save-badge">Save 15%</Badge>
                  <ul className="plan-features">
                    <li>✓ All Quarterly benefits</li>
                    <li>✓ 2 Personal training sessions/month</li>
                    <li>✓ Guest pass (2/month)</li>
                    <li>✓ Free workout gear</li>
                  </ul>
                  <Button variant={selectedAmount === '2199' ? 'warning' : 'outline-warning'}>{selectedAmount === '2199' ? 'Selected' : 'Choose Plan'}</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className={`plan-card best-value ${selectedAmount === '4099' ? 'selected' : ''}`} onClick={() => handlePlanClick('4099', '1 /Year')}>
                <div className="best-value-badge">BEST VALUE</div>
                <Card.Body>
                  <FaTrophy className="plan-icon" />
                  <h5>Annual Plan</h5>
                  <div className="plan-price">₹4099<span>/year</span></div>
                  <Badge bg="dark" className="save-badge">Save 25%</Badge>
                  <ul className="plan-features">
                    <li>✓ All Semi-Annual benefits</li>
                    <li>✓ Unlimited personal training</li>
                    <li>✓ Diet plan included</li>
                    <li>✓ VIP member privileges</li>
                    <li>✓ Free supplement consultation</li>
                  </ul>
                  <Button variant={selectedAmount === '4099' ? 'dark' : 'outline-danger'}>{selectedAmount === '4099' ? 'Selected' : 'Choose Plan'}</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Success Stories */}
      <section className="stories-section" id="gym-gallery">
        <Container>
          <div className="section-header">
            <h2>Success <span className="accent-text">Stories</span></h2>
            <p>Real transformations from our amazing members</p>
          </div>
          <Row>
            {successStories.map((story, index) => (
              <Col md={4} key={index} data-aos="fade-up" data-aos-delay={index * 200}>
                <Card className="story-card">
                  <Card.Img variant="top" src={story.image} className="story-image" />
                  <Card.Body>
                    <Card.Title>{story.name}</Card.Title>
                    <Badge bg="success">{story.achievement}</Badge>
                    <Card.Text>"{story.testimonial}"</Card.Text>
                    <div className="rating">★★★★★</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <h2>Ready to Transform Your Life?</h2>
          <p>Join hundreds of satisfied members who have achieved their fitness goals at KOVAIS Gym.</p>
          <Button variant="light" className="cta-button" disabled={!isProceedEnabled} onClick={() => handlePayment()}>
            <FaDumbbell className="me-2" />
            {isProceedEnabled ? 'Proceed to Join' : 'Complete Selection Above'}
          </Button>
        </Container>
      </section>

      <ToastContainer position="top-center" autoClose={3000} />

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered className="auth-modal">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">Welcome</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={isNewUser ? 'signup' : 'login'} onSelect={handleTabSelect} className="mb-4 nav-fill">
            <Tab eventKey="login" title="Login" />
            <Tab eventKey="signup" title="Sign Up" />
          </Tabs>
          <Form>
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text><FaUser /></InputGroup.Text>
                <Form.Control type="text" value={userData.username || ""} onChange={(e) => setUserData({ ...userData, username: e.target.value })} placeholder="Username" />
              </InputGroup>
            </Form.Group>
            {isNewUser && (
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text><FaPhoneAlt /></InputGroup.Text>
                  <Form.Control type="tel" value={userData.phone_number || ""} onChange={handlePhoneNumberChange} placeholder="Phone Number" isInvalid={!!phoneError} />
                  <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text><FaLock /></InputGroup.Text>
                <Form.Control type={showPassword ? "text" : "password"} value={userData.password || ""} onChange={(e) => setUserData({ ...userData, password: e.target.value })} placeholder="Password" />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            {errorMessage && <Alert variant="danger" className="py-2">{errorMessage}</Alert>}
            <Button variant="primary" onClick={handleSignUpClick} disabled={isButtonDisabled} className="w-100 py-2">
              {loading ? (isNewUser ? "Creating Account..." : "Logging in...") : (isNewUser ? "Create Account" : "Login")}
            </Button>
            <p className="text-muted text-center small mt-4">
              By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <iframe src="https://www.google.com/maps?q=097,+SH+15,+Otthakkuthirai,+Gobichettipalayam,+Tamil+Nadu+638455,+India&output=embed" className="footer-map" title="Gym Location" />
          <div className="footer-info">
            <h5><FaDumbbell className="me-2" />KOVAIS GYM</h5>
            <p>097, SH 15, Otthakkuthirai gobichettipalayam Tk, DT, Gobichettipalayam, Tamil Nadu 638455</p>
          </div>
          <hr />
          <p className="copyright">&copy; 2024 KOVAIS. All Rights Reserved. | Contact: <a href="tel:9234567891">9234567891</a> | Email: <a href="mailto:info@kovaisbeauty.com">info@kovaisbeauty.com</a></p>
        </Container>
      </footer>
    </div>
  );
};

export default Gym;