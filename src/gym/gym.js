import React, { useEffect, useState } from 'react';
import { Carousel, Card, Button, Container, Row, Form, Col, Modal, InputGroup, Tabs, Tab, Badge } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaDumbbell, FaUsers, FaClock, FaAward, FaTrophy, FaFire, FaPhoneAlt } from 'react-icons/fa';
import './gym.css';
import { PaymentPage, ConfirmationPage } from '../components/Payment';
import Swal from 'sweetalert2'
import axios from 'axios';
import DatePicker from 'react-datepicker'
import moment from 'react-moment';
import AOS from "aos";
import "aos/dist/aos.css";
import Gymjpg from "./Img/Gym.jpg"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import men from "./Img/men.jpg"

const Gym = ({ user, setUser, points, setPoints }) => {
  const [selectedGender, setSelectedGender] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [amount, setAmount] = useState(0)
  const [selectedTime, setSelectedTime] = useState("")
  const [bookedSlots, setBookedSlots] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false);
  const [bookedStatus, setBookedStatus] = useState("booked")
  const [paytype, setPaytype] = useState("")
  const [usedPoints, setUsedPoints] = useState()
  const [value, setValue] = useState()
  const [plan, setPlan] = useState("")
  const [status, setStatus] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [gymId, setGymId] = useState(null);
  const [paymentData, setPaymentData] = useState({});
  const [phoneError, setPhoneError] = useState('');
  const [userData, setUserData] = useState({
    username: "",
    phone_number: "",
    password: ""
  });
  const [verifyData, setVerifyData] = useState({});
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [showDemoConfirmation, setShowDemoConfirmation] = useState(false);
  const [demoPaymentResult, setDemoPaymentResult] = useState(null);

  const purchaseddate = [
    { amount: '1', duration: '1 /Month' },
    { amount: '1', duration: '3 /Months' },
    { amount: '1', duration: '6 /Months' },
    { amount: '1', duration: '1 /Year' }
  ]

  // Gym features data
  const gymFeatures = [
    {
      icon: <FaDumbbell className="text-warning" size={40} />,
      title: "Modern Equipment",
      description: "State-of-the-art fitness equipment for all your workout needs"
    },
    {
      icon: <FaUsers className="text-warning" size={40} />,
      title: "Expert Trainers",
      description: "Certified personal trainers to guide your fitness journey"
    },
    {
      icon: <FaClock className="text-warning" size={40} />,
      title: "Flexible Hours",
      description: "Extended operating hours to fit your busy schedule"
    },
    {
      icon: <FaAward className="text-warning" size={40} />,
      title: "Premium Quality",
      description: "Top-notch facilities with attention to hygiene and safety"
    }
  ];

  // Success stories data
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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const handlePlanClick = (amount, duration) => {
    setSelectedAmount(amount);
    setPlan(duration);
  };

  const isProceedEnabled = selectedGender && selectedAge && selectedAmount && selectedTime && plan;

  // Example time slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  // Dummy function: booked slots
  const isSlotBooked = (slot) => {
    const bookedSlots = [""]; // Example booked slot
    return bookedSlots.includes(slot);
  };

  const isPastSlot = (slot) => {
    if (!selectedDate) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    // ✅ Only check time if the selected date IS today
    if (today.getTime() === selectedDay.getTime()) {
      const [time, modifier] = slot.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotDateTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes || 0
      );

      return slotDateTime.getTime() <= now.getTime();
    }

    // ✅ For future dates → always return false
    return false;
  };


  const handleSelectSlot = (slot) => {
    setSelectedTime(slot);
  };

  const handlePlan = () => {
    // // // // // // // // console.log("Plan selected with:", selectedDate, selectedTime);
  };

  const handleShowModal = () => {
    setShowModal(true)
  };
  const handleCloseModal = () => setShowModal(false);

  const handleScroll = () => {
    const Row = document.getElementById("target-section");
    Row.scrollIntoView({ behavior: "smooth" });
  }

  const handlePayment = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser && selectedTime) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
      setShowLoginModal(false);
      setShowDemoPayment(true);
    } else {
      setShowLoginModal(true);
      setShowModal(false);
    }
  }

  const handleDemoPaymentSuccess = (result) => {
    setDemoPaymentResult(result);
    setShowDemoPayment(false);
    setStatus("completed");
    setPaytype("online");
    gymRequest();
    setTimeout(() => setShowDemoConfirmation(true), 500);
  };

  const handleDemoPaymentFailure = (error) => {
    console.log("Payment failed:", error);
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
      Swal.fire({
        icon: "warning",
        title: "Invalid Points",
        text: "Enter a valid number of points.",
        confirmButtonColor: "#3B82F6"
      });
      return;
    }

    if (pointsToUse > points) {
      Swal.fire({
        icon: "error",
        title: "Not Enough Points",
        text: `You only have ${points} points.`,
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    // 💰 Each point = ₹0.10
    const discountValue = pointsToUse * 0.10;

    if (discountValue > totalAmount) {
      Swal.fire({
        icon: "error",
        title: "Too Many Points Used",
        text: `You can't use points worth more than your total price (₹${totalAmount}).`,
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    const newPoints = points - pointsToUse;
    const newPrice = totalAmount - discountValue;

    setPoints(newPoints);
    setAmount(newPrice);
    localStorage.setItem("reducedPrice", JSON.stringify(newPrice));

    Swal.fire({
      icon: "success",
      title: "Points Applied ",
      html: `
      <b>${pointsToUse}</b> points used (worth ₹${discountValue.toFixed(2)}).<br/>
      New total: <b>₹${newPrice.toFixed(2)}</b><br/>
      Remaining points: <b>${newPoints}</b>
    `,
      confirmButtonColor: "#10B981"
    });

    setValue("");
  };

  const handlePayupi = () => {
    handleCloseModal();
    gymRequest()
    setTimeout(() => {
      createPayment()
    }, 3000)

  }

  useEffect(() => {
    if (status && paytype) {
      setTimeout(() => {
        if (paytype === "offline") {
          handleFreeService();
        } else if (paytype === "online") {
          handlePayupi();
        }
      }, 500);
    }
  }, [status, paytype]);

  const signUp = async () => {
    if (!userData.username || (isNewUser && !userData.phone_number) || !userData.password) {
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
        // "https://1e53d0afb221.ngrok-free.app/kovais/create-customer/",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      // // // // // // // // console.log("Signup Success:", response.data);
      localStorage.setItem("signedUpUser", JSON.stringify(formattedData));

      setErrorMessage('');

      setTimeout(() => {
        setIsNewUser(false);
        setLoading(false);

        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Please sign in with your new account",
        });
      }, 1000);

    } catch (error) {
      console.error("Signup Error:", error);

      const errorMsg = error.response?.data?.error ||
        error.response?.data?.message ||
        "Sign-Up Failed. Please try again.";

      setErrorMessage(errorMsg);

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setUserData({ ...userData, phone_number: value });

    // Only validate if the phone number field is visible (i.e., on the signup tab)
    if (isNewUser) {
      validatePhoneNumber(value);
    }
  };

  const validatePhoneNumber = (number) => {
    // 1. Basic Check: Empty or null
    if (!number) {
      setPhoneError('Phone number is required.');
      return false;
    }

    // 2. Regex Check: Allows digits, spaces, hyphens, and parentheses.
    // This regex ensures input looks like a phone number format.
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(number)) {
      setPhoneError('Only digits and common symbols (-, (,), space) are allowed.');
      return false;
    }

    // 3. Length Check: Assumes 10 to 15 digits is standard for global flexibility.
    // Strips non-digits before checking length.
    const digitsOnly = number.replace(/[^\d]/g, '');

    if (digitsOnly.length < 10) {
      setPhoneError('Phone number must be between 10 digits long (excluding formatting).');
      return false;
    }

    // If all checks pass
    setPhoneError('');
    return true;
  };


  const handleSignUpClick = () => {
    // Check if the current tab is signup and perform validation
    if (isNewUser) {
      const phoneValid = validatePhoneNumber(userData.phone_number);

      if (phoneValid && userData.username && userData.password) {
        signUp(); // Call the parent component's signup function
      }
    } else {
      // This case should ideally not be hit if the button reads "Login"
      signUp();
    }
  };

  // Determine if the main action button should be disabled
  const isButtonDisabled = loading || (isNewUser && !!phoneError);


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
        // "https://1e53d0afb221.ngrok-free.app/kovais/customer-login/",
        {
          username: userData.username,
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      // // // // // // // // console.log("Login Success:", response.data);

      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      localStorage.setItem("currentUserId", JSON.stringify(response.data.user_id));

      if (response.data.emblem_url || response.data.points) {
        localStorage.setItem("url", JSON.stringify(response.data.emblem_url));
        localStorage.setItem(`points_${response.data.user_id}`, JSON.stringify(response.data.points))
      }

      setUser(response.data);
      setPoints(response.data.points);

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        setErrorMessage('');
        setShowLoginModal(false);
        setShowModal(true);
      }, 500);

    } catch (error) {
      console.error("Login Error:", error);

      const errorMsg = error.response?.data?.login ||
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSelect = (key) => {
    setIsNewUser(key === 'signup');
    setErrorMessage('');
  };

  const handleDates = () => {
    const section = document.getElementById("dates");
    section.scrollIntoView({ behavior: "smooth" });
  }



  const handleClicked = () => {
    setShowModal(false);
  }

  const handleFreeService = () => {
    handleCloseModal();
    gymRequest()
  }

  // const handlePayService = () => {
  //   handleCloseModal();
  //   gymRequest()
  //   createPayment()
  // }
  const scrollToOffer = () => {
    const membershipplanssection = document.getElementById('membershipplanssection');
    if (membershipplanssection) {
      membershipplanssection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ✅ CREATE PAYMENT (React frontend)
  async function createPayment() {
    const url = 'https://api.codingboss.in/kovais/payment/create/';
    const id = localStorage.getItem('gymId');
    // const fcm_token = JSON.stringify(localStorage.getItem('fcm_token')) || 'demo_fcm_token';

    const payload = {
      amount: amount || selectedAmount,
      order_type: 'gym',
      order_id: id,
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
      // // // // // // // // console.log('✅ Payment created successfully:', data);


      localStorage.setItem('payment_db_id', String(data.payment_db_id));
      localStorage.setItem('order_id', String(data.order_id));
      // setPaymentData(data);


      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = data.upi_link;
      } else {
        const qrContainer = document.getElementById('qrContainer');
        qrContainer.innerHTML = `
<h3>Scan this QR to complete payment</h3>
<img src="${data.qr_code_url}" alt="UPI QR Code" style="width:250px;height:250px;">
<p>Or open this link on your phone:</p>
<a href="${data.upi_link}" target="_blank">${data.upi_link}</a>
`;
      }

      // await Webhook();
      await verifyPayment();
      return data;
    } catch (error) {
      console.error('❌ Error creating payment:', error.message);
      setMessage('Failed to create payment.');
    }
  }

  // ✅ VERIFY PAYMENT STATUS (React frontend)
  async function verifyPayment() {
    // const url = "https://api.codingboss.in/kovais/payment/verify/";
    const url = "https://api.codingboss.in/kovais/payment/verify/";
    const payment_id = localStorage.getItem("payment_db_id");
    const order_id = localStorage.getItem("order_id");
    const fcm_token = JSON.stringify(localStorage.getItem('fcm_token')) || 'demo_fcm_token';

    const payload = {
      gateway: "cashfree",
      order_id: order_id,
      payment_id: String(payment_id), // ✅ ensure string type
      signature: null,
      fcm_token: 'de985ad4e255a320cda6c55cf79809b4a2c2e7d3'
    };
    // // // // // // // // console.log("Verifying payment with payload:", payload);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      // // // // // // // // console.log("✅ Payment verified successfully:", data);
      // ✅ Handle different statuses (Universal Gateway Response)
      const status = (data.status || "").toUpperCase().trim();

      if (["PAID", "SUCCESS", "COMPLETED", "OK"].includes(status)) {
        // // // // // // // // console.log("🎉 Payment Successful!");
        // alert("✅ Payment Successful!");
      }
      else if (["FAILED", "FAILURE", "ERROR", "DECLINED"].includes(status)) {
        console.warn("❌ Payment Failed.");
        // alert("❌ Payment Failed!");
      }
      else if (["PENDING", "PROCESSING", "AWAITED"].includes(status)) {
        console.info("⏳ Payment Pending.");
        // alert("⏳ Payment Pending, please wait...");
        // Optional: Auto recheck status after delay
        pollVerify();
      }
      // else {
      //    console.log("ℹ️ Unknown payment status:", status);
      //   alert(`ℹ️ Unknown Status: ${status}`);
      // }

      return data;
    } catch (error) {
      console.error("❌ Error verifying payment:", error.message);
    }
  }

  // 🕒 OPTIONAL: AUTO VERIFY (poll every 10s until status changes)
  async function pollVerify(interval = 10000) {
    // console.log("🔄 Polling payment status every 10s...");
    const check = async () => {
      const result = await verifyPayment();
      if (result && (result.status === "PAID" || result.status === "FAILED")) {
        // console.log("✅ Stopping polling — final status:", result.status);
        return;
      }
      setTimeout(check, interval);
    };
    check();
  }


  const gymRequest = async () => {
    if (!selectedGender || !selectedAge || !selectedAmount || !bookedSlots || !purchaseddate) {
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
      status: bookedStatus,
      customer_id: user.user_id,
      username: user.username,
      points: usedPoints,
      // branch:
    };

    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/gym/orders/",
        // "https://1e53d0afb221.ngrok-free.app/kovais/gym/orders/",
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      // console.log("Success:", response.data);
      localStorage.setItem("gymId", JSON.stringify(response.data.order.id));
      // console.log("gym id", response.data.order.id)
      // setGymId(response.data.order.id);

      Swal.fire({
        title: "success",
        icon: "success",
        draggable: false
      });

    } catch (error) {
      console.error("Axios Error:", error.response ? error.response.data : error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <>
      <div className="gym-container">
        {/* Hero Section */}
        <section className="gym-hero-section py-5 bg-dark text-white position-relative" data-aos="fade-in">
          <div className="hero-overlay"></div>
          <Container className="position-relative">
            <Row className="align-items-center min-vh-50">
              <Col lg={6} className="text-center text-lg-start">
                <h1 className="display-4 fw-bold mb-4" data-aos="fade-right">
                  Transform Your <span className="pp">Body</span>
                </h1>
                <p className="lead mb-4" data-aos="fade-right" data-aos-delay="200">
                  Join KOVAIS Gym and embark on your fitness journey with modern equipment,
                  expert trainers, and a supportive community in Gobichettipalayam.
                </p>
                <div className="hero-stats mb-4" data-aos="fade-up" data-aos-delay="400">
                  <Row className="text-center">
                    <Col xs={4}>
                      <h3 className="pp mb-1"><FaTrophy /> 500+</h3>
                      <small>Happy Members</small>
                    </Col>
                    <Col xs={4}>
                      <h3 className="pp mb-1"><FaFire /> 3+</h3>
                      <small>Years Experience</small>
                    </Col>
                    <Col xs={4}>
                      <h3 className="pp mb-1"><FaAward /> 24/7</h3>
                      <small>Support</small>
                    </Col>
                  </Row>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="me-3 mb-2"
                  data-aos="fade-up"
                  data-aos-delay="600"
                  onClick={() => document.getElementById('gender-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  className="mb-2"
                  data-aos="fade-up"
                  data-aos-delay="700"
                  onClick={() => document.getElementById('gym-gallery')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Gallery
                </Button>
              </Col>
              <Col lg={6} className="text-center" data-aos="fade-left" data-aos-delay="800">
                <img
                  src="https://img.freepik.com/free-photo/young-fitness-man-studio_7502-5008.jpg"
                  alt="Gym Hero"
                  className="img-fluid rounded-4 shadow-lg gym-hero-image ken-burns-img"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Gym Features Section */}
        <section className="gym-features py-5 bg-light" data-aos="fade-up">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="display-6 fw-bold mb-4" data-aos="fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Why Choose <span className="pp" style={{ fontFamily: 'Playfair Display, serif' }}>KOVAIS Gym?</span>
                </h2>
                <p className="lead text-muted" data-aos="fade-up" data-aos-delay="200">
                  Experience fitness like never before with our premium facilities and expert guidance
                </p>
              </Col>
            </Row>
            <Row>
              {gymFeatures.map((feature, index) => (
                <Col md={6} lg={3} key={index} className="mb-4">
                  <Card
                    className="h-100 border-0 shadow-sm gym-feature-card glass-card"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Card.Body className="text-center p-4">
                      <div className="feature-icon mb-3">
                        {feature.icon}
                      </div>
                      <Card.Title className="feature-title h5 mb-3">{feature.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {feature.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Special Offers Section */}
        <section className="gym-offers py-5 bg-primary text-white" data-aos="fade-right">
          <Container>
            <Row className="align-items-center">
              <Col lg={6}>
                <h2 className="display-6 fw-bold mb-4" data-aos="fade-right">
                  Limited Time Offers!
                </h2>
                <div className="offer-item mb-4" data-aos="fade-right" data-aos-delay="200">
                  <Badge bg="warning" className="text-dark mb-2 px-3 py-2">New Member Special</Badge>
                  <h4 className="mb-2">Get 1 Month FREE!</h4>
                  <p className="mb-0">Join any 6-month or annual plan and get your first month absolutely free.</p>
                </div>
                <div className="offer-item mb-4" data-aos="fade-right" data-aos-delay="400">
                  <Badge bg="success" className="mb-2 px-3 py-2">Group Discount</Badge>
                  <h4 className="mb-2">Bring 3 Friends, Save 25%!</h4>
                  <p className="mb-0">Special group rates for friends and family joining together.</p>
                </div>
                <Button
                  variant="warning"
                  size="lg"
                  className="text-dark fw-bold"
                  data-aos="fade-up"
                  data-aos-delay="600"
                  onClick={scrollToOffer}
                >
                  Claim Your Offer
                </Button>
              </Col>
              <Col lg={6} className="text-center" data-aos="fade-left" data-aos-delay="300">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/023/842/631/non_2x/fitness-center-gym-equipment-retro-posters-vector.jpg"
                  alt="Group Training"
                  className="img-fluid rounded-4"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Select Gender Section */}
        <section id="gender-section" className="py-5">

          <h2 className="text-center display-6 fw-bold mb-5" data-aos="fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
            Select Your <span className="pp" style={{ fontFamily: 'Playfair Display, serif' }}>Category</span>
          </h2>
          <Row className="gender-selection justify-content-center">
            <Col xs={10} sm={6} md={4} lg={3}>
              <Card
                data-aos="fade-up"
                className={`selection-card gym-selection-card ${selectedGender === 'Men' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedGender('Men');
                  handleScroll();
                }}
              >
                <div className="card-image-wrapper">
                  <img src={men} alt="gymImages" className="card-img-custom" />
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="h5 " style={{ color: "black", fontWeight: "bolder", fontSize: "25px" }}>Men</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={10} sm={6} md={4} lg={3}>
              <Card
                data-aos="fade-up"
                data-aos-delay="200"
                className={`selection-card gym-selection-card ${selectedGender === 'Women' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedGender('Women');
                  handleScroll();
                }}
              >
                <div className="card-image-wrapper">
                  <img
                    src="https://img.freepik.com/premium-photo/girl-red-shirt-stands-front-window-with-sun-shining-through-window_427757-32950.jpg?ga=GA1.1.1857534666.1690658127&semt=ais_hybrid"
                    alt="gymImages"
                    className="card-img-custom"
                  />
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="h5" style={{ color: "black", fontWeight: "bolder", fontSize: "25px" }}>Women</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>

        </section>

        {/* Select Age Section */}
        <section className="py-5 bg-light">
          <Container>
            <h2 className="text-center display-6 fw-bold mb-5" id="target-section" data-aos="fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
              Select Your <span className="pp" style={{ fontFamily: 'Playfair Display, serif' }}>Age Group</span>
            </h2>
            <Row className="age-selection justify-content-center">
              <Col xs={10} sm={6} md={4} lg={3}>
                <Card
                  data-aos="fade-up"
                  className={`selection-card gym-selection-card ${selectedAge === 'Under 18' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedAge('Under 18');
                    handleDates();
                  }}
                >
                  <div className="card-image-wrapper">
                    <img
                      src="https://img.freepik.com/free-photo/children-sport_23-2148108576.jpg?ga=GA1.1.1857534666.1690658127&semt=ais_hybrid"
                      alt="gymImages"
                      className="card-img-custom"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="h5" style={{ color: "black", fontWeight: "bolder", fontSize: "25px" }}>Under 18</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={10} sm={6} md={4} lg={3}>
                <Card
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className={`selection-card gym-selection-card ${selectedAge === 'Above 20' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedAge('Above 20');
                    handleDates();
                  }}
                >
                  <div className="card-image-wrapper">
                    <img
                      src="https://img.freepik.com/free-photo/medium-shot-people-training-with-kettlebells_23-2149307721.jpg?ga=GA1.1.1857534666.1690658127&semt=ais_hybrid"
                      alt="gymImages"
                      className="card-img-custom"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="h5" style={{ color: "black", fontWeight: "bolder", fontSize: "25px" }}>Above 20</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={10} sm={6} md={4} lg={3}>
                <Card
                  data-aos="fade-up"
                  data-aos-delay="400"
                  className={`selection-card gym-selection-card ${selectedAge === 'Above 30' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedAge('Above 30');
                    handleDates();
                  }}
                >
                  <div className="card-image-wrapper">
                    <img
                      src="https://img.freepik.com/free-photo/group-happy-people-standing-against-wall-gym_23-2147949689.jpg?ga=GA1.1.1857534666.1690658127&semt=ais_hybrid"
                      alt="gymImages"
                      className="card-img-custom"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="h5" style={{ color: "black", fontWeight: "bolder", fontSize: "25px" }}>Above 30</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="py-5">
          <Container id="dates">
            <h2
              className="text-center display-6 fw-bold mb-5"
              data-aos="fade-up" style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Choose Your <span className="pp" style={{ fontFamily: 'Playfair Display, serif' }}>Schedule</span>
            </h2>

            <Row>
              {/* Date Picker */}
              <Col
                md={6}
                xs={12}
                className="d-flex justify-content-center align-items-center"
              >
                <div className="date-picker-wrapper" data-aos="fade-right">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM d, yyyy"
                    className="form-control gym-datepicker"
                    inline
                    minDate={new Date()}
                  />
                </div>
              </Col>

              {/* Time Slots */}
              <Col md={6} xs={12}>
                <h4
                  className="text-center mb-4 mt-5 time-slots-title"
                  data-aos="fade-left" style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Available Time Slots
                </h4>
                <Row className="text-center time-slots-grid">
                  {timeSlots.map((slot, index) => {
                    const disabled = isSlotBooked(slot) || isPastSlot(slot);

                    return (
                      <Col key={slot} md={4} className="my-2">
                        <Button
                          variant="warning"
                          data-aos-delay={index * 50}
                          className={`gym-time-slot ${disabled
                            ? "slot-booked"
                            : selectedTime === slot
                              ? "slot-selected"
                              : "slot-available"
                            }`}
                          onClick={() => {
                            handleSelectSlot(slot);
                            handlePlan();

                          }}
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
        <section className="py-5 bg-light" id="membershipplanssection">
          <Container>
            <h2 className='text-center display-6 fw-bold mb-5' id="plan" data-aos="fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
              Choose Your <span className="pp" style={{ fontFamily: 'Playfair Display, serif' }}>Membership Plan</span>
            </h2>
            <Row className="justify-content-center text-center membership-plans">

              {/* Monthly */}
              <Col md={6} lg={3} className="mb-4">
                <Card
                  className={`gym-membership-card glass-card h-100 ${selectedAmount === '399' ? 'selected' : ''}`}
                  onClick={() => handlePlanClick('399', '1 /Month')}                // data-aos="fade-up"
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="plan-header mb-4">
                      <FaDumbbell size={30} className="pp mb-3" />
                      <h5 className="plan-title" style={{ fontFamily: 'Playfair Display, serif' }}>Monthly Plan</h5>
                      <div className="plan-price">
                        <h1 className="price">₹399<span className="period">/ months</span> </h1>

                      </div>
                    </div>
                    <ul className="plan-features text-start flex-grow-1">
                      <li>✔ Access to all gym facilities</li>
                      <li>✔ Unlimited group classes</li>
                      <li>✔ Locker facility</li>
                      <li>✔ Free Wi-Fi</li>
                    </ul>
                    <Button
                      variant={selectedAmount === '399' ? 'warning' : 'outline-warning'}
                      className="mt-auto"
                    >
                      {selectedAmount === '399' ? 'Selected' : 'Choose Plan'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Quarterly */}
              <Col md={6} lg={3} className="mb-4">
                <Card
                  className={`gym-membership-card h-100 ${selectedAmount === '1099' ? 'selected' : ''}`}
                  onClick={() => handlePlanClick('1099', '3 /Months')}
                // data-aos="fade-up"
                // data-aos-delay="200"
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="plan-header mb-4">
                      <FaUsers size={30} className="text-warning mb-3" />
                      <h5 className="plan-title" style={{ fontFamily: 'Playfair Display, serif' }}>Quarterly Plan</h5>
                      <div className="plan-price">
                        <h1 className="price">₹1099<span className="period">/3 months</span> </h1>

                      </div>
                      <Badge bg="warning" className="mt-2">Save 8%</Badge>
                    </div>
                    <ul className="plan-features text-start flex-grow-1">
                      <li>✔ All Monthly benefits</li>
                      <li>✔ 1 Personal training session/month</li>
                      <li>✔ Nutrition consultation</li>
                      <li>✔ Priority booking</li>
                    </ul>
                    <Button
                      variant={selectedAmount === '1099' ? 'warning' : 'outline-warning'}
                      className="mt-auto"
                    >
                      {selectedAmount === '1099' ? 'Selected' : 'Choose Plan'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Semi-Annual */}
              <Col md={6} lg={3} className="mb-4">
                <Card
                  className={`gym-membership-card h-100 ${selectedAmount === '2199' ? 'selected' : ''}`}
                  onClick={() => handlePlanClick('2199', '6 /Months')}

                // data-aos="fade-up"
                // data-aos-delay="400"
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="plan-header mb-4">
                      <FaAward size={30} className="text-warning mb-3" />
                      <h5 className="plan-title" style={{ fontFamily: 'Playfair Display, serif' }}>Semi-Annual Plan</h5>
                      <div className="plan-price">
                        <h1 className="price">₹2199<span className="period">/6 months</span></h1>

                      </div>
                      <Badge bg="warning" className="mt-2">Save 15%</Badge>
                    </div>
                    <ul className="plan-features text-start flex-grow-1">
                      <li>✔ All Quarterly benefits</li>
                      <li>✔ 2 Personal training sessions/month</li>
                      <li>✔ Guest pass (2/month)</li>
                      <li>✔ Free workout gear</li>
                    </ul>
                    <Button
                      variant={selectedAmount === '2199' ? 'warning' : 'outline-warning'}
                      className="mt-auto"
                    >
                      {selectedAmount === '2199' ? 'Selected' : 'Choose Plan'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              {/* Annual */}
              <Col md={6} lg={3} className="mb-4">
                <Card
                  className={`gym-membership-card best-value h-100 ${selectedAmount === '4099' ? 'selected' : ''}`}
                  onClick={() => handlePlanClick('4099', '1 /Year')}
                // data-aos-delay="600"
                >
                  <Card.Body className="d-flex flex-column ">
                    <div className="best-value-badge">BEST VALUE</div>
                    <div className="plan-header mb-4">
                      <FaTrophy size={30} className="text-accent mb-3" />
                      <h5 className="plan-title" style={{ fontFamily: 'Playfair Display, serif' }}>Annual Plan</h5>
                      <div className="plan-price">
                        <h1 className="price">₹4099<span className="period">/ year</span> </h1>

                      </div>
                      <Badge bg="dark" className="mt-2">Save 25%</Badge>
                    </div>
                    <ul className="plan-features text-start flex-grow-1">
                      <li>✔ All Semi-Annual benefits</li>
                      <li>✔ Unlimited personal training</li>
                      <li>✔ Diet plan included</li>
                      <li>✔ VIP member privileges</li>
                      <li>✔ Free supplement consultation</li>
                    </ul>
                    <Button
                      variant={selectedAmount === '4099' ? 'dark' : 'outline-danger'}
                      className="mt-auto"
                    >
                      {selectedAmount === '4099' ? 'Selected' : 'Choose Plan'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

            </Row>
          </Container>
        </section>

        {/* Success Stories Section */}
        <section id="gym-gallery" className="py-5" data-aos="fade-left">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="display-6 fw-bold mb-4" data-aos="fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Success <span className="pp" style={{ fontFamily: 'Playfair Display, serif' }}>Stories</span>
                </h2>
                <p className="lead text-muted" data-aos="fade-up" data-aos-delay="200">
                  Real transformations from our amazing members
                </p>
              </Col>
            </Row>
            <Row>
              {successStories.map((story, index) => (
                <Col md={4} key={index} className="mb-4">
                  <Card
                    className="h-100 border-0 shadow-lg success-story-card glass-card"
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                  >
                    <Card.Img
                      variant="top"
                      src={story.image}
                      className="success-story-img"
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="h5 mb-2">{story.name}</Card.Title>
                      <Badge bg="success" className="mb-3">{story.achievement}</Badge>
                      <Card.Text className="text-muted fst-italic">
                        "{story.testimonial}"
                      </Card.Text>
                      <div className="rating text-warning mb-2">
                        {'★'.repeat(5)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Call to Action Section */}
        <section className="py-5 bg-warning text-white" data-aos="zoom-in">
          <Container>
            <Row className="text-center">
              <Col>
                <h2 className="display-6 fw-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Ready to Transform Your Life?</h2>
                <p className="lead mb-4">
                  Join hundreds of satisfied members who have achieved their fitness goals at KOVAIS Gym.
                </p>
                <div className="text-center" data-aos="fade-up">
                  <Button
                    // variant="warning-dark"
                    size="lg"
                    disabled={!isProceedEnabled}
                    onClick={() => handlePayment()}
                    className="text-dark fw-bold px-5 py-3"
                    style={{backgroundColor:"#ffffffff", color:"#000000ff"}}
                  >
                    <FaDumbbell className="me-2" />
                    {isProceedEnabled ? 'Proceed to Join' : 'Complete Selection Above'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <ToastContainer position="top-center" autoClose={3000} />

        {/* Demo Payment Modal */}
        <PaymentPage
          show={showDemoPayment}
          onHide={() => setShowDemoPayment(false)}
          bookingSummary={{
            services: [{ name: `Gym Membership (${plan})`, price: parseFloat(selectedAmount) || 0 }],
            date: selectedDate,
            time: selectedTime,
            amount: amount || parseFloat(selectedAmount) || 0,
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
        />

        <ConfirmationPage
          show={showDemoConfirmation}
          onHide={() => setShowDemoConfirmation(false)}
          transactionId={demoPaymentResult?.transactionId}
          amount={demoPaymentResult?.amount || amount || selectedAmount}
          paymentMethod={demoPaymentResult?.paymentMethod}
          bookingSummary={{
            services: [{ name: `Gym Membership (${plan})`, price: parseFloat(selectedAmount) || 0 }],
            date: selectedDate,
            time: selectedTime,
          }}
          onDone={() => setShowDemoConfirmation(false)}
        />


        {/* Login Modal  */}
        <Modal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          centered
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="w-100 text-center">Welcome</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 pt-0">
            <Tabs
              activeKey={isNewUser ? 'signup' : 'login'}
              onSelect={handleTabSelect}
              className="mb-4 nav-fill"
            >
              <Tab eventKey="login" title="Login" />
              <Tab eventKey="signup" title="Sign Up" />
            </Tabs>

            <Form>
              {/* Username Field */}
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaUser className="text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={userData.username || ""}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    placeholder="Username"
                    className="border-start-0"
                  />
                </InputGroup>
              </Form.Group>

              {/* Phone Field (Only for Signup) - WITH VALIDATION */}
              {isNewUser && (
                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <FaPhoneAlt className="text-secondary" />
                    </InputGroup.Text>
                    <Form.Control
                      type="tel"
                      value={userData.phone_number || ""}
                      onChange={handlePhoneNumberChange} // Uses validation handler
                      placeholder="Enter Your Phone Number"
                      className="border-start-0"
                      isInvalid={!!phoneError} // Toggles error styling
                    />
                    {/* Display Validation Error */}
                    <Form.Control.Feedback type="invalid">
                      {phoneError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              )}

              {/* Password Field */}
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaLock className="text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={userData.password || ""}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    placeholder="Password"
                    className="border-start-0 border-end-0"
                  />
                  <InputGroup.Text
                    className="bg-light cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ?
                      <FaEyeSlash className="text-secondary" /> :
                      <FaEye className="text-secondary" />
                    }
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {/* Forgot Password Link */}
              {!isNewUser && (
                <div className="d-flex justify-content-end mb-3">
                  <Button variant="link" className="p-0 text-decoration-none" size="sm">
                    Forgot password?
                  </Button>
                </div>
              )}

              {/* Overall Error Message */}
              {errorMessage && (
                <Alert variant="dark" className="py-2 mb-3">
                  {errorMessage}
                </Alert>
              )}

              {/* Main Action Button */}
              <Button
                variant="primary"
                // Use validation wrapper for Sign Up, use original login for Login
                onClick={isNewUser ? handleSignUpClick : loginUser}
                disabled={isButtonDisabled}
                className="w-100 py-2 mt-2 mb-3"
              >
                {loading ?
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isNewUser ? "Creating Account..." : "Logging in..."}
                  </span> :
                  isNewUser ? "Create Account" : "Login"
                }
              </Button>

              {/* The Social Login section has been removed */}

              {/* Terms & Privacy */}

              <p className="text-muted text-center small mt-4">
                By signing up, you agree to our <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>.
              </p>

            </Form>
          </Modal.Body>
        </Modal>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-white py-4">
        <Container>
          <Row className="text-center text-md-start">
            <Col className="mb-3">
              <iframe
                data-aos="fade-up"
                src="https://www.google.com/maps?q=097,+SH+15,+Otthakkuthirai,+Gobichettipalayam,+Tamil+Nadu+638455,+India&output=embed"
                width="100%"
                height="200"
                className="footer-map"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="text-center mt-3">
                <h5 className="fw-bold">
                  <FaDumbbell className="me-2" />
                  KOVAIS GYM
                </h5>
                <p className="mb-0">097, SH 15, Otthakkuthirai gobichettipalayam Tk, DT, Gobichettipalayam, Tamil Nadu 638455</p>
              </div>
            </Col>
          </Row>
          <hr className="my-3" />
          <p className="text-center mb-0">
            &copy; 2024 KOVAIS. All Rights Reserved. | Contact: <a href="tel:9234567891" style={{ color: 'inherit', textDecoration: 'none' }}>9234567891</a> | Email: <a href="mailto:info@kovaisbeauty.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@kovaisbeauty.com</a>
          </p>
        </Container>
      </footer>
    </>
  );
};

export default Gym;