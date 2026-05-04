import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Modal, Button, Tab, Tabs, Form, InputGroup, } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaDumbbell, FaUsers, FaClock, FaAward, FaTrophy, FaFire } from 'react-icons/fa';
import Swal from "sweetalert2";
import axios from "axios";
import {
  Menu, X, Scissors, ChevronLeft, ChevronRight, Star, Clock, Award,
  User, Sparkles, DollarSign, Users, Calendar, Phone, Mail, CreditCard,
  Check, MapPin, Instagram, Facebook, Twitter, Home, Calendar as CalendarIcon, CheckCircle
} from "lucide-react";
import "./barber.css";
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
  // const [userBookings, setUserBookings] = useState([]);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [location, setLocation] = useState(null); // For GPS coordinates
  const [loadingLocation, setLoadingLocation] = useState(false);

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

  // Get today's date in YYYY-MM-DD format for the date picker
  const today = new Date().toISOString().split('T')[0];

  // // Navigation Items
  // const navItems = [
  //   { name: "Home", href: "#home" },
  //   { name: "Services", href: "#services" },
  //   { name: "About", href: "#about" },
  //   { name: "Gallery", href: "#gallery" },
  //   { name: "Book Now", href: "#booking" },
  //   { name: "Contact", href: "#contact" },
  // ];

  // Hero Slides
  const slides = [
    {
      title: "Premium Barber Experience",
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
    // {
    //   id: 'k2',
    //   category: 'Kids',
    //   name: 'Kids Style Cut',
    //   description: 'Fun and trendy cuts for children',
    //   price: 30,
    //   image: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg',
    //   duration: '45 min'
    // },

    // Funeral Services
    {
      id: 'f1',
      category: 'Funeral',
      name: 'Memorial Grooming',
      description: 'Respectful final preparation service',
      price: 80,
      image: 'https://images.unsplash.com/photo-1675746435874-e72d846bdca5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      duration: '60 min'
    },

    // Function Services
    {
      id: 'fn1',
      category: 'Function',
      name: 'Event Styling',
      description: 'Professional styling for special occasions',
      price: 90,
      image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg',
      duration: '120 min'
    },
    {
      id: 'fn2',
      category: 'Function',
      name: 'Group Styling',
      description: 'Styling services for wedding parties',
      price: 150,
      image: 'https://media.istockphoto.com/id/511777075/photo/teacher-helping-students-training-to-become-hairdressers.jpg?s=612x612&w=0&k=20&c=o1adWObcvGOzxyVxLpw1vfk-7Aav-WAipygsQnWHUhI=',
      duration: '180 min'
    }
  ];

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
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  // Gallery Data
  const galleryItems = [
    { id: 1, image: "https://www.snip.co.in/wp-content/uploads/2025/03/haircuts-for-long-hair-banner.webp", category: "haircuts", title: "Classic Cut" },
    { id: 2, image: "https://thevou.com/wp-content/uploads/2025/02/oval-face-shape-men-beard-styles.jpg", category: "beards", title: "Beard Styling" },
    { id: 3, image: "https://cdn.prod.website-files.com/5cb569e54ca2fddd5451cbb2/5f90d9f6524b4ef970668f66_shaving.jpg", category: "shaves", title: "Traditional Shave" },
    { id: 4, image: "https://5.imimg.com/data5/SELLER/Default/2024/2/390915581/QH/RY/VA/5937917/men-hair-cutting-services-500x500.jpg", category: "haircuts", title: "Modern Style" },
    { id: 5, image: "https://images.squarespace-cdn.com/content/v1/5616c8cde4b0bbc1cabb7c79/1722260249364-2KSRDUK610AJXEZLJU7Y/The+Complete+Beard+Grooming+Guide_+How+To+Trim+A+Beard+%26+Maintain+It+Like+A+Pro.jpeg?format=1500w", category: "beards", title: "Beard Trim" },
    { id: 6, image: "https://static1.squarespace.com/static/6270536f27fa2a2db87d05c3/6270537f27fa2a2db87d0866/67745571a0a37a6c0925dc66/1735680545706/Hot+Towel+Shave.png?format=1500w", category: "shaves", title: "Hot Towel Shave" },
    { id: 7, image: "https://i.ytimg.com/vi/RJp9PSsuL_M/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAtW6soae77-oaPufaJK6HsMpgEGg", category: "haircuts", title: "Fade Cut" },
    { id: 8, image: "https://wimpoleclinic.com/wp-content/uploads/2024/05/7-Low-Maintenance-Full-Beard-Styles-For-Confident-Men.jpg", category: "beards", title: "Full Grooming" },
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

  // New helper functions for booking system
  const getDefaultServices = () => {
    const defaultCategories = ['Men', 'Women', 'Kids'];
    return defaultCategories.map(category =>
      services.find(service => service.category === category)
    ).filter(Boolean);
  };

  const getAvailableCategories = () => {
    if (booking.location === 'salon') {
      return ['Men', 'Women', 'Kids'];
    } else {
      return ['Men', 'Women', 'Kids', 'Funeral', 'Function'];
    }
  };

  const categories = getAvailableCategories();

  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory && categories.includes(service.category))
    : getDefaultServices().filter(service => categories.includes(service.category));

  const availableEmployees = selectedCategory
    ? employees.filter(emp => emp.categories.includes(selectedCategory))
    : employees;

  const handleLocationChange = (location) => {
    setBooking(prev => ({ ...prev, location }));
    // Reset category and services if changing location affects available categories
    if (location === 'salon' && selectedCategory && !['Men', 'Women', 'Kids'].includes(selectedCategory)) {
      setSelectedCategory(null);
      setBooking(prev => ({ ...prev, services: [] }));
    }
  };

  const handleUsePoints = (totalAmount) => {
    const pointsToUse = parseInt(totalAmount);
    setUsedPoints(pointsToUse)

    // const totalAmount = booking.services.reduce(
    //   (total, service) => total + Number(service.amount || 0), 0
    // );

    // if (isNaN(pointsToUse) || pointsToUse <= 0) {
    //   alert("Enter a valid number of points.");
    //   return;
    // }

    // if (pointsToUse > points) {
    //   alert(`You only have ${points} points.`);
    //   return;
    // }

    // if (pointsToUse > totalAmount) {
    //   alert(`You can't use more points than the total price. Total is $${totalAmount}.`);
    //   return;
    // }

    const newPoints = points - pointsToUse;
    const newPrice = amount - pointsToUse;

    setPoints(newPoints);
    setAmount(newPrice);
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

  const calculateTotal = () => {
    const serviceTotal = booking.services.reduce((sum, service) => sum + service.price, 0);
    const doorstepCharge = booking.location === 'doorstep' ? 250 : 0;
    const final = serviceTotal + doorstepCharge;
    return final;
  };

  // Auto update total when booking changes
  // useEffect(() => {
  //   setAmount(calculateTotal());
  // }, [booking]);

  const isStepValid = (step) => {
    switch (step) {
      case 0: return booking.services.length > 0;
      case 1: return booking.employee !== null;
      case 2: return booking.date !== '' && booking.time !== null;
      case 3: return booking.customerInfo.name && booking.customerInfo.phone && booking.customerInfo.email;
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
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

  const stepConfig = [
    { number: 1, title: 'Select Service', icon: User },
    { number: 2, title: 'Choose Specialist', icon: Star },
    { number: 3, title: 'Choose Date & Time', icon: CalendarIcon },
    { number: 4, title: 'Your Details', icon: Phone },
    { number: 5, title: 'Booking Confirmation', icon: CheckCircle }
  ];

  const scrollToBookingApplication = () => {
    const bookingapplication = document.getElementById('booking-sectionn');
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
    if (!userData.username || (isNewUser && !userData.email) || !userData.password) {
      setErrorMessage('All fields are required');
      return;
    }

    setLoading(true);

    // Format data for API
    const formattedData = {
      name: userData.username,
      email: userData.email,
      password: userData.password,
      // Add any other required fields from your formattedData object
    };

    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/create-customer/",
        // "https://8b129c2c4f2f.ngrok-free.app//kovais/create-customer/",
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
        // "https://8b129c2c4f2f.ngrok-free.app//kovais/customer-login/",
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
      // setUrl(response.data.emblem_url);
      // setAadhar(!!response.data.aadhar); // will be true if aadhar exists, false otherwise

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

  //   const handleCloseModal = () => {
  //   setShowModal(false)
  //   setSelectedTime(null)
  // }

  const handleFreeService = () => {
    setShowModal(false); // Close the modal
    postRequest()
  };

  const handlePayupi = () => {
    setShowModal(false)
    postRequest()
  }

  const handlePayment = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      setShowLoginModal(true);
      setShowModal(false);
      return;
    }

    // // Validate doorstep requirements
    // if (booking.services === "Door Step" && !address) {
    //   Swal.fire("Address Required", "Please provide your delivery address", "warning");
    //   return;
    // }

    const user = JSON.parse(loggedInUser);
    setUser(user);
    setShowLoginModal(false);
    setShowModal(true);
  };

  const postRequest = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];

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
      // Add these new fields
      address: address,
      latitude: booking.services === "Door Step" && location ? location.lat : null,
      longitude: booking.services === "Door Step" && location ? location.lng : null
    };

    try {
      const response = await axios.post(
        "https://api.codingboss.in/kovais/saloon/orders/",
        // "https://8b129c2c4f2f.ngrok-free.app/kovais/saloon/orders/",
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log("Success:", response.data);
      Swal.fire({
        title: "Success",
        text: "Your booking is confirmed!",
        icon: "success",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,

      });
      setTimeout(() => {
        navigate("/")
      }, 2000)

    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };


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
            <h2 className="h2 fw-bold mb-5 text-center" style={{ color: '#dc3545', fontFamily: 'Playfair Display, serif', fontSize: '2.7rem' }}>
              Our Premium Services
            </h2>

            {/* Service Location Selection */}
            <div className="mb-5">
              <h3 className="h4 fw-semibold mb-4 text-center" style={{ color: '#000', fontFamily: 'Playfair Display, serif', fontSize: '2.7rem' }}>
                Service Location
              </h3>
              <div className="row justify-content-center g-4">
                <div className="col-md-6 col-lg-4">
                  <div
                    className={`card h-100 text-center cursor-pointer ${booking.location === 'salon' ? 'border-danger border-3 shadow-lg' : 'border-secondary'
                      }`}
                    onClick={() => handleLocationChange('salon')}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      borderColor: booking.location === 'salon' ? '#dc3545' : '#dee2e6'
                    }}
                  >
                    <div className="card-body p-4">
                      <MapPin className="mx-auto mb-3" style={{ width: '48px', height: '48px', color: '#dc3545' }} />
                      <h4 className="fw-semibold mb-2" style={{ color: '#000' }}>Salon Service</h4>
                      <p className="small" style={{ color: '#6c757d' }}>Visit our premium location</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div
                    className={`card h-100 text-center cursor-pointer ${booking.location === 'doorstep' ? 'border-danger border-3 shadow-lg' : 'border-secondary'
                      }`}
                    onClick={() => handleLocationChange('doorstep')}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      borderColor: booking.location === 'doorstep' ? '#dc3545' : '#dee2e6'
                    }}
                  >
                    <div className="card-body p-4">
                      <Home className="mx-auto mb-3" style={{ width: '48px', height: '48px', color: '#dc3545' }} />
                      <h4 className="fw-semibold mb-2" style={{ color: '#000' }}>Doorstep Service</h4>
                      <p className="small" style={{ color: '#6c757d' }}>We come to you (+ ₹250)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn px-4 py-2 ${selectedCategory === category
                      ? 'btn-danger text-white fw-bold'
                      : 'btn-outline-danger'
                    }`}
                  onClick={() => {
                    if (booking.services.length === 0) {
                      setSelectedCategory(category === selectedCategory ? null : category);
                    }
                  }}
                  disabled={booking.services.length > 0 && selectedCategory !== category}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="row g-4">
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
                  <div className={`card h-100 shadow ${booking.services.some(s => s.id === service.id)
                      ? 'border-danger border-3 shadow-lg'
                      : 'border-secondary'
                    }`}
                    style={{
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                    <div className="position-relative overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge" style={{ backgroundColor: '#dc3545', color: '#fff' }}>
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
                        <span className="h4 fw-bold mb-0" style={{ color: '#dc3545' }}>
                          ₹ {service.price}
                        </span>
                        <span className="badge" style={{ backgroundColor: '#6c757d', color: '#fff' }}>
                          {service.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleServiceSelect(service)}
                        className={`btn w-100 ${booking.services.some(s => s.id === service.id)
                            ? 'btn-danger text-white fw-bold'
                            : 'btn-outline-danger'
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
                      loading="lazy"
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
            <div className="col-lg-8 col-xl-6" style={{ maxWidth: '900px', width: '100%' }}>
              <div className="mb-5">
                <div className="card shadow-lg" style={{ backgroundColor: '#fff', borderColor: '#dc3545' }}>
                  <div className="card-header" style={{ backgroundColor: '#dc3545', color: '#fff' }}>
                    <h4 className="card-title d-flex align-items-center gap-2 mb-0">
                      <Scissors style={{ width: '24px', height: '24px' }} />
                      Book Your Appointment
                    </h4>

                    {/* Progress Steps */}
                    <div className="row justify-content-center mt-4">
                      <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between position-relative">
                          {/* Progress Line */}
                          <div
                            className="position-absolute w-100"
                            style={{
                              height: '2px',
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              zIndex: 1
                            }}
                          >
                            <div
                              className="h-100"
                              style={{
                                backgroundColor: '#fff',
                                width: `${((currentStep) / 4) * 100}%`,
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </div>
                          {stepConfig.map((step, index) => {
                            const isActive = currentStep >= index;
                            const isCurrent = currentStep === index;

                            return (
                              <div key={step.number} className="text-center position-relative" style={{ zIndex: 2 }}>
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                                    border: `2px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.5)'}`,
                                    color: isActive ? '#dc3545' : 'rgba(255,255,255,0.7)',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <step.icon size={16} />
                                </div>
                                <div>
                                  <div
                                    className="fw-bold"
                                    style={{
                                      color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                      fontSize: '0.75rem'
                                    }}
                                  >
                                    Step {step.number}
                                  </div>
                                  <div
                                    style={{
                                      color: 'rgba(255,255,255,0.8)',
                                      fontSize: '0.7rem'
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
                  <div className="card-body">
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
                            <div className="text-center py-5">
                              <Scissors className="mx-auto mb-3" style={{ width: '48px', height: '48px', color: '#6c757d' }} />
                              <h6 style={{ color: '#6c757d' }}>No services selected</h6>
                              <p className="small" style={{ color: '#6c757d' }}>
                                Please select services from the options above to continue
                              </p>
                            </div>
                          ) : (
                            <div className="mb-4">
                              {booking.services.map((service) => (
                                <div key={service.id} className="d-flex justify-content-between align-items-center p-3 mb-3 rounded border" style={{ backgroundColor: '#f8f9fa' }}>
                                  <div>
                                    <h6 className="fw-medium mb-1" style={{ color: '#000' }}>{service.name}</h6>
                                    <small style={{ color: '#6c757d' }}>{service.duration}</small>
                                  </div>
                                  <span className="fw-bold" style={{ color: '#dc3545' }}>₹ {service.price}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-end">
                            <button
                              onClick={nextStep}
                              disabled={booking.services.length === 0}
                              className="btn btn-danger text-white fw-bold px-4"
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
                          <div className="row g-3 mb-4">
                            {availableEmployees.map((employee) => (
                              <div key={employee.id} className="col-md-6">
                                <div
                                  className={`card border cursor-pointer ${booking.employee?.id === employee.id
                                      ? 'border-danger border-3 shadow-lg'
                                      : 'border-secondary'
                                    }`}
                                  onClick={() => setBooking(prev => ({ ...prev, employee }))}
                                  style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                                >
                                  <div className="card-body">
                                    <div className="d-flex align-items-center gap-3">
                                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ backgroundColor: '#dc3545', width: '64px', height: '64px' }}>
                                        <User style={{ width: '32px', height: '32px', color: '#fff' }} />
                                      </div>
                                      <div className="flex-grow-1">
                                        <h6 className="fw-semibold mb-1" style={{ color: '#000' }}>{employee.name}</h6>
                                        <p className="small mb-1" style={{ color: '#6c757d' }}>{employee.speciality}</p>
                                        <div className="d-flex align-items-center gap-1">
                                          <Star style={{ width: '16px', height: '16px', color: '#dc3545', fill: '#dc3545' }} />
                                          <small style={{ color: '#dc3545' }}>{employee.rating}</small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="d-flex justify-content-between">
                            <button onClick={prevStep} className="btn btn-outline-danger">
                              Previous
                            </button>
                            <button
                              onClick={nextStep}
                              disabled={!booking.employee}
                              className="btn btn-danger text-white fw-bold px-4"
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
                          <h3 className="text-center fw-bold mb-5" style={{ color: '#000', fontSize: '2rem' }}>
                            Choose Date & Time
                          </h3>

                          <div className="row g-5">
                            {/* Date Selection */}
                            <div className="col-lg-4">
                              <h5 className="fw-semibold mb-4" style={{ color: '#000' }}>
                                Select Date
                              </h5>
                              <div className="position-relative">
                                <input
                                  type="date"
                                  className="form-control form-control-lg"
                                  value={booking.date}
                                  onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value, time: null }))}
                                  min={new Date().toISOString().split('T')[0]}
                                  style={{
                                    fontSize: '1.1rem',
                                    padding: '12px 16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px'
                                  }}
                                />
                              </div>
                            </div>

                            {/* Time Selection */}
                            <div className="col-lg-8">
                              <h5 className="fw-semibold mb-4" style={{ color: '#000' }}>
                                Available Times
                              </h5>
                              <div className="row g-3">
                                {timeSlots.map((time, index) => {
                                  const selectedDate = booking.date ? new Date(booking.date) : null;
                                  const isPassed = isTimeSlotPassed(time, selectedDate);
                                  const isSelected = booking.time === time;

                                  return (
                                    <div key={time} className="col-4">
                                      <button
                                        className={`btn w-100 ${isSelected
                                            ? 'text-white fw-semibold'
                                            : isPassed
                                              ? 'btn-outline-secondary disabled opacity-50'
                                              : 'btn-outline-danger'
                                          }`}
                                        onClick={() => setBooking(prev => ({ ...prev, time }))}
                                        disabled={isPassed}
                                        style={{
                                          padding: '12px 16px',
                                          fontSize: '0.95rem',
                                          borderWidth: '2px',
                                          borderRadius: '8px',
                                          backgroundColor: isSelected ? '#dc3545' : 'transparent',
                                          borderColor: isSelected ? '#dc3545' : '#dc3545',
                                          color: isSelected ? '#fff' : '#dc3545',
                                          transition: 'all 0.2s ease'
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
                          <div className="d-flex justify-content-between mt-5 pt-4">
                            <button
                              onClick={prevStep}
                              className="btn btn-outline-secondary btn-lg px-5"
                              style={{
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '500'
                              }}
                            >
                              Previous
                            </button>
                            <button
                              onClick={nextStep}
                              disabled={!booking.date || !booking.time}
                              className="btn btn-lg px-5 text-white fw-semibold"
                              style={{
                                backgroundColor: '#dc3545',
                                borderColor: '#dc3545',
                                borderRadius: '8px',
                                fontSize: '1.1rem'
                              }}
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
                          <h5 className="fw-semibold mb-4" style={{ color: '#000' }}>
                            Your Details
                          </h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label htmlFor="name" className="form-label" style={{ color: '#000' }}>Full Name *</label>
                              <input
                                id="name"
                                type="text"
                                className="form-control"
                                value={booking.customerInfo.name}
                                onChange={(e) => setBooking(prev => ({
                                  ...prev,
                                  customerInfo: { ...prev.customerInfo, name: e.target.value }
                                }))}
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="phone" className="form-label" style={{ color: '#000' }}>Phone Number *</label>
                              <input
                                id="phone"
                                type="tel"
                                className="form-control"
                                value={booking.customerInfo.phone}
                                onChange={(e) => setBooking(prev => ({
                                  ...prev,
                                  customerInfo: { ...prev.customerInfo, phone: e.target.value }
                                }))}
                                placeholder="Enter your phone number"
                              />
                            </div>
                            <div className="col-12">
                              <label htmlFor="email" className="form-label" style={{ color: '#000' }}>Email Address *</label>
                              <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={booking.customerInfo.email}
                                onChange={(e) => setBooking(prev => ({
                                  ...prev,
                                  customerInfo: { ...prev.customerInfo, email: e.target.value }
                                }))}
                                placeholder="Enter your email address"
                              />
                            </div>
                            <div className="col-12">
                              <label htmlFor="notes" className="form-label" style={{ color: '#000' }}>Special Notes (Optional)</label>
                              <textarea
                                id="notes"
                                className="form-control"
                                rows="3"
                                value={booking.customerInfo.notes}
                                onChange={(e) => setBooking(prev => ({
                                  ...prev,
                                  customerInfo: { ...prev.customerInfo, notes: e.target.value }
                                }))}
                                placeholder="Any special requests or notes..."
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <button onClick={prevStep} className="btn btn-outline-danger">
                              Previous
                            </button>
                            <button
                              onClick={nextStep}
                              disabled={!isStepValid(3)}
                              className="btn btn-danger text-white fw-bold px-4"
                            >
                              Review Booking
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
                          <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: '#000' }}>
                            <CheckCircle style={{ width: '24px', height: '24px', color: '#dc3545' }} />
                            Booking Confirmation
                          </h5>

                          <div className="row g-4">
                            {/* Services Summary */}
                            <div className="col-12">
                              <h6 className="fw-semibold mb-3" style={{ color: '#000' }}>Selected Services</h6>
                              <div className="mb-4">
                                {booking.services.map((service) => (
                                  <div key={service.id} className="d-flex justify-content-between align-items-center p-3 mb-2 rounded border" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div>
                                      <span className="fw-medium" style={{ color: '#000' }}>{service.name}</span>
                                      <small className="ms-2" style={{ color: '#6c757d' }}>({service.duration})</small>
                                    </div>
                                    <span className="fw-bold" style={{ color: '#dc3545' }}>₹ {service.price}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="col-md-6">
                              <h6 className="fw-semibold mb-3" style={{ color: '#000' }}>Appointment Details</h6>
                              <div style={{ color: '#6c757d' }}>
                                <p><strong style={{ color: '#000' }}>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                <p><strong style={{ color: '#000' }}>Time:</strong> {booking.time}</p>
                                <p><strong style={{ color: '#000' }}>Location:</strong> {booking.location === 'salon' ? 'Salon' : 'Doorstep Service'}</p>
                                <p><strong style={{ color: '#000' }}>Specialist:</strong> {booking.employee?.name}</p>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <h6 className="fw-semibold mb-3" style={{ color: '#000' }}>Customer Information</h6>
                              <div style={{ color: '#6c757d' }}>
                                <p><strong style={{ color: '#000' }}>Name:</strong> {booking.customerInfo.name}</p>
                                <p><strong style={{ color: '#000' }}>Phone:</strong> {booking.customerInfo.phone}</p>
                                <p><strong style={{ color: '#000' }}>Email:</strong> {booking.customerInfo.email}</p>
                                {booking.customerInfo.notes && (
                                  <p><strong style={{ color: '#000' }}>Notes:</strong> {booking.customerInfo.notes}</p>
                                )}
                              </div>
                            </div>

                            {/* Total */}
                            <div className="col-12">
                              <div className="border-top pt-4">
                                <div className="d-flex justify-content-between mb-2">
                                  <span style={{ color: '#6c757d' }}>Services Total:</span>
                                  <span style={{ color: '#000' }}>
                                    ₹ {booking.services.reduce((sum, service) => sum + service.price, 0)}
                                  </span>
                                </div>
                                {booking.location === 'doorstep' && (
                                  <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: '#6c757d' }}>Doorstep Service:</span>
                                    <span style={{ color: '#000' }}>₹ 25</span>
                                  </div>
                                )}
                                <div className="d-flex justify-content-between h4 fw-bold border-top pt-2">
                                  <span style={{ color: '#000' }}>Total Amount:</span>
                                  <span style={{ color: '#dc3545' }}>₹ {calculateTotal()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between mt-4">
                            <button onClick={prevStep} className="btn btn-outline-danger">
                              Previous
                            </button>
                            <button
                              onClick={() => {
                                // Reset form
                                // setBooking({
                                //   services: [],
                                //   location: 'salon',
                                //   employee: null,
                                //   date: '',
                                //   time: null,
                                //   customerInfo: { name: '', phone: '', email: '', notes: '' }
                                // });
                                // setCurrentStep(0);
                                // setSelectedCategory(null);
                                // alert("Booking Confirmed! We'll send you a confirmation email shortly.");
                                handlePayment()
                              }}
                              className="btn btn-danger text-white fw-bold px-4"
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

      {/* Modal Popup for Payment Options */}
      <Modal show={showModal} onHide={handleClicked} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold">Payment Options</Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {/* Order Summary Section */}
          <div className="order-summary mb-4 p-3 bg-light rounded">
            <h5 className="mb-3 border-bottom pb-2">Order Summary</h5>
          </div>

          {/* Location Selection Section */}
          {booking.location?.toLowerCase() === "salon" && (
            <div className="location-section mb-4">
              <Form.Group>
                <Form.Label className="fw-bold">Select Shop Location</Form.Label>
                <Form.Select
                  value={shopLocation}
                  onChange={(e) => setShopLocation(e.target.value)}
                  required
                  className="form-select-lg"
                >
                  <option value="">-- Select Shop Location --</option>
                  <option value="Gobichettipallayam">Gobichettipallayam</option>
                  <option value="Otthakkuthirai">Otthakkuthirai</option>
                </Form.Select>
              </Form.Group>
            </div>
          )}

          {booking.location?.toLowerCase() === "doorstep" && (
            <div className="address-section mb-4">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Delivery Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter full address with landmarks"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="mb-2"
                />
              </Form.Group>

              <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center w-100"
                onClick={async () => {
                  setLoadingLocation(true);
                  if (!navigator.geolocation) {
                    Swal.fire({
                      icon: "error",
                      title: "Unsupported",
                      text: "Geolocation is not supported by your browser."
                    });
                    setLoadingLocation(false);
                    return;
                  }

                  try {
                    const getPosition = () =>
                      new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                          enableHighAccuracy: true,
                          timeout: 10000,
                          maximumAge: 0,
                        });
                      });

                    const position = await getPosition();
                    const { latitude: lat, longitude: lng, accuracy } = position.coords;

                    setLocation({ lat, lng });

                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`
                    );
                    const data = await response.json();
                    const addr = data.address || {};
                    let detailedAddress = [
                      addr.house_number,
                      addr.road,
                      addr.suburb || addr.neighbourhood,
                      addr.city || addr.town || addr.village,
                      addr.county,
                      addr.state,
                      addr.postcode,
                      addr.country,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    if (!detailedAddress.trim()) {
                      detailedAddress = data.display_name || `Lat: ${lat}, Lng: ${lng}`;
                    }

                    setAddress(`${detailedAddress} (Accuracy: ~${Math.round(accuracy)}m)`);
                  } catch (error) {
                    console.error("Geolocation/Geocoding Error:", error);
                    Swal.fire({
                      icon: "error",
                      title: "Location Error",
                      text: "We couldn't fetch your exact address. Please enter it manually."
                    });
                  } finally {
                    setLoadingLocation(false);
                  }
                }}
              >
                {loadingLocation ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Fetching Location...
                  </>
                ) : (
                  <>
                    <i className="fas fa-map-marker-alt me-2" />
                    Use Current Location
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Points Section - Updated UI */}
          <div className="points-section mb-4">
            <h5 className="mb-3 border-bottom pb-2">Use Reward Points</h5>
            <div className="d-flex">
              <div className="flex-grow-1 me-2">
                <div className="input-group">
                  <span className="input-group-text">Points</span>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Enter points"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                <small className="text-muted mt-1 d-block">Available: {points} points</small>
              </div>
              <Button
                variant="success"
                onClick={() => handleUsePoints(value, amount)}
                className="px-4"
                disabled={!value || parseInt(value) <= 0}
              >
                Apply
              </Button>
            </div>
            {usedPoints > 0 && (
              <div className="alert alert-success mt-2 py-2">
                <small><i className="fas fa-check-circle me-1"></i> {usedPoints} points applied (₹{usedPoints} discount)</small>
              </div>
            )}
          </div>

          {/* Payment Options Section */}
          <div className="payment-options">
            <h5 className="mb-3 border-bottom pb-2">Select Payment Method</h5>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Button
                  variant="outline-primary"
                  className="w-100 py-3 d-flex flex-column align-items-center justify-content-center"
                  onClick={() => {
                    setStatus("pending");
                    setPaytype("offline");
                    // Example UPI deep link
                    const upiLink = `upi://pay?pa=merchant@upi&pn=Your%20Merchant%20Name&mc=1234&tid=TXN123456&tr=ORDER123&tn=Service%20Payment&am=100&cu=INR`;

                    // Redirect to UPI app
                    window.location.href = upiLink;
                  }}
                >
                  <i className="fas fa-store mb-2 fs-4"></i>
                  <span>Book Now, Pay Later</span>
                  <small className="text-muted">Pay ₹0 now</small>
                </Button>
              </Col>
              <Col xs={12} md={6}>
                <Button
                  variant="primary"
                  className="w-100 py-3 d-flex flex-column align-items-center justify-content-center"
                  onClick={() => {
                    setStatus("completed");
                    setPaytype("online");
                  }}
                >
                  <i className="fas fa-mobile-alt mb-2 fs-4"></i>
                  <span>Pay Now with UPI</span>
                  <small>Secure payment • ₹ {amount}</small>
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>


      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
      // className="auth-modal"
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

          {/* Form Fields */}
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

            {/* Email Field (Only for Signup) */}
            {isNewUser && (
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaEnvelope className="text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    value={userData.email || ""}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    placeholder="Email address"
                    className="border-start-0"
                  />
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

            {/* Error Message */}
            {errorMessage && (
              <div className="alert alert-danger py-2" role="alert">
                {errorMessage}
              </div>
            )}

            {/* Main Action Button */}
            <Button
              variant="primary"
              onClick={isNewUser ? signUp : loginUser}
              disabled={loading}
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

            {/* Social Login Options */}
            <div className="text-center mb-3">
              <p className="text-muted position-relative my-3">
                <span className="bg-white px-2 position-relative" style={{ zIndex: 1 }}>
                  Or continue with
                </span>
                <hr className="position-absolute top-50 start-0 end-0 m-0" style={{ zIndex: 0 }} />
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-secondary" className="rounded-circle p-2">
                  <FaGoogle />
                </Button>
                <Button variant="outline-secondary" className="rounded-circle p-2">
                  <FaFacebook />
                </Button>
              </div>
            </div>

            {/* Terms & Privacy */}
            {isNewUser && (
              <p className="text-muted text-center small mt-4">
                By signing up, you agree to our <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>.
              </p>
            )}
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
    </motion.div>
  );
};

export default SingleBarberPage;