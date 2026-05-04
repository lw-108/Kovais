import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Modal, Button, Tab, Tabs, Form, InputGroup } from 'react-bootstrap';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPhoneAlt } from 'react-icons/fa';
import { Clock, Sparkles, Star, Heart, Shield, Award, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { PaymentPage, ConfirmationPage } from '../components/Payment';
import './parlour.css';

const Parlour = ({ user, setUser, points, setPoints }) => {
  // ─── STATE ───
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Booking state
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [amount, setAmount] = useState(0);
  const [usedPoints, setUsedPoints] = useState();
  const [status, setStatus] = useState('');
  const [paytype, setPaytype] = useState('');

  // Auth state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ username: '', phone_number: '', password: '' });

  // Payment state
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [showDemoConfirmation, setShowDemoConfirmation] = useState(false);
  const [demoPaymentResult, setDemoPaymentResult] = useState(null);

  // ─── DATA ───
  const categories = ['All', 'Hair Care', 'Skin Care', 'Makeup', 'Nail Art', 'Bridal'];

  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      title: 'Discover Your',
      titleHighlight: 'True Beauty',
    },
    {
      image: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      title: 'Premium',
      titleHighlight: 'Care & Style',
    },
    {
      image: 'https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      title: 'Expert',
      titleHighlight: 'Beauty Services',
    },
  ];

  const products = [
    // Hair Care
    {
      id: 'h1', category: 'Hair Care', name: 'Luxury Hair Spa',
      description: 'Deep conditioning treatment with premium oils and hot towel therapy to nourish and rejuvenate your hair from root to tip.',
      fullDescription: 'Our Luxury Hair Spa combines the power of Argan oil, Keratin proteins, and gentle steam therapy. Your hair will be cleansed, deeply conditioned, and styled to perfection. Includes scalp massage and hot towel wrap.',
      price: 1500, duration: '90 min', rating: 4.9,
      image: 'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Deep Conditioning', 'Scalp Massage', 'Hot Towel Therapy', 'Argan Oil Treatment', 'Style & Blow Dry', 'Split End Repair'],
    },
    {
      id: 'h2', category: 'Hair Care', name: 'Keratin Treatment',
      description: 'Professional keratin smoothing treatment for frizz-free, silky straight hair that lasts up to 3 months.',
      fullDescription: 'Transform your hair with our premium Brazilian Keratin Treatment. This salon-grade formula eliminates frizz, adds brilliant shine, and makes your hair manageable for months. Safe for colored hair.',
      price: 3500, duration: '180 min', rating: 4.8,
      image: 'https://images.pexels.com/photos/3993310/pexels-photo-3993310.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Frizz Elimination', 'Lasting 3 Months', 'Brilliant Shine', 'Safe for Colored Hair', 'Heat Protection', 'Protein Infusion'],
    },
    {
      id: 'h3', category: 'Hair Care', name: 'Hair Coloring',
      description: 'Expert hair coloring with ammonia-free products. Balayage, highlights, or full color — tailored to your style.',
      fullDescription: 'Our color experts use only premium ammonia-free products to deliver beautiful, long-lasting results. Choose from balayage, ombré, highlights, or full coverage. Includes a color consultation and aftercare kit.',
      price: 2500, duration: '120 min', rating: 4.7,
      image: 'https://images.pexels.com/photos/3993435/pexels-photo-3993435.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Ammonia-Free', 'Color Consultation', 'Aftercare Kit', 'Multiple Techniques', 'Long-Lasting', 'Scalp Protection'],
    },
    {
      id: 'h4', category: 'Hair Care', name: 'Deep Conditioning',
      description: 'Intensive moisture repair mask with natural extracts to restore dry and damaged hair.',
      fullDescription: 'Our Deep Conditioning treatment uses botanical extracts and advanced proteins to repair and restore even the most damaged hair. Includes steam therapy for maximum absorption.',
      price: 800, duration: '45 min', rating: 4.6,
      image: 'https://images.pexels.com/photos/3993398/pexels-photo-3993398.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Moisture Repair', 'Botanical Extracts', 'Steam Therapy', 'Damage Control', 'Natural Ingredients', 'UV Protection'],
    },

    // Skin Care
    {
      id: 's1', category: 'Skin Care', name: 'Gold Facial',
      description: 'Luxurious 24K gold facial that deeply nourishes, brightens, and tightens skin for a radiant glow.',
      fullDescription: 'Experience the ultimate luxury with our 24K Gold Facial. Gold particles penetrate deep into the skin to boost collagen production, reduce wrinkles, and give you a luminous, youthful glow. Includes face massage and gold mask.',
      price: 2000, duration: '75 min', rating: 4.9,
      image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['24K Gold Particles', 'Collagen Boost', 'Anti-Wrinkle', 'Face Massage', 'Gold Mask', 'Sun Protection'],
    },
    {
      id: 's2', category: 'Skin Care', name: 'Fruit Facial',
      description: 'Natural fruit extract facial that cleanses, exfoliates, and revitalizes dull skin with vitamins.',
      fullDescription: 'Harness the power of nature with our Fruit Facial. Rich in Vitamin C, antioxidants, and natural AHAs from fresh fruit extracts, this facial exfoliates dead cells, brightens skin tone, and provides deep hydration.',
      price: 1200, duration: '60 min', rating: 4.7,
      image: 'https://images.pexels.com/photos/3997983/pexels-photo-3997983.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Vitamin C Rich', 'Natural AHAs', 'Deep Exfoliation', 'Skin Brightening', 'Hydration Boost', 'Anti-Oxidant'],
    },
    {
      id: 's3', category: 'Skin Care', name: 'De-Tan Treatment',
      description: 'Professional de-tanning facial and body treatment to remove sun damage and restore even skin tone.',
      fullDescription: 'Our comprehensive De-Tan Treatment removes stubborn tan lines and sun damage using professional-grade formulas with kojic acid, licorice extract, and vitamin E. Suitable for face, neck, and body.',
      price: 1500, duration: '90 min', rating: 4.6,
      image: 'https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Tan Removal', 'Even Skin Tone', 'Kojic Acid', 'UV Repair', 'Full Body Option', 'Lasting Results'],
    },
    {
      id: 's4', category: 'Skin Care', name: 'Anti-Aging Facial',
      description: 'Advanced anti-aging facial with retinol and peptide serums to reduce fine lines and firm skin.',
      fullDescription: 'Turn back time with our Advanced Anti-Aging Facial. Combining medical-grade retinol, peptide serums, and hyaluronic acid, this treatment visibly reduces fine lines, firms sagging skin, and restores youthful elasticity.',
      price: 2500, duration: '90 min', rating: 4.8,
      image: 'https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Retinol Treatment', 'Peptide Serums', 'Wrinkle Reduction', 'Skin Firming', 'Hyaluronic Acid', 'Collagen Boost'],
    },

    // Makeup
    {
      id: 'm1', category: 'Makeup', name: 'Bridal Makeup',
      description: 'Complete bridal makeup with HD finish, including hairstyling and draping assistance for your special day.',
      fullDescription: 'Your wedding day deserves perfection. Our expert bridal makeup artists use high-definition, long-lasting products to create a flawless look. Includes trial session, day-of makeup, hairstyling, dupatta draping, and touch-up kit.',
      price: 15000, duration: '240 min', rating: 5.0,
      image: 'https://images.pexels.com/photos/2442900/pexels-photo-2442900.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['HD Finish', 'Trial Session', 'Hairstyling', 'Draping Assist', 'Touch-up Kit', 'Long-Lasting'],
    },
    {
      id: 'm2', category: 'Makeup', name: 'Party Makeup',
      description: 'Glamorous party-ready makeup with defined eyes, contouring, and a flawless camera-ready finish.',
      fullDescription: 'Get party-ready with our glamorous makeup service. Features professional contouring, smoky or dramatic eye looks, and a luminous finish that photographs beautifully. Includes lash application.',
      price: 3000, duration: '90 min', rating: 4.8,
      image: 'https://images.pexels.com/photos/2661256/pexels-photo-2661256.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Professional Contour', 'Eye Makeup', 'Camera-Ready', 'Lash Application', 'Lip Styling', 'Setting Spray'],
    },
    {
      id: 'm3', category: 'Makeup', name: 'HD Makeup',
      description: 'High-definition airbrush makeup for a naturally flawless, pore-minimizing, photo-perfect look.',
      fullDescription: 'Our HD Makeup uses airbrush technology to deliver a seamless, pore-minimizing finish that looks stunning both in person and on camera. Water-resistant formula lasts all day without touch-ups.',
      price: 5000, duration: '120 min', rating: 4.9,
      image: 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Airbrush Tech', 'Pore Minimizing', 'Water Resistant', 'All-Day Wear', 'Photo Perfect', 'No Touch-ups'],
    },
    {
      id: 'm4', category: 'Makeup', name: 'Airbrush Makeup',
      description: 'Professional airbrush application for a smooth, ultra-fine, weightless makeup experience.',
      fullDescription: 'Experience the gold standard of makeup application. Our airbrush technique sprays a fine mist of foundation, blush, and highlighter for an incredibly smooth, natural finish that feels weightless.',
      price: 4500, duration: '100 min', rating: 4.8,
      image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Fine Mist Application', 'Weightless Feel', 'Natural Finish', 'Buildable Coverage', 'Long-Wear Formula', 'Skin-Friendly'],
    },

    // Nail Art
    {
      id: 'n1', category: 'Nail Art', name: 'Gel Nails',
      description: 'Chip-resistant gel nail polish application with UV curing for a glossy, long-lasting manicure.',
      fullDescription: 'Get salon-quality gel nails that last 2-3 weeks without chipping. Our gel polish is applied in thin layers and cured under UV light for a high-gloss, durable finish. Includes nail prep and cuticle care.',
      price: 1200, duration: '60 min', rating: 4.7,
      image: 'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['2-3 Week Wear', 'UV Cured', 'High Gloss', 'Chip Resistant', 'Cuticle Care', 'Color Options 50+'],
    },
    {
      id: 'n2', category: 'Nail Art', name: 'Acrylic Extensions',
      description: 'Custom acrylic nail extensions sculpted to your desired length and shape for stunning nails.',
      fullDescription: 'Transform your nails with custom acrylic extensions. Our nail technicians expertly sculpt each nail to your preferred shape — coffin, stiletto, almond, or square — with durable acrylic that lasts weeks.',
      price: 2000, duration: '90 min', rating: 4.8,
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Custom Length', 'Multiple Shapes', 'Strong & Durable', 'Natural Look', 'Fill-in Friendly', 'Art-Ready Surface'],
    },
    {
      id: 'n3', category: 'Nail Art', name: 'Nail Art Design',
      description: 'Freehand nail art designs with gems, glitter, and 3D elements for truly unique statement nails.',
      fullDescription: 'Express yourself with our custom nail art services. From minimalist geometric designs to elaborate 3D nail art with gems, foils, and chrome effects, our artists create wearable masterpieces.',
      price: 1800, duration: '75 min', rating: 4.9,
      image: 'https://images.pexels.com/photos/3997385/pexels-photo-3997385.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Custom Designs', '3D Elements', 'Gem & Glitter', 'Chrome Effects', 'Hand-Painted', 'Trend-Setting'],
    },
    {
      id: 'n4', category: 'Nail Art', name: 'Luxury Mani-Pedi',
      description: 'Complete luxury manicure and pedicure with exfoliation, mask, and relaxing hand & foot massage.',
      fullDescription: 'Pamper your hands and feet with our luxury mani-pedi combo. Includes warm soak, exfoliation, hydrating mask, cuticle grooming, shaping, and a relaxing massage with premium lotions. Polish of your choice.',
      price: 1500, duration: '90 min', rating: 4.7,
      image: 'https://images.pexels.com/photos/3997394/pexels-photo-3997394.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Hand & Foot Soak', 'Exfoliation', 'Hydrating Mask', 'Massage', 'Nail Shaping', 'Polish Included'],
    },

    // Bridal
    {
      id: 'b1', category: 'Bridal', name: 'Complete Bridal Package',
      description: 'All-inclusive bridal beauty package: makeup, hairstyling, mehndi, pre-bridal treatments, and draping.',
      fullDescription: 'Our most comprehensive bridal offering covers everything for your big day. Includes 3 pre-bridal facial sessions, full body polishing, bridal makeup with trial, hairstyling, mehndi, dupatta draping, and a personal attendant.',
      price: 35000, duration: 'Full Day', rating: 5.0,
      image: 'https://images.pexels.com/photos/2442904/pexels-photo-2442904.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Complete Package', 'Trial Session', '3 Pre-Bridal Facials', 'Body Polish', 'Mehndi', 'Personal Attendant'],
    },
    {
      id: 'b2', category: 'Bridal', name: 'Pre-Bridal Package',
      description: 'Month-long pre-bridal beauty regimen with facials, body treatments, and skin preparation sessions.',
      fullDescription: 'Start your bridal journey a month early with our Pre-Bridal Package. Includes 4 weekly facial sessions, 2 full-body polishing treatments, de-tan sessions, waxing, threading, and a personalized skincare plan.',
      price: 18000, duration: '4 Sessions', rating: 4.9,
      image: 'https://images.pexels.com/photos/3993468/pexels-photo-3993468.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['4 Weekly Facials', 'Body Polishing', 'De-Tan Sessions', 'Waxing & Threading', 'Skincare Plan', 'Bridal Glow'],
    },
    {
      id: 'b3', category: 'Bridal', name: 'Mehndi Design',
      description: 'Intricate bridal mehndi designs by master artists, featuring traditional and contemporary patterns.',
      fullDescription: 'Our master mehndi artists create breathtaking designs that tell your love story. Choose from traditional Rajasthani, Arabic, contemporary fusion, or custom designs. Uses premium organic mehndi for rich, dark color.',
      price: 5000, duration: '180 min', rating: 4.8,
      image: 'https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Master Artists', 'Organic Mehndi', 'Custom Designs', 'Dark Color Guarantee', 'Full Hands & Feet', 'Traditional & Modern'],
    },
    {
      id: 'b4', category: 'Bridal', name: 'Engagement Look',
      description: 'Stunning engagement-ready look with elegant makeup, hairstyling, and accessory coordination.',
      fullDescription: 'Look picture-perfect for your engagement with our specially curated look. Includes soft glam or bold makeup (your choice), professional hairstyling, accessory coordination, and a mini touch-up kit for the evening.',
      price: 8000, duration: '150 min', rating: 4.9,
      image: 'https://images.pexels.com/photos/2442893/pexels-photo-2442893.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Engagement Styling', 'Makeup + Hair', 'Accessory Coordination', 'Touch-up Kit', 'Photo-Ready', 'Style Consultation'],
    },
  ];

  const whyChooseUs = [
    { icon: <Sparkles size={24} />, title: 'Premium Products', desc: 'We only use internationally acclaimed, dermatologically tested products.' },
    { icon: <Star size={24} />, title: 'Expert Stylists', desc: 'Our certified professionals have 10+ years of experience in beauty & wellness.' },
    { icon: <Heart size={24} />, title: 'Personalized Care', desc: 'Every treatment is customized to your skin type, hair texture, and preferences.' },
    { icon: <Shield size={24} />, title: 'Hygiene First', desc: 'Sterilized tools, disposable supplies, and sanitized workstations — always.' },
  ];

  // ─── EFFECTS ───
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // ─── FILTERING ───
  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter((p) => p.category === activeFilter);

  const getCategoryCount = (cat) => {
    if (cat === 'All') return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  // ─── HANDLERS ───
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const scrollToProducts = () => {
    const section = document.getElementById('parlour-products');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookService = (product) => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    setSelectedServices([product]);
    setAmount(product.price);

    if (!loggedInUser) {
      setShowLoginModal(true);
      setShowDetailModal(false);
      return;
    }

    const parsed = JSON.parse(loggedInUser);
    setUser(parsed);
    setShowDetailModal(false);
    setShowDemoPayment(true);
  };

  // Payment handlers
  const handleDemoPaymentSuccess = (result) => {
    setDemoPaymentResult(result);
    setShowDemoPayment(false);
    setStatus('completed');
    setPaytype('online');
    parlourRequest();
    setTimeout(() => setShowDemoConfirmation(true), 500);
  };

  const handleDemoPaymentFailure = (error) => {
    console.log('Payment failed:', error);
  };

  const handleDemoBookNowPayLater = (info) => {
    setStatus('pending');
    setPaytype('offline');
    setShowDemoPayment(false);
    parlourRequest();
    setTimeout(() => {
      setDemoPaymentResult({ paymentMethod: 'offline', amount });
      setShowDemoConfirmation(true);
    }, 500);
  };

  const parlourRequest = async () => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const data = {
      category: selectedServices[0]?.category || 'General',
      services: selectedServices.map((s) => s.name).join(', '),
      amount: amount || selectedServices.reduce((total, s) => total + Number(s.price || 0), 0),
      date: formattedDate,
      time: selectedTime || '10:00 AM',
      payment_status: status,
      payment_type: paytype,
      customer_id: user?.user_id,
      status: 'booked',
      customer_name: user?.username,
      points: usedPoints,
    };

    try {
      await axios.post('https://api.codingboss.in/kovais/spa/orders/', data, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' });
    }
  };

  // Auth handlers
  const signUp = async () => {
    if (!userData.username || (isNewUser && !userData.phone_number) || !userData.password) {
      setErrorMessage('All fields are required');
      return;
    }
    setLoading(true);
    const formattedData = { name: userData.username, phone_number: userData.phone_number, password: userData.password };
    try {
      await axios.post('https://api.codingboss.in/kovais/create-customer/', formattedData, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      localStorage.setItem('signedUpUser', JSON.stringify(formattedData));
      setErrorMessage('');
      setTimeout(() => {
        setIsNewUser(false);
        setLoading(false);
        Swal.fire({ icon: 'success', title: 'Account Created!', text: 'Please sign in with your new account' });
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Sign-Up Failed. Please try again.';
      setErrorMessage(errorMsg);
      Swal.fire({ icon: 'error', title: 'Signup Failed', text: errorMsg });
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
      const response = await axios.post('https://api.codingboss.in/kovais/customer-login/', {
        username: userData.username,
        password: userData.password,
      }, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      localStorage.setItem('loggedInUser', JSON.stringify(response.data));
      localStorage.setItem('currentUserId', JSON.stringify(response.data.user_id));
      if (response.data.emblem_url || response.data.points) {
        localStorage.setItem('url', JSON.stringify(response.data.emblem_url));
        localStorage.setItem(`points_${response.data.user_id}`, JSON.stringify(response.data.points));
      }
      setUser(response.data);
      setPoints(response.data.points);
      Swal.fire({ icon: 'success', title: 'Login Successful!', timer: 1500, showConfirmButton: false });
      setTimeout(() => {
        setErrorMessage('');
        setShowLoginModal(false);
        setShowDemoPayment(true);
      }, 500);
    } catch (error) {
      const errorMsg = error.response?.data?.login || error.response?.data?.message || 'Invalid credentials. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setUserData({ ...userData, phone_number: value });
    if (isNewUser) validatePhoneNumber(value);
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

  const handleSignUpClick = () => {
    if (isNewUser) {
      const phoneValid = validatePhoneNumber(userData.phone_number);
      if (phoneValid && userData.username && userData.password) signUp();
    } else {
      signUp();
    }
  };

  const handleTabSelect = (key) => {
    setIsNewUser(key === 'signup');
    setErrorMessage('');
  };

  const isButtonDisabled = loading || (isNewUser && !!phoneError);

  // ─── ANIMATION VARIANTS ───
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
  };

  // ─── RENDER ───
  return (
    <div className="parlour-page">
      {/* ═══ HERO ═══ */}
      <section className="parlour-hero">
        <div className="parlour-hero-bg">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`parlour-hero-img ${i === currentHeroSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className="parlour-hero-overlay" />
        </div>

        <div className="parlour-floating-elements">
          {['💄', '✨', '💅', '🌸', '💎', '🪷'].map((emoji, i) => (
            <span key={i} className="parlour-float-el">{emoji}</span>
          ))}
        </div>

        <motion.div
          className="parlour-hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="parlour-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="parlour-hero-badge-dot" />
            Kovais Beauty Parlour
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={currentHeroSlide}
              className="parlour-hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {heroSlides[currentHeroSlide].title}{' '}
              <em>{heroSlides[currentHeroSlide].titleHighlight}</em>
            </motion.h1>
          </AnimatePresence>

          <motion.p
            className="parlour-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Premium beauty services tailored to your unique style. From hair transformations to bridal perfection — experience luxury redefined.
          </motion.p>

          <motion.div
            className="parlour-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button className="parlour-btn-primary" onClick={scrollToProducts}>
              Explore Services
            </button>
            <button className="parlour-btn-secondary" onClick={scrollToProducts}>
              View Pricing
            </button>
          </motion.div>
        </motion.div>

        <div className="parlour-hero-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`parlour-hero-dot ${i === currentHeroSlide ? 'active' : ''}`}
              onClick={() => setCurrentHeroSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="parlour-marquee">
        <div className="parlour-marquee-track">
          {[...Array(2)].map((_, ri) =>
            ['Hair Care', 'Skin Care', 'Makeup', 'Nail Art', 'Bridal Packages', 'Premium Products'].map((item, i) => (
              <span key={`${ri}-${i}`} className="parlour-marquee-item">
                <span className="parlour-marquee-dot">◆</span> {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ═══ FILTER + PRODUCTS ═══ */}
      <section className="parlour-filter-section" id="parlour-products">
        <Container>
          <div className="parlour-section-header">
            <span className="parlour-section-tag">Our Collection</span>
            <h2 className="parlour-section-title">
              Premium <span className="accent">Services</span>
            </h2>
            <p className="parlour-section-subtitle">
              Explore our curated range of beauty treatments designed to make you look and feel extraordinary
            </p>
          </div>

          <div className="parlour-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`parlour-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
                <span className="filter-count">{getCategoryCount(cat)}</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section className="parlour-products-section">
        <div className="parlour-results-bar">
          <p className="parlour-results-count">
            Showing <strong>{filteredProducts.length}</strong> {activeFilter === 'All' ? 'services' : `${activeFilter} services`}
          </p>
        </div>

        <motion.div className="parlour-products-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="parlour-product-card"
                variants={cardVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                onClick={() => handleProductClick(product)}
              >
                <div className="parlour-card-img-wrap">
                  <img src={product.image} alt={product.name} className="parlour-card-img" loading="lazy" />
                  <span className="parlour-card-category-badge">{product.category}</span>
                  <span className="parlour-card-price-badge">₹{product.price.toLocaleString()}</span>
                  <div className="parlour-card-overlay" />
                </div>
                <div className="parlour-card-body">
                  <h4 className="parlour-card-title">{product.name}</h4>
                  <p className="parlour-card-desc">{product.description}</p>
                  <div className="parlour-card-meta">
                    <span className="parlour-card-duration">
                      <Clock size={14} />
                      {product.duration}
                    </span>
                    <button
                      className="parlour-card-book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookService(product);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="parlour-empty-state">
            <div className="parlour-empty-icon">💄</div>
            <h4 className="parlour-empty-title">No Services Found</h4>
            <p className="parlour-empty-desc">Try selecting a different category to explore our services.</p>
          </div>
        )}
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="parlour-why-section">
        <Container>
          <div className="parlour-section-header">
            <span className="parlour-section-tag">Why Kovais</span>
            <h2 className="parlour-section-title">
              Why Choose <span className="accent">Us</span>
            </h2>
            <p className="parlour-section-subtitle">
              We combine expertise, premium products, and personalized care to deliver results that exceed expectations
            </p>
          </div>
        </Container>

        <div className="parlour-why-grid">
          {whyChooseUs.map((item, i) => (
            <motion.div
              key={i}
              className="parlour-why-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
            >
              <div className="parlour-why-icon">{item.icon}</div>
              <h5 className="parlour-why-title">{item.title}</h5>
              <p className="parlour-why-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="parlour-cta-section">
        <motion.div
          className="parlour-cta-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="parlour-cta-eyebrow">Your Beauty Journey Starts Here</span>
          <h2 className="parlour-cta-title">
            Ready to Experience <br />True <em>Kovais</em> Luxury?
          </h2>
          <p className="parlour-cta-desc">
            Book your appointment today and let our expert stylists transform your look.
            Premium beauty, personalized for you.
          </p>
          <div className="parlour-cta-buttons">
            <button className="parlour-btn-primary" onClick={scrollToProducts}>
              Browse Services
            </button>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="parlour-footer">
        <p>&copy; {new Date().getFullYear()} KOVAIS Beauty Parlour. All Rights Reserved. | Contact: <a href="tel:9234567891" style={{ color: 'inherit', textDecoration: 'none' }}>9234567891</a> | Email: <a href="mailto:info@kovaisbeauty.com" style={{ color: 'inherit', textDecoration: 'none' }}>info@kovaisbeauty.com</a></p>
      </footer>

      {/* ═══ SERVICE DETAIL MODAL ═══ */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        size="lg"
        className="parlour-modal"
      >
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="parlour-modal-image" />
              <div className="parlour-modal-details">
                <span className="parlour-modal-category">{selectedProduct.category}</span>
                <h3 className="parlour-modal-title">{selectedProduct.name}</h3>
                <p className="parlour-modal-desc">{selectedProduct.fullDescription}</p>

                <div className="parlour-modal-info-grid">
                  <div className="parlour-modal-info-item">
                    <div className="parlour-modal-info-icon">💰</div>
                    <span className="parlour-modal-info-label">Price</span>
                    <span className="parlour-modal-info-value">₹{selectedProduct.price.toLocaleString()}</span>
                  </div>
                  <div className="parlour-modal-info-item">
                    <div className="parlour-modal-info-icon">⏱️</div>
                    <span className="parlour-modal-info-label">Duration</span>
                    <span className="parlour-modal-info-value">{selectedProduct.duration}</span>
                  </div>
                  <div className="parlour-modal-info-item">
                    <div className="parlour-modal-info-icon">⭐</div>
                    <span className="parlour-modal-info-label">Rating</span>
                    <span className="parlour-modal-info-value">{selectedProduct.rating}/5</span>
                  </div>
                </div>

                {selectedProduct.features && (
                  <div className="parlour-modal-features">
                    <h6>What's Included</h6>
                    <ul>
                      {selectedProduct.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  className="parlour-modal-book-btn"
                  onClick={() => handleBookService(selectedProduct)}
                >
                  Book This Service — ₹{selectedProduct.price.toLocaleString()}
                </button>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* ═══ PAYMENT MODAL ═══ */}
      <PaymentPage
        show={showDemoPayment}
        onHide={() => setShowDemoPayment(false)}
        bookingSummary={{
          services: selectedServices.map((s) => ({ name: s.name, price: s.price })),
          date: selectedDate,
          time: selectedTime || '10:00 AM',
          amount: amount || selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0),
        }}
        onPaymentSuccess={handleDemoPaymentSuccess}
        onPaymentFailure={handleDemoPaymentFailure}
        onBookNowPayLater={handleDemoBookNowPayLater}
        points={points}
        onUsePoints={(pts, discount) => {
          setUsedPoints(pts);
          setPoints((prev) => prev - pts);
          setAmount((prev) => Math.max(0, prev - discount));
        }}
      />

      <ConfirmationPage
        show={showDemoConfirmation}
        onHide={() => setShowDemoConfirmation(false)}
        transactionId={demoPaymentResult?.transactionId}
        amount={demoPaymentResult?.amount || amount}
        paymentMethod={demoPaymentResult?.paymentMethod}
        bookingSummary={{
          services: selectedServices.map((s) => ({ name: s.name, price: s.price })),
          date: selectedDate,
          time: selectedTime || '10:00 AM',
        }}
        onDone={() => setShowDemoConfirmation(false)}
      />

      {/* ═══ LOGIN MODAL ═══ */}
      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        centered
        className="parlour-login-modal"
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
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text className="bg-light">
                  <FaUser className="text-secondary" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  value={userData.username || ''}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  placeholder="Username"
                  className="border-start-0"
                />
              </InputGroup>
            </Form.Group>

            {isNewUser && (
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaPhoneAlt className="text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    value={userData.phone_number || ''}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter Your Phone Number"
                    className="border-start-0"
                    isInvalid={!!phoneError}
                  />
                  <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text className="bg-light">
                  <FaLock className="text-secondary" />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={userData.password || ''}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="Password"
                  className="border-start-0 border-end-0"
                />
                <InputGroup.Text
                  className="bg-light cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash className="text-secondary" /> : <FaEye className="text-secondary" />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            {!isNewUser && (
              <div className="d-flex justify-content-end mb-3">
                <Button variant="link" className="p-0 text-decoration-none" size="sm">Forgot password?</Button>
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger py-2 mb-3">{errorMessage}</div>
            )}

            <Button
              variant="primary"
              onClick={isNewUser ? handleSignUpClick : loginUser}
              disabled={isButtonDisabled}
              className="w-100 py-2 mt-2 mb-3"
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  {isNewUser ? 'Creating Account...' : 'Logging in...'}
                </span>
              ) : (
                isNewUser ? 'Create Account' : 'Login'
              )}
            </Button>

            <p className="text-muted text-center small mt-4">
              By signing up, you agree to our <a href="/terms" className="text-decoration-none">Terms of Service</a> and <a href="/policy" className="text-decoration-none">Privacy Policy</a>.
            </p>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Parlour;
