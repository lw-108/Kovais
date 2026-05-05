import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Modal, Button, Tab, Tabs, Form, InputGroup, } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaDumbbell, FaUsers, FaClock, FaAward, FaTrophy, FaFire, FaPhoneAlt } from 'react-icons/fa';
import Swal from "sweetalert2";
import axios from "axios";
import 'loading-attribute-polyfill';
import {
  Menu, X, Scissors, ChevronLeft, ChevronRight, Star, Clock, Award,
  User, Sparkles, DollarSign, Users, Calendar, Phone, Mail, CreditCard,
  Check, MapPin, Instagram, Facebook, Twitter, Home, Calendar as CalendarIcon, CheckCircle
} from "lucide-react";
import "./barber.css";
import { FaScissors } from "react-icons/fa6";
import { PaymentPage, ConfirmationPage } from "../components/Payment";
import HerosBeards from "./images/HerosBeards.png";
// import { set } from "react-datepicker/dist/date_utils";

const SingleBarberPage = ({ user, setUser, points, setPoints, setAadhar }) => {
  // Navigation State
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery State
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");

  // New Booking State for enhanced booking system
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTime, setSelectedTime] = useState('')
  const [message, setMessage] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [amount, setAmount] = useState(0)
  const [appliedPoints, setAppliedPoints] = useState(0);  // Tracks points actually applied
  const [status, setStatus] = useState("")
  const [bookedStatus, setBookedStatus] = useState("booked")
  const [usedPoints, setUsedPoints] = useState()
  const [paytype, setPaytype] = useState("")
  const [bookedSlots, setBookedSlots] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [show, setShow] = useState(true)
  const [shopLocation, setShopLocation] = useState("")
  const [address, setAddress] = useState("")
  // const [serviceFor, setServiceFor] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  // const [selectedProvider, setSelectedProvider] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("")
  // const { register, handleSubmit, getValues, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [bookings, setBookings] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  // const [userBookings, setUserBookings] = useState([]);
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [showDemoConfirmation, setShowDemoConfirmation] = useState(false);
  const [demoPaymentResult, setDemoPaymentResult] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    phone_number: "",
    password: ""
  });
  const [location, setLocation] = useState(""); // For GPS coordinates
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [barberId, setBarberId] = useState("");
  // const [employees, setEmployee] = useState([])
  const navigate = useNavigate()
  const [booking, setBooking] = useState({
    services: [],
    location: 'salon',
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
  // const [employees, setEmployees] = useState([]);

  // Get today's date in YYYY-MM-DD format for the date picker
  const today = new Date().toISOString().split('T')[0];

  // Hero Slides
  const slides = [
    {
      title: "Premium Experience",
      subtitle: "Crafting Confidence Since 1995",
      description: "Experience the finest in traditional barbering with modern techniques. Our master barbers deliver precision cuts and luxurious grooming services.",
      image: "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg",
    },
    {
      title: "Master Craftsmen",
      subtitle: "Precision & Style United",
      description: "Every cut is a masterpiece. Our skilled barbers combine decades of experience with contemporary styling to create your perfect look.",
      image: "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg",
    },
    {
      title: "Luxury Redefined",
      subtitle: "Where Tradition Meets Innovation",
      description: "Step into our sanctuary of style where classic techniques meet modern luxury. Transform your look, elevate your confidence.",
      image: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg",
    },
  ];

  // New Services Data
  const services = [
    // Men's Services
    {
      id: 'm1',
      category: 'Men',
      name: 'Classic Gentleman HairCut',
      description: 'Traditional scissor cut with styling',
      price: 45,
      image: 'https://cdn.shopify.com/s/files/1/0289/5858/9027/files/image_6.jpg?v=1585622451',
      duration: '45 min'
    },
    {
      id: 'm2',
      category: 'Men',
      name: 'Hair color ',
      description: 'Professional hair coloring for men—cover grays, refresh your look with natural, lasting results.',
      price: 35,
      image: 'https://media.gettyimages.com/id/1363025864/video/hair-colouring.jpg?s=640x640&k=20&c=cXSWDsD8YXP8jU_Nz68Hn4BrIdzka6cZEzKP0glluU0=',
      duration: '30 min'
    },
    {
      id: 'm3',
      category: 'Men',
      name: 'Shave & beard trim',
      description: 'Precision shave and beard trim for men—clean lines, sharp style, and expert grooming tailored to your look.',
      price: 55,
      image: 'https://media.istockphoto.com/id/872361244/photo/man-getting-his-beard-trimmed-with-electric-razor.jpg?s=612x612&w=0&k=20&c=_IjZcrY0Gp-2z6AWTQederZCA9BLdl-iqWkH0hGMTgg=',
      duration: '60 min'
    },

    // Women's Services
    {
      id: 'w1',
      category: 'Women',
      name: 'Signature Cut & Style',
      description: 'Precision cut with professional blow-dry',
      price: 75,
      image: 'https://www.snip.co.in/wp-content/uploads/2025/03/haircuts-for-long-hair-banner.webp',
      duration: '90 min'
    },
    {
      id: 'w2',
      category: 'Women',
      name: 'Color Treatment',
      description: 'Full color service with conditioning',
      price: 120,
      image: 'https://img.freepik.com/premium-photo/professional-hair-coloring-women-salon-bright-trendy-style-closeup-strands-hair_162895-757.jpg?w=360',
      duration: '180 min'
    },
    {
      id: 'w3',
      category: 'Women',
      name: 'Bridal Package',
      description: 'Complete wedding day styling',
      price: 200,
      image: 'https://www.sanctuarysalondayspa.com/wp-content/uploads/2019/08/customized-facial.jpg',
      duration: '240 min'
    },

    // Kids Services
    {
      id: 'k1',
      category: 'Kids',
      name: 'Kids Haircut & Style',
      description: 'Special experience for little ones',
      price: 25,
      image: 'https://media.istockphoto.com/id/825461082/photo/5-year-old-getting-a-haircut.jpg?s=612x612&w=0&k=20&c=ax37u3ZD2p7odcIyhTO82hqww5lJ8fOAUJXsUVP2Ag8=',
      duration: '30 min'
    },

    // Funeral Services
    // {
    //   id: 'f1',
    //   category: 'Funeral',
    //   name: 'Memorial Grooming',
    //   description: 'Respectful final preparation service',
    //   price: 80,
    //   image: 'https://images.unsplash.com/photo-1675746435874-e72d846bdca5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //   duration: '60 min'
    // },

    // Function Services
    // {
    //   id: 'fn1',
    //   category: 'Function',
    //   name: 'Event Styling',
    //   description: 'Professional styling for special occasions',
    //   price: 90,
    //   image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
    //   duration: '120 min'
    // },
    // {
    //   id: 'fn2',
    //   category: 'Function',
    //   name: 'Group Styling',
    //   description: 'Styling services for wedding parties',
    //   price: 150,
    //   image: 'https://media.istockphoto.com/id/511777075/photo/teacher-helping-students-training-to-become-hairdressers.jpg?s=612x612&w=0&k=20&c=o1adWObcvGOzxyVxLpw1vfk-7Aav-WAipygsQnWHUhI=',
    //   duration: '180 min'
    // }
  ];

  const fetchEmployees = async () => {
    try {
      // const response = await axios.get("https://7ceceea4e223.ngrok-free.app/kovais/saloon/workers/");
      const response = await axios.get("https://api.codingboss.in/kovais/saloon/workers/");
      const data = response.data;
      console.log("Fetched Employees:", data);
      console.log("Employee Ids:", data.map(emp => emp.id));
      // setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  const employees = [
    {
      id: 'emp1',
      name: 'Marcus Johnson',
      speciality: 'Master Barber',
      rating: 4.9,
      image: '',
      categories: ['Men']
    },
    {
      id: 'emp2',
      name: 'Sofia Martinez',
      speciality: 'Hair Stylist',
      rating: 4.8,
      image: '',
      categories: ['Women', 'Function']
    },
    {
      id: 'emp3',
      name: 'David Chen',
      speciality: 'Kids Specialist',
      rating: 4.7,
      image: '',
      categories: ['Kids', 'Men']
    },
    {
      id: 'emp4',
      name: 'Isabella',
      speciality: 'Senior Stylist',
      rating: 4.9,
      image: '',
      categories: ['Women', 'Function', 'Funeral']
    }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM',
  ];

  // Gallery Data
  const galleryItems = [
    { id: 1, image: "https://www.snip.co.in/wp-content/uploads/2025/03/haircuts-for-long-hair-banner.webp", category: "haircuts", title: "Classic Cut" },
    { id: 2, image: HerosBeards, category: "beards", title: "Beard Styling" },
    { id: 3, image: "https://cdn.prod.website-files.com/5cb569e54ca2fddd5451cbb2/5f90d9f6524b4ef970668f66_shaving.jpg", category: "shaves", title: "Traditional Shave" },
    { id: 4, image: "https://5.imimg.com/data5/SELLER/Default/2024/2/390915581/QH/RY/VA/5937917/men-hair-cutting-services-500x500.jpg", category: "haircuts", title: "Modern Style" },
    { id: 5, image: "https://images.squarespace-cdn.com/content/v1/5616c8cde4b0bbc1cabb7c79/1722260249364-2KSRDUK610AJXEZLJU7Y/The+Complete+Beard+Grooming+Guide_+How+To+Trim+A+Beard+%26+Maintain+It+Like+A+Pro.jpeg?format=1500w", category: "beards", title: "Beard Trim" },
    { id: 6, image: "https://media.istockphoto.com/id/680907176/photo/little-boy-getting-haircut-by-barber-while-sitting-in-chair-at-barbershop.jpg?s=612x612&w=0&k=20&c=pjQ1u-clewaVhuVzJfguXE29upc0-dg79bY4XCpR8t4=", category: "haircuts", title: "Kids Haircut" },
    { id: 7, image: "https://t4.ftcdn.net/jpg/04/81/61/63/360_F_481616375_FJDU9iucCA0iMY06iCsqpVUL12qohLRL.jpg", category: "haircuts", title: "Fade Cut" },
    { id: 8, image: "https://wimpoleclinic.com/wp-content/uploads/2024/05/7-Low-Maintenance-Full-Beard-Styles-For-Confident-Men.jpg", category: "beards", title: "Full Grooming" },
    { id: 9, image: "https://www.shutterstock.com/image-photo/shaving-brush-foam-razors-on-600nw-2695446057.jpg", category: "shaves", title: "Luxury Shave" },
    { id: 10, image: "https://img.freepik.com/free-photo/mid-section-barber-applying-cream-clients-beard_107420-94760.jpg?semt=ais_hybrid&w=740&q=80", category: "shaves", title: "Hot Towel Shave" },
    { id: 11, image: "https://img.freepik.com/premium-photo/man-with-mustache-having-shave_1212-2693.jpg", category: "shaves", title: "Classic Shave" },
    { id: 12, image: "https://t4.ftcdn.net/jpg/02/31/11/07/360_F_231110781_OWK0WLiOgYWn9DhNF7bYqJrkuiwEiEPw.jpg", category: "beards", title: "Professional Beard Grooming" },
  ];

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Helper Functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const filteredItems = filter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  const getAvailableCategories = () => {
    if (booking.location === 'salon' || booking.location === 'doorstep') {
      return ['Men', 'Women', 'Kids'];
    }
  };

  const categories = getAvailableCategories();

  const filteredServices = services.filter(
    (service) => service.category === selectedCategory
  );

  const availableEmployees = selectedCategory
    ? employees.filter(emp => emp.categories.includes(selectedCategory))
    : employees;

  const handleLocationChange = (location) => {
    setBooking(prev => ({ ...prev, location }));

    // ✅ Allow Men, Women, Kids for both salon & doorstep
    const allowedCategories = ['Men', 'Women', 'Kids'];

    if (
      (location === 'salon' || location === 'doorstep') &&
      selectedCategory &&
      !allowedCategories.includes(selectedCategory)
    ) {
      setSelectedCategory(null);
      setBooking(prev => ({ ...prev, services: [] }));
    }
  };

  const handleUsePoints = (value, amount) => {
    const pointsToUse = parseInt(value);
    setUsedPoints(pointsToUse);
    // ✅ Safely compute total — use amount from state if passed
    const totalAmount = amount || booking.services.reduce((total, service) => total + Number(service.amount || 0), 0)

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
        text: `You can't use points worth more than your total price ₹${totalAmount}`,
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
      title: "Points Applied 🎉",
      html: `
      <b>${pointsToUse}</b> points used (worth ₹${discountValue.toFixed(2)}).<br/>
      New total: <b>₹${newPrice.toFixed(2)}</b><br/>
      Remaining points: <b>${newPoints}</b>
    `,
      confirmButtonColor: "#10B981"
    });

    setValue("");
  };


  const handleServiceSelect = (service) => {
    if (!selectedCategory) {
      setSelectedCategory(service.category);
    }

    const isSelected = booking.services.some(s => s.id === service.id);
    if (isSelected) {
      setBooking(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== service.id)
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
    }
  };

  useEffect(() => {
    setAmount(calculateTotal());
  }, [booking.services, booking.location]);

  // Pre-fill customer info for logged-in users
  useEffect(() => {
    if (user) {
      setBooking(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          name: user.username || user.name || '',
          phone: user.phone_number || user.phone || '',
          email: user.email || ''
        }
      }));
    }
  }, [user]);

  const calculateTotal = () => {
    const serviceTotal = booking.services.reduce((sum, service) => sum + service.price, 0);
    const doorstepCharge = booking.location === 'doorstep' ? 250 : 0;
    const final = serviceTotal + doorstepCharge;
    return final;
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0: return booking.services.length > 0;
      case 1: return booking.employee !== null;
      case 2: return booking.date !== '' && booking.time !== null;
      case 3:
        // For logged-in users, step 3 is the confirmation step (no details needed)
        if (user) {
          // For doorstep services, require address
          if (booking.location === 'doorstep') {
            return booking.customerInfo.address && booking.customerInfo.address.trim() !== '';
          }
          return true; // Salon services don't need additional validation
        }
        // For non-logged-in users, validate customer details
        const isPhoneValid = booking.customerInfo.phone && /^[\d\s\-\(\)]+$/.test(booking.customerInfo.phone) && booking.customerInfo.phone.replace(/[^\d]/g, '').length >= 10;
        const isEmailValid = booking.customerInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customerInfo.email);
        return booking.customerInfo.name && isPhoneValid && isEmailValid;
      default: return true;
    }
  };

  const nextStep = () => {
    const maxStep = user ? 3 : 4; // Logged-in users skip to step 4 (confirmation)
    if (currentStep < maxStep && isStepValid(currentStep)) {
      setShowErrors(false);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setShowErrors(false);
      setCurrentStep(prev => prev - 1);
    }
  };

  const isTimeSlotPassed = (timeSlot, selectedDate) => {
    if (!selectedDate) return false;

    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();

    if (!isToday) return false;

    // Convert time slot to 24-hour format for comparison
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : period === 'AM' && hours === 12 ? 0 : hours;

    const slotTime = new Date();
    slotTime.setHours(hour24, minutes, 0, 0);

    return slotTime <= today;
  };

  const stepConfig = user ? [
    { number: 1, title: 'Select Service', icon: User },
    { number: 2, title: 'Choose Specialist', icon: Star },
    { number: 3, title: 'Choose Date & Time', icon: CalendarIcon },
    { number: 4, title: 'Booking Confirmation', icon: CheckCircle }
  ] : [
    { number: 1, title: 'Select Service', icon: User },
    { number: 2, title: 'Choose Specialist', icon: Star },
    { number: 3, title: 'Choose Date & Time', icon: CalendarIcon },
    { number: 4, title: 'Your Details', icon: Phone },
    { number: 5, title: 'Booking Confirmation', icon: CheckCircle }
  ];

  const scrollToBookingApplication = () => {
    const bookingapplication = document.getElementById('second');
    if (bookingapplication) {
      bookingapplication.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const services = document.getElementById('services');
    if (services) {
      services.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent! We'll get back to you within 24 hours.");
  };

  const stats = [
    { icon: Star, value: "4.9", label: "Rating" },
    { icon: Clock, value: "25+", label: "Years" },
    { icon: Award, value: "500+", label: "Happy Clients" },
  ];

  const achievements = [
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Award, value: "25+", label: "Years Experience" },
    { icon: Clock, value: "10k+", label: "Services Delivered" },
    { icon: Star, value: "4.9", label: "Average Rating" },
  ];

  const values = [
    {
      title: "Craftsmanship",
      description: "Every cut is a work of art, crafted with precision and passion by our master barbers.",
    },
    {
      title: "Tradition",
      description: "We honor the timeless traditions of barbering while embracing modern techniques and styles.",
    },
    {
      title: "Excellence",
      description: "We never compromise on quality, ensuring every client leaves feeling confident and satisfied.",
    },
  ];

  const filters = [
    { value: "all", label: "All Work" },
    { value: "haircuts", label: "Haircuts" },
    { value: "beards", label: "Beards" },
    { value: "shaves", label: "Shaves" },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Main Street\nDowntown District\nNew York, NY 10001",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "(555) 123-BARBER\n(555) 123-2273",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@barbercraft.com\ninfo@barbercraft.com",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 9:00 AM - 8:00 PM\nSat-Sun: 8:00 AM - 6:00 PM",
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  useEffect(() => {
    if (status && paytype) {
      setTimeout(() => {
        if (paytype === "offline") {
          handleFreeService();
        } else if (paytype === "online") {
          handlePayupi();
          // handleRazorpayPayment();
        }
      }, 500);
    }
  }, [status, paytype]);

  const signUp = async () => {
    // Validate input fields
    if (!userData.username || (isNewUser && !userData.phone_number) || !userData.password) {
      setErrorMessage('All fields are required');
      return;
    }

    setLoading(true);

    // Format data for API
    const formattedData = {
      name: userData.username,
      phone_number: userData.phone_number,
      password: userData.password,
      // Add any other required fields from your formattedData object
    };

    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/create-customer/",
        // "https://206365caddb9.ngrok-free.app/kovais/create-customer/",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      console.log("Signup Success:", response.data);
      localStorage.setItem("signedUpUser", JSON.stringify(formattedData));


      // Clear form and show success message
      setErrorMessage('');

      // Switch to login tab after successful signup
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


  // Login Function
  const loginUser = async () => {
    // Validate input fields
    if (!userData.username || !userData.password) {
      setErrorMessage('Username and password are required');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Clear previous errors

    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/customer-login/",
        // "https://206365caddb9.ngrok-free.app/kovais/customer-login/",
        {
          username: userData.username,
          password: userData.password, // Fixed: was using username for password
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      console.log("Login Success:", response.data);

      // Save user data to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      localStorage.setItem("currentUserId", JSON.stringify(response.data.user_id));

      if (response.data.emblem_url || response.data.points) {
        localStorage.setItem("url", JSON.stringify(response.data.emblem_url));
        localStorage.setItem(`points_${response.data.user_id}`, JSON.stringify(response.data.points))
      }

      setUser(response.data);
      setPoints(response.data.points);
      // Success message and close modal
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        setErrorMessage('');
        setShowLoginModal(false);
        setShow(false); // Close any parent modal if needed
        // navigate('/profile'); // Refresh the page to reflect logged-in state
      }, 500);

    } catch (error) {
      console.error("Login Error:", error);

      const errorMsg = error.response?.data?.login ||
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
      // setShowModal(true); 
    }
  };

  // Handle tab switching
  const handleTabSelect = (key) => {
    setIsNewUser(key === 'signup');
    setErrorMessage(''); // Clear error messages on tab switch
  };

  const handleClicked = () => {
    setShowModal(false);
  }

  const handleClose = () => setShow(false);

  const handleFreeService = () => {
    setShowModal(false); // Close the modal
    postRequest()
  };

  const handlePayupi = () => {
    setShowModal(false)
    postRequest()
    setTimeout(() => {
      createPayment()
    }, 3000)
  }

  const handlePayment = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      setShowLoginModal(true);
      setShowModal(false);
      return;
    }

    const user = JSON.parse(loggedInUser);
    setUser(user);
    setShowLoginModal(false);
    // Open the new demo payment modal instead of old one
    setShowDemoPayment(true);
  };

  // Demo Payment Success Handler
  const handleDemoPaymentSuccess = (result) => {
    setDemoPaymentResult(result);
    setShowDemoPayment(false);
    setStatus("completed");
    setPaytype("online");
    if (result.address) setAddress(result.address);

    // Also create the order via API
    postRequest(result.address);

    // Show confirmation after a short delay
    setTimeout(() => {
      setShowDemoConfirmation(true);
    }, 500);
  };

  // Demo Payment Failure Handler 
  const handleDemoPaymentFailure = (error) => {
    console.log("Payment failed:", error);
    // The PaymentPage component handles retry internally
  };

  // Demo Book Now Pay Later Handler
  const handleDemoBookNowPayLater = (info) => {
    setStatus("pending");
    setPaytype("offline");
    setShowDemoPayment(false);
    if (info?.branch) setShopLocation(info.branch);
    if (info?.address) setAddress(info.address);

    // Create the order via API
    postRequest(info?.address);

    // Show confirmation
    setTimeout(() => {
      setDemoPaymentResult({ paymentMethod: "offline", amount: amount });
      setShowDemoConfirmation(true);
    }, 500);
  };


  // ✅ CREATE PAYMENT (React frontend)
  async function createPayment() {
    const url = 'https://api.codingboss.in/kovais/payment/create/';
    const id = localStorage.getItem('barberId');
    // const fcm_token = localStorage.getItem('fcm_token') || 'demo_fcm_token';

    const payload = {
      amount: amount || booking.services.reduce((total, service) => total + Number(service.amount || 0), 0),
      order_type: 'saloon',
      order_id: id,
      gateway: 'cashfree',
      fcm_token: "de985ad4e255a320cda6c55cf79809b4a2c2e7d3",
    };


    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });


      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);


      const data = await response.json();
      console.log('✅ Payment created successfully:', data);
      console.log(data.upi_link)

      localStorage.setItem('payment_db_id', String(data.payment_db_id));
      localStorage.setItem('order_id', String(data.order_id));
      console.log("UPI_LINK", data.upi_link)
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
    // const fcm_token = JSON.stringify(localStorage.getItem('fcm_token')) || 'demo_fcm_token';

    const payload = {
      gateway: "cashfree",
      order_id: order_id,
      payment_id: String(payment_id), // ✅ ensure string type
      signature: null,
      fcm_token: 'de985ad4e255a320cda6c55cf79809b4a2c2e7d3'
    };

    console.log("🔍 Verifying payment with payload:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("✅ Payment verified successfully:", data);

      // ✅ Handle different statuses
      // switch (data.status) {
      //   case "PAID" :
      //     console.log("🎉 Payment Successful!");
      //     alert("✅ Payment Successful!");
      //     break;

      //   case "FAILED":
      //     console.warn("❌ Payment Failed.");
      //     alert("❌ Payment Failed!");
      //     break;

      //   case "PENDING":
      //     console.info("⏳ Payment Pending.");
      //     alert("⏳ Payment Pending, please wait...");
      //     // Optional: auto recheck every few seconds
      //     pollVerify();
      //     break;

      //   default:
      //     console.log("ℹ️ Unknown payment status:", data.status);
      // }

      // ✅ Handle different statuses (Universal Gateway Response)
      const status = (data.status || "").toUpperCase().trim();

      if (["PAID", "SUCCESS", "COMPLETED", "OK"].includes(status)) {
        console.log("🎉 Payment Successful!");
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
      else {
        console.log("ℹ️ Unknown payment status:", status);
        // alert(`ℹ️ Unknown Status: ${status}`);
      }

      return data;
    } catch (error) {
      console.error("❌ Error verifying payment:", error.message);
    }
  }

  // 🕒 OPTIONAL: AUTO VERIFY (poll every 10s until status changes)
  async function pollVerify(interval = 10000) {
    console.log("🔄 Polling payment status every 10s...");
    const check = async () => {
      const result = await verifyPayment();
      if (result && (result.status === "PAID" || result.status === "FAILED")) {
        console.log("✅ Stopping polling — final status:", result.status);
        return;
      }
      setTimeout(check, interval);
    };
    check();
  }

  const postRequest = async (overrideAddress) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const finalAddress = overrideAddress || address;

    const data = {
      order_type: booking.location,
      category: selectedCategory,
      services: booking.services.map(service => service.name).join(", "),
      amount: amount || booking.services.reduce((total, service) => total + Number(service.amount || 0), 0),
      date: formattedDate,
      time: booking.time,
      payment_status: status,
      payment_type: paytype,
      customer_id: user.user_id,
      status: bookedStatus,
      points: usedPoints,
      branch: shopLocation,
      // employee_id: employees.find(emp => emp.id === booking.employee)?.id || null,
      phone: booking.customerInfo.phone,
      // Add these new fields
      address: finalAddress,
      latitude: booking.services === "Door Step" && location ? location.lat : null,
      longitude: booking.services === "Door Step" && location ? location.lng : null
    };

    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/saloon/orders/",
        // "https://206365caddb9.ngrok-free.app/kovais/saloon/orders/",
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      // const data = await response.json()

      console.log("Success:", response.data);
      console.log("Order ID:", response.data.order.id);
      localStorage.setItem("barberId", JSON.stringify(response.data.order.id));
      // setBarberId(response.data.order.id);

      Swal.fire({
        title: "Success",
        text: "Your booking is confirmed!",
        icon: "success",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      // setTimeout(() => {
      //   navigate("/")
      // }, 2000)
      //  await createPayment()
      //  return data;
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  // Image loading handler
  const handleImageLoad = (e) => {
    e.target.classList.add('loaded');
  };

  // Preload critical images
  useEffect(() => {
    // Preload first two hero images
    slides.forEach((slide, index) => {
      if (index < 2) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, []);



  return (
    <motion.div
      className="barber-main-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >


      {/* Hero Section */}
      <section id="home" className="hero-banner-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="hero-background-layer"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div
              className="hero-image-backdrop"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            />
            <div className="hero-overlay-dark" />
          </motion.div>
        </AnimatePresence>

        <div className="hero-content-wrapper">
          <div className="hero-layout-grid">
            <motion.div
              className="hero-text-section"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.p
                    className="hero-subtitle-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                  <motion.h1
                    className="hero-main-title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    className="hero-description-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="hero-action-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button className="primary-action-btn" onClick={scrollToBookingApplication}>
                  Book Appointment
                </button>
                <button className="secondary-action-btn" onClick={scrollToServices}>
                  View Services
                </button>
              </motion.div>

              <motion.div
                className="hero-stats-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="stat-item-box"
                    whileHover={{ scale: 1.1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <stat.icon className="stat-icon-element" />
                    <div className="stat-value-number">{stat.value}</div>
                    <div className="stat-label-text">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-controls-panel"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                className="carousel-prev-btn"
                onClick={prevSlide}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="carousel-dots-container">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`carousel-dot-indicator ${index === currentSlide ? "dot-active" : ""}`}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>

              <button
                className="carousel-next-btn"
                onClick={nextSlide}
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mobile-carousel-dots"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              className={`mobile-dot-btn ${index === currentSlide ? "mobile-dot-active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </motion.div>
      </section>

      {/* NEW SERVICES SECTION */}
      <section id="services" className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container py-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <h2 className="h2 fw-bold mb-5 text-center" style={{ color: '#daa520', fontFamily: 'Playfair Display, serif', fontSize: '2.7rem' }}>
              Our Premium Services
            </h2>

            {/* Service Location Selection */}
            <div className="mb-5" id="first">
              <h3 className="h4 fw-semibold mb-4 text-center" style={{ color: '#000', fontFamily: 'Playfair Display, serif', fontSize: '2.7rem' }}>
                Service Location
              </h3>
              <div className="row justify-content-center g-4">
                <div className="col-md-6 col-lg-4">
                  <div
                    className={`card h-100 text-center cursor-pointer ${booking.location === 'salon' ? 'shadow-lg' : ''}`}
                    onClick={() => {
                      handleLocationChange('salon')
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      border: 'none',
                      boxShadow: booking.location === 'salon' ? '0 12px 30px rgba(218, 165, 32, 0.25)' : '0 2px 10px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      transform: booking.location === 'salon' ? 'translateY(-5px)' : 'none'
                    }}
                  >
                    <div className="card-body p-4">
                      <MapPin className="mx-auto mb-3" style={{ width: '48px', height: '48px', color: '#daa520' }} />
                      <h4 className="fw-semibold mb-2" style={{ color: '#000' }}>Salon Service</h4>
                      <p className="small" style={{ color: '#6c757d' }}>Visit our premium location</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div
                    className={`card h-100 text-center cursor-pointer ${booking.location === 'doorstep' ? 'shadow-lg' : ''}`}
                    onClick={() => {
                      handleLocationChange('doorstep')
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      border: 'none',
                      boxShadow: booking.location === 'doorstep' ? '0 12px 30px rgba(218, 165, 32, 0.25)' : '0 2px 10px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      transform: booking.location === 'doorstep' ? 'translateY(-5px)' : 'none'
                    }}
                  >
                    <div className="card-body p-4">
                      <Home className="mx-auto mb-3" style={{ width: '48px', height: '48px', color: '#daa520' }} />
                      <h4 className="fw-semibold mb-2" style={{ color: '#000' }}>Doorstep Service</h4>
                      <p className="small" style={{ color: '#6c757d' }}>We come to you (+ ₹250)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5" id="second">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-3 border-0 transition-all rounded-4 d-flex align-items-center justify-content-center ${selectedCategory === category
                    ? 'text-dark fw-bold'
                    : 'text-muted'
                    }`}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    boxShadow: selectedCategory === category ? '0 12px 30px rgba(218, 165, 32, 0.25)' : '0 4px 15px rgba(0,0,0,0.05)',
                    transform: selectedCategory === category ? 'translateY(-3px)' : 'none',
                    minWidth: '120px'
                  }}
                  onClick={() => {
                    if (booking.services.length === 0) {
                      setSelectedCategory(category === selectedCategory ? null : category);
                    }
                    const serve = document.getElementById('third');
                    serve.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={booking.services.length > 0 && selectedCategory !== category}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="row g-4" id='third'>
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="col-md-6 col-lg-4"
                >
                  <div className={`card h-100 border-0 ${booking.services.some(s => s.id === service.id)
                    ? 'shadow-lg'
                    : 'shadow-sm'
                    }`}
                    style={{
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: booking.services.some(s => s.id === service.id) 
                        ? '0 12px 30px rgba(218, 165, 32, 0.25)' 
                        : '0 4px 15px rgba(0,0,0,0.05)',
                      transform: booking.services.some(s => s.id === service.id) ? 'translateY(-5px)' : 'none'
                    }}>
                    <div className="position-relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                        loading="lazy"  // Added lazy loading
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge" style={{ backgroundColor: '#daa520', color: '#fff' }}>
                          {service.duration}
                        </span>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title" style={{ color: '#000' }}>{service.name}</h5>
                      <p className="card-text flex-grow-1" style={{ color: '#6c757d' }}>
                        {service.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h4 fw-bold mb-0" style={{ color: '#daa520' }}>
                          ₹ {service.price}
                        </span>
                        <span className="badge" style={{ backgroundColor: '#6c757d', color: '#fff' }}>
                          {service.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleServiceSelect(service)}
                        className={`btn w-100 ${booking.services.some(s => s.id === service.id)
                          ? 'btn-golden text-white fw-bold'
                          : 'btn-outline-golden'
                          }`}
                      >
                        {booking.services.some(s => s.id === service.id) ? 'Selected' : 'Select Service'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <button
            className="btn btn-success btn-lg mx-auto d-block mt-4 w-50"
            onClick={() => {
              const services = document.getElementById('booking-sectionn');
              services.scrollIntoView({ behavior: 'smooth' });
            }}>Booking Your Appointment</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-company-section">
        <div className="about-container-wrapper">
          <motion.div
            className="about-header-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="about-main-title" style={{ fontFamily: 'Playfair Display, serif' }}>
              About BarberCraft
            </h2>
            <p className="about-intro-paragraph">
              For over 25 years, we've been the destination for discerning gentlemen who appreciate
              the finer details of grooming and the art of traditional barbering.
            </p>
          </motion.div>

          <div className="about-content-layout">
            <motion.div
              className="about-story-column"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="story-section-heading" style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Story
              </h3>
              <p className="story-paragraph-one">
                Founded in 1995 by master barber Antonio Rossi, BarberCraft began as a small
                neighborhood shop with a simple mission: to provide exceptional grooming services
                that honor the craft's rich traditions while meeting modern standards of excellence.
              </p>
              <p className="story-paragraph-two">
                Today, we continue that legacy with a team of skilled artisans who share our passion
                for precision, style, and creating an experience that goes beyond just a haircut.
              </p>

              <div className="story-badges-container">
                <span className="story-badge-item">
                  Master Barbers
                </span>
                <span className="story-badge-item">
                  Premium Products
                </span>
                <span className="story-badge-item">
                  Traditional Techniques
                </span>
              </div>
            </motion.div>

            <motion.div
              className="achievements-grid-section"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="achievement-stat-card">
                    <motion.div
                      className="achievement-icon-circle"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <achievement.icon className="achievement-icon-svg" />
                    </motion.div>
                    <div className="achievement-number-display">
                      {achievement.value}
                    </div>
                    <div className="achievement-label-desc">
                      {achievement.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="values-showcase-grid"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="value-principle-card"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="value-card-content">
                  <h4 className="value-title-heading">
                    {value.title}
                  </h4>
                  <p className="value-description-para">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="portfolio-gallery-zone">
        <div className="gallery-container-area">
          <motion.div
            className="gallery-header-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="gallery-main-heading" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Portfolio
            </h2>
            <p className="gallery-intro-text">
              Discover the artistry and precision that defines our work. Each image tells a story
              of transformation and craftsmanship.
            </p>

            <motion.div
              className="gallery-filter-controls"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {filters.map((filterItem, index) => (
                <motion.div
                  key={filterItem.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    className={`filter-category-btn ${filter === filterItem.value ? "filter-btn-active" : ""}`}
                    onClick={() => setFilter(filterItem.value)}
                  >
                    {filterItem.label}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="gallery-images-grid"
            layout
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="gallery-photo-item"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="gallery-image-container">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-thumbnail-img"
                      loading="lazy"  // Added lazy loading
                    />
                    <div className="gallery-hover-overlay">
                      <div className="gallery-overlay-content">
                        <h3 className="gallery-item-title">{item.title}</h3>
                        <p className="gallery-item-category">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {selectedImage !== null && (
              <motion.div
                className="gallery-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
              >
                <motion.div
                  className="gallery-modal-content"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={filteredItems[selectedImage].image}
                    alt={filteredItems[selectedImage].title}
                    className="modal-enlarged-image"
                    loading="eager"  // Modal images should load immediately
                  />

                  <button
                    className="modal-close-button"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X size={24} />
                  </button>

                  <div className="modal-image-info">
                    <h3 className="modal-title-text">{filteredItems[selectedImage].title}</h3>
                    <p className="modal-category-text">{filteredItems[selectedImage].category}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* NEW BOOKING SECTION */}
      <section id="booking-sectionn" className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#000', fontSize: '3.5rem', fontFamily: 'Playfair Display, serif' }}>
            Book Your Appointment
          </h1>
          <p className="lead" style={{ color: '#6c757d', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Reserve your spot with our master barbers. Follow our simple booking process to secure your preferred time and service.
          </p>
          <br />
          <div className="row justify-content-center" >
            <div className="col-lg-10 col-xl-8" style={{ width: '100%' }}>
              <div className="mb-5">
                <div className="card shadow-lg border-0 rounded-4" style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
                  <div className="card-header bg-white border-0 pt-5 pb-4 px-4 px-md-5">
                    {/* Progress Steps */}
                    <div className="row justify-content-center position-relative">
                      <div className="col-12 px-0">
                        <div className="d-flex align-items-start justify-content-between position-relative px-3 px-md-5">
                          {/* Progress Line */}
                          <div
                            className="position-absolute"
                            style={{
                              height: '3px',
                              backgroundColor: '#f1f3f5',
                              top: '24px',
                              left: '10%',
                              right: '10%',
                              zIndex: 1,
                              borderRadius: '3px'
                            }}
                          >
                            <div
                              className="h-100"
                              style={{
                                backgroundColor: '#daa520',
                                width: `${((currentStep) / 4) * 100}%`,
                                transition: 'width 0.4s ease-in-out',
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                          {stepConfig.map((step, index) => {
                            const isActive = currentStep >= index;
                            const isCurrent = currentStep === index;

                            return (
                              <div key={step.number} className="text-center position-relative" style={{ zIndex: 2, flex: '1', maxWidth: '100px' }}>
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                                  style={{
                                    width: '52px',
                                    height: '52px',
                                    backgroundColor: isActive ? '#daa520' : '#fff',
                                    border: `3px solid ${isActive ? '#daa520' : '#f1f3f5'}`,
                                    color: isActive ? '#fff' : '#adb5bd',
                                    transition: 'all 0.4s ease-in-out',
                                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                                  }}
                                >
                                  <step.icon size={22} />
                                </div>
                                <div className="d-none d-sm-block">
                                  <div
                                    className="fw-bold text-uppercase"
                                    style={{
                                      color: isActive ? '#000' : '#adb5bd',
                                      fontSize: '0.7rem',
                                      letterSpacing: '1px'
                                    }}
                                  >
                                    Step {step.number}
                                  </div>
                                  <div
                                    style={{
                                      color: isActive ? '#6c757d' : '#ced4da',
                                      fontSize: '0.85rem',
                                      marginTop: '4px',
                                      fontWeight: isCurrent ? '600' : '400'
                                    }}
                                  >
                                    {step.title}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4 p-md-5 pt-0">
                    <AnimatePresence mode="wait">
                      {currentStep === 0 && (
                        <motion.div
                          key="step0"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                        >
                          <h5 className="fw-semibold mb-4" style={{ color: '#000' }}>
                            Selected Services
                          </h5>
                          {booking.services.length === 0 ? (
                            <div className="text-center py-5 rounded-4" style={{ backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6' }}>
                              <Scissors className="mx-auto mb-3" style={{ width: '48px', height: '48px', color: '#adb5bd' }} />
                              <h6 style={{ color: '#6c757d' }}>No services selected</h6>
                              <p className="small mb-0" style={{ color: '#adb5bd' }}>
                                Please select services from the options above to continue
                              </p>
                            </div>
                          ) : (
                            <div className="mb-4">
                              {booking.services.map((service) => (
                                <div key={service.id} className="d-flex justify-content-between align-items-center p-4 mb-3 rounded-4 shadow-sm" style={{ backgroundColor: '#fff', borderLeft: '4px solid #daa520' }}>
                                  <div>
                                    <h6 className="fw-medium mb-1" style={{ color: '#000' }}>{service.name}</h6>
                                    <small style={{ color: '#6c757d' }}>{service.duration}</small>
                                  </div>
                                  <span className="fw-bold fs-5" style={{ color: '#daa520' }}>₹ {service.price}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-end mt-5 border-top pt-4">
                            <button
                              onClick={nextStep}
                              disabled={booking.services.length === 0}
                              className="btn px-5 py-2 fw-semibold text-white rounded-pill shadow-sm"
                              style={{ backgroundColor: '#daa520', border: 'none' }}
                            >
                              Continue
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                        >
                          <h5 className="fw-semibold mb-4" style={{ color: '#000' }}>
                            Choose Your Specialist
                          </h5>
                          <div className="row g-4 mb-5">
                            {availableEmployees.map((employee) => {
                              const isSelected = booking.employee?.id === employee.id;
                              return (
                                <div key={employee.id} className="col-md-6">
                                  <div
                                    className={`card h-100 text-center cursor-pointer border-0 rounded-4 ${isSelected ? 'shadow-lg' : 'shadow-sm'}`}
                                    onClick={() => setBooking(prev => ({ ...prev, employee }))}
                                    style={{ 
                                      cursor: 'pointer', 
                                      backgroundColor: '#fff',
                                      border: 'none',
                                      boxShadow: isSelected ? '0 12px 30px rgba(218, 165, 32, 0.25)' : '0 4px 15px rgba(0,0,0,0.05)',
                                      transform: isSelected ? 'translateY(-3px)' : 'none',
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    <div className="card-body p-4">
                                      <div className="d-flex align-items-center gap-4">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                                          style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', width: '64px', height: '64px' }}>
                                          <User style={{ width: '30px', height: '30px', color: '#daa520' }} />
                                        </div>
                                        <div className="flex-grow-1 text-start">
                                          <h6 className="fw-semibold mb-1" style={{ color: '#000', fontSize: '1.1rem' }}>{employee.name}</h6>
                                          <p className="small mb-2" style={{ color: '#6c757d' }}>{employee.speciality}</p>
                                          <div className="d-flex align-items-center gap-1">
                                            <Star style={{ width: '16px', height: '16px', color: '#daa520', fill: '#daa520' }} />
                                            <small className="fw-medium" style={{ color: '#000' }}>{employee.rating}</small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="d-flex justify-content-between mt-5 border-top pt-4">
                            <button 
                              onClick={prevStep} 
                              className="btn px-4 py-2 fw-semibold rounded-pill"
                              style={{ backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6' }}
                            >
                              Previous
                            </button>
                            <button
                              onClick={nextStep}
                              disabled={!booking.employee}
                              className="btn px-5 py-2 fw-semibold text-white rounded-pill shadow-sm"
                              style={{ backgroundColor: '#daa520', border: 'none' }}
                            >
                              Continue
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                        >
                          <h4 className="fw-semibold mb-5" style={{ color: '#000' }}>
                            Choose Date & Time
                          </h4>

                          <div className="row g-5">
                            {/* Date Selection */}
                            <div className="col-lg-5">
                              <h6 className="fw-medium mb-3" style={{ color: '#000' }}>
                                Select Date
                              </h6>
                              <div className="position-relative">
                                <input
                                  type="date"
                                  className="form-control form-control-lg shadow-sm"
                                  value={booking.date}
                                  onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value, time: null }))}
                                  min={new Date().toISOString().split('T')[0]}
                                  style={{
                                    fontSize: '1rem',
                                    padding: '14px 20px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '12px'
                                  }}
                                />
                              </div>
                            </div>

                            {/* Time Selection */}
                            <div className="col-lg-7">
                              <h6 className="fw-medium mb-3" style={{ color: '#000' }}>
                                Available Times
                              </h6>
                              <div className="row g-3">
                                {timeSlots.map((time, index) => {
                                  const selectedDate = booking.date ? new Date(booking.date) : null;
                                  const isPassed = isTimeSlotPassed(time, selectedDate);
                                  const isSelected = booking.time === time;

                                  return (
                                    <div key={time} className="col-6 col-sm-4">
                                      <button
                                        className={`btn w-100 shadow-none ${isSelected ? 'fw-bold' : ''}`}
                                        onClick={() => setBooking(prev => ({ ...prev, time }))}
                                        disabled={isPassed}
                                        style={{
                                          padding: '12px 0',
                                          fontSize: '0.95rem',
                                          border: isSelected ? '2px solid #daa520' : '1px solid #dee2e6',
                                          borderRadius: '12px',
                                          backgroundColor: isSelected ? '#daa520' : '#fff',
                                          color: isSelected ? '#fff' : (isPassed ? '#adb5bd' : '#495057'),
                                          opacity: isPassed ? 0.5 : 1,
                                          transition: 'all 0.3s ease'
                                        }}
                                      >
                                        {time}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                            <button 
                              onClick={prevStep} 
                              className="btn px-4 py-2 fw-semibold rounded-pill"
                              style={{ backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6' }}
                            >
                              Previous
                            </button>
                            <button
                              onClick={nextStep}
                              disabled={!booking.date || !booking.time}
                              className="btn px-5 py-2 fw-semibold text-white rounded-pill shadow-sm"
                              style={{ backgroundColor: '#daa520', border: 'none' }}
                            >
                              Next
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                        >
                          <h4 className="fw-semibold mb-5" style={{ color: '#000' }}>
                            {user ? (booking.location === 'doorstep' ? 'Doorstep Service Details' : 'Booking Confirmation') : 'Your Details'}
                          </h4>
                          
                          {!user ? (
                            // Non-logged-in users: Full details form
                            <div className="row g-4 mb-5">
                              <div className="col-md-6">
                                <label htmlFor="name" className="form-label fw-medium" style={{ color: '#495057' }}>Full Name <span style={{color: '#daa520'}}>*</span></label>
                                <input
                                  id="name"
                                  type="text"
                                  className={`form-control shadow-sm ${showErrors && !booking.customerInfo.name ? 'is-invalid' : ''}`}
                                  value={booking.customerInfo.name}
                                  onChange={(e) => setBooking(prev => ({
                                    ...prev,
                                    customerInfo: { ...prev.customerInfo, name: e.target.value }
                                  }))}
                                  placeholder="Enter your full name"
                                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #dee2e6' }}
                                />
                                {showErrors && !booking.customerInfo.name && (
                                  <div className="invalid-feedback">Please enter your name.</div>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="phone" className="form-label fw-medium" style={{ color: '#495057' }}>Phone Number <span style={{color: '#daa520'}}>*</span></label>
                                <input
                                  id="phone"
                                  type="tel"
                                  className={`form-control shadow-sm ${showErrors && (!booking.customerInfo.phone || !/^[\d\s\-\(\)]+$/.test(booking.customerInfo.phone) || booking.customerInfo.phone.replace(/[^\d]/g, '').length < 10) ? 'is-invalid' : ''}`}
                                  value={booking.customerInfo.phone}
                                  onChange={(e) => setBooking(prev => ({
                                    ...prev,
                                    customerInfo: { ...prev.customerInfo, phone: e.target.value }
                                  }))}
                                  placeholder="Enter your phone number"
                                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #dee2e6' }}
                                />
                                {showErrors && (!booking.customerInfo.phone || !/^[\d\s\-\(\)]+$/.test(booking.customerInfo.phone) || booking.customerInfo.phone.replace(/[^\d]/g, '').length < 10) && (
                                  <div className="invalid-feedback">Please enter a valid phone number.</div>
                                )}
                              </div>
                              <div className="col-12">
                                <label htmlFor="email" className="form-label fw-medium" style={{ color: '#495057' }}>Email Address <span style={{color: '#daa520'}}>*</span></label>
                                <input
                                  id="email"
                                  type="email"
                                  className={`form-control shadow-sm ${showErrors && (!booking.customerInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customerInfo.email)) ? 'is-invalid' : ''}`}
                                  value={booking.customerInfo.email}
                                  onChange={(e) => setBooking(prev => ({
                                    ...prev,
                                    customerInfo: { ...prev.customerInfo, email: e.target.value }
                                  }))}
                                  placeholder="Enter your email address"
                                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #dee2e6' }}
                                />
                                {showErrors && (!booking.customerInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customerInfo.email)) && (
                                  <div className="invalid-feedback">Please enter a valid email address.</div>
                                )}
                              </div>
                              <div className="col-12">
                                <label htmlFor="notes" className="form-label fw-medium" style={{ color: '#495057' }}>Special Notes (Optional)</label>
                                <textarea
                                  id="notes"
                                  className="form-control shadow-sm"
                                  rows="3"
                                  value={booking.customerInfo.notes}
                                  onChange={(e) => setBooking(prev => ({
                                    ...prev,
                                    customerInfo: { ...prev.customerInfo, notes: e.target.value }
                                  }))}
                                  placeholder="Any special requests or notes..."
                                  style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #dee2e6' }}
                                />
                              </div>
                            </div>
                          ) : (
                            // Logged-in users: Only show doorstep address if needed
                            booking.location === 'doorstep' && (
                              <div className="row g-4 mb-5">
                                <div className="col-12">
                                  <label htmlFor="address" className="form-label fw-medium" style={{ color: '#495057' }}>
                                    Service Address <span style={{color: '#daa520'}}>*</span>
                                  </label>
                                  <textarea
                                    id="address"
                                    className={`form-control shadow-sm ${showErrors && !booking.customerInfo.address ? 'is-invalid' : ''}`}
                                    value={booking.customerInfo.address || ''}
                                    onChange={(e) => setBooking(prev => ({
                                      ...prev,
                                      customerInfo: { ...prev.customerInfo, address: e.target.value }
                                    }))}
                                    placeholder="Enter your complete address for doorstep service"
                                    rows="3"
                                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #dee2e6' }}
                                  />
                                  {showErrors && !booking.customerInfo.address && (
                                    <div className="invalid-feedback">Please enter your service address.</div>
                                  )}
                                  <small className="text-muted d-block mt-2">
                                    <MapPin size={14} className="me-1" />
                                    Our specialist will visit this address for your appointment
                                  </small>
                                </div>
                                <div className="col-12">
                                  <label htmlFor="doorstep-notes" className="form-label fw-medium" style={{ color: '#495057' }}>
                                    Special Instructions (Optional)
                                  </label>
                                  <textarea
                                    id="doorstep-notes"
                                    className="form-control shadow-sm"
                                    value={booking.customerInfo.notes || ''}
                                    onChange={(e) => setBooking(prev => ({
                                      ...prev,
                                      customerInfo: { ...prev.customerInfo, notes: e.target.value }
                                    }))}
                                    placeholder="Any landmarks, special instructions for finding your location..."
                                    rows="2"
                                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #dee2e6' }}
                                  />
                                </div>
                              </div>
                            )
                          )}
                          <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                            <button 
                              onClick={prevStep} 
                              className="btn px-4 py-2 fw-semibold rounded-pill"
                              style={{ backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6' }}
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => {
                                if (isStepValid(3)) {
                                  setShowErrors(false);
                                  handlePayment();
                                } else {
                                  setShowErrors(true);
                                }
                              }}
                              className="btn px-5 py-2 fw-semibold text-white rounded-pill shadow-sm"
                              style={{ backgroundColor: '#daa520', border: 'none' }}
                            >
                              Proceed
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                        >
                          <h4 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: '#000' }}>
                            <CheckCircle style={{ width: '28px', height: '28px', color: '#daa520' }} />
                            Booking Confirmation
                          </h4>

                          <div className="row g-4">
                            {/* Services Summary */}
                            <div className="col-12">
                              <h6 className="fw-semibold mb-3 text-uppercase tracking-wider" style={{ color: '#adb5bd', fontSize: '0.85rem', letterSpacing: '1px' }}>Selected Services</h6>
                              <div className="mb-4">
                                {booking.services.map((service) => (
                                  <div key={service.id} className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-4 shadow-sm" style={{ backgroundColor: '#fff', borderLeft: '4px solid #daa520', border: '1px solid #f1f3f5', borderLeftColor: '#daa520' }}>
                                    <div>
                                      <span className="fw-medium" style={{ color: '#000' }}>{service.name}</span>
                                      <small className="ms-2" style={{ color: '#6c757d' }}>({service.duration})</small>
                                    </div>
                                    <span className="fw-bold fs-6" style={{ color: '#daa520' }}>₹ {service.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="col-md-6">
                              <h6 className="fw-semibold mb-3 text-uppercase tracking-wider" style={{ color: '#adb5bd', fontSize: '0.85rem', letterSpacing: '1px' }}>Appointment Details</h6>
                              <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                                <p className="mb-2"><strong style={{ color: '#495057' }}>Date:</strong> <span style={{color: '#000'}}>{new Date(booking.date).toLocaleDateString()}</span></p>
                                <p className="mb-2"><strong style={{ color: '#495057' }}>Time:</strong> <span style={{color: '#000'}}>{booking.time}</span></p>
                                <p className="mb-2"><strong style={{ color: '#495057' }}>Location:</strong> <span style={{color: '#000'}}>{booking.location === 'salon' ? 'Salon' : 'Doorstep Service'}</span></p>
                                <p className="mb-0"><strong style={{ color: '#495057' }}>Specialist:</strong> <span style={{color: '#000'}}>{booking.employee?.name}</span></p>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <h6 className="fw-semibold mb-3 text-uppercase tracking-wider" style={{ color: '#adb5bd', fontSize: '0.85rem', letterSpacing: '1px' }}>Customer Information</h6>
                              <div className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                                <p className="mb-2"><strong style={{ color: '#495057' }}>Name:</strong> <span style={{color: '#000'}}>{booking.customerInfo.name}</span></p>
                                <p className="mb-2"><strong style={{ color: '#495057' }}>Phone:</strong> <span style={{color: '#000'}}>{booking.customerInfo.phone}</span></p>
                                <p className="mb-2"><strong style={{ color: '#495057' }}>Email:</strong> <span style={{color: '#000'}}>{booking.customerInfo.email}</span></p>
                                {booking.customerInfo.notes && (
                                  <p className="mb-0"><strong style={{ color: '#495057' }}>Notes:</strong> <span style={{color: '#000'}}>{booking.customerInfo.notes}</span></p>
                                )}
                              </div>
                            </div>

                            {/* Total */}
                            <div className="col-12 mt-5">
                              <div className="p-4 rounded-4" style={{ backgroundColor: '#fff', border: '2px dashed #daa520' }}>
                                <div className="d-flex justify-content-between mb-2">
                                  <span style={{ color: '#6c757d', fontWeight: '500' }}>Services Total:</span>
                                  <span style={{ color: '#000', fontWeight: '500' }}>
                                    ₹ {booking.services.reduce((sum, service) => sum + service.price, 0)}
                                  </span>
                                </div>
                                {booking.location === 'doorstep' && (
                                  <div className="d-flex justify-content-between mb-3">
                                    <span style={{ color: '#6c757d', fontWeight: '500' }}>Doorstep Service:</span>
                                    <span style={{ color: '#000', fontWeight: '500' }}>₹ 25</span>
                                  </div>
                                )}
                                <div className="d-flex justify-content-between align-items-center h4 fw-bold border-top pt-3 mt-3 mb-0">
                                  <span style={{ color: '#000' }}>Total Amount:</span>
                                  <span style={{ color: '#daa520', fontSize: '1.75rem' }}>₹ {calculateTotal()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                            <button 
                              onClick={prevStep} 
                              className="btn px-4 py-2 fw-semibold rounded-pill"
                              style={{ backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6' }}
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => {
                                handlePayment();
                              }}
                              className="btn px-5 py-2 fw-semibold text-white rounded-pill shadow-lg"
                              style={{ backgroundColor: '#daa520', border: 'none' }}
                            >
                              Confirm Booking
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW Demo Payment Modal */}
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
        showBranchSelect={booking.location === 'salon'}
        showAddressInput={booking.location === 'doorstep'}
        branches={[
          { value: 'gobichettipalayam', label: 'Gobichettipalayam' },
          { value: 'othakkuthirai', label: 'Othakkuthirai' },
        ]}
      />

      {/* Demo Payment Confirmation Modal */}
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
        onDone={() => {
          setShowDemoConfirmation(false);
          // Reset booking state if needed
        }}
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
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"  // Added lazy loading for iframe
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="text-center mt-3">
                <h5 className="fw-bold">
                  <FaScissors className="me-2" />
                  KOVAIS BEAUTY PARLOUR
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
    </motion.div>
  );
};

export default SingleBarberPage;