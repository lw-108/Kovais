import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, MapPin, Calendar, Users, Star, Camera, Share2,
  Eye, Clock, Shield, Award, MessageCircle, Play, Pause,
  Volume2, VolumeX, Maximize, ThumbsUp, ThumbsDown,
  Bookmark, Navigation, Sun, Sparkles, Zap,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { format } from 'date-fns';
import dlx1 from './images/dlx1.jpeg';
import dlx2 from './images/dlx2.jpeg';
import dlx3 from './images/dlx3.jpeg';
import dlx4 from './images/dlx4.jpeg';
import { Row, Col, Modal, Button, Spinner, Tabs, Tab, Form, InputGroup } from 'react-bootstrap';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPhoneAlt } from 'react-icons/fa';
import axios from "axios";
import "./SearchResults.css";
import { PaymentPage, ConfirmationPage } from '../components/Payment';

// ─── Minimal Calendar ────────────────────────────────────────────────────────
const DateCalendar = ({ isOpen, onClose, onDateSelect, selectedDate, position }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  if (!isOpen) return null;

  const today = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    onClose();
  };

  const navigateMonth = (dir) => {
    if (dir === 'prev') {
      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
      else setCurrentMonth(m => m - 1);
    } else {
      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
      else setCurrentMonth(m => m + 1);
    }
  };

  return (
    <div className="kov-cal-overlay" onClick={onClose}>
      <div className="kov-cal-modal" onClick={e => e.stopPropagation()}>
        <div className="kov-cal-header">
          <button className="kov-cal-nav" onClick={() => navigateMonth('prev')}><ChevronLeft size={16}/></button>
          <span className="kov-cal-title">{monthNames[currentMonth]} {currentYear}</span>
          <button className="kov-cal-nav" onClick={() => navigateMonth('next')}><ChevronRight size={16}/></button>
        </div>
        <div className="kov-cal-days-head">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="kov-cal-grid">
          {[...Array(firstDayOfMonth)].map((_,i) => <div key={`e${i}`} className="kov-cal-empty"/>)}
          {[...Array(daysInMonth)].map((_,i) => {
            const day = i + 1;
            const date = new Date(currentYear, currentMonth, day);
            const isToday = today.toDateString() === date.toDateString();
            const isPast = date < today && !isToday;
            return (
              <button
                key={day}
                className={`kov-cal-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                onClick={() => !isPast && handleDateClick(day)}
                disabled={isPast}
              >{day}</button>
            );
          })}
        </div>
        <div className="kov-cal-footer">
          <span className="kov-cal-hint">Select your preferred date</span>
          <button className="kov-cal-close-btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const SearchResults = ({ user, setUser, setAadhar, aadhar, setPoints, points }) => {
  const [selectedRoomType, setSelectedRoomType] = useState("Deluxe Suite");
  const [roomCounts, setRoomCounts] = useState([1]);
  const [guestCounts, setGuestCounts] = useState([2]);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [status, setStatus] = useState("");
  const [paytype, setPaytype] = useState("");
  const [usedPoints, setUsedPoints] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [availableRooms, setAvailableRooms] = useState(10);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [value, setValue] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [userData, setUserData] = useState({ username: "", phone_number: "", password: "" });
  const [phoneError, setPhoneError] = useState('');
  const [location, setLocation] = useState("Gobichettipalayam, Erode India");
  const [roomType, setRoomType] = useState("Delux Room");
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [savedRooms, setSavedRooms] = useState(new Set());
  const [total, setRoom] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [showDemoConfirmation, setShowDemoConfirmation] = useState(false);
  const [demoPaymentResult, setDemoPaymentResult] = useState(null);
  const [realTimeOccupancy, setRealTimeOccupancy] = useState({});
  const [virtualTourProgress, setVirtualTourProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    earlyCheckIn: { checked: false, time: "" },
    lateCheckOut: { checked: false, time: "" },
    extraBed: { checked: false, count: 0 },
  });

  const requestOptions = [
    { id: 'earlyCheckIn', label: 'Early check-in', showTime: true, showInput: false },
    { id: 'lateCheckOut', label: 'Late check-out', showTime: true, showInput: false },
    { id: 'extraBed', label: 'Extra bed', showTime: false, showInput: true },
  ];

  const rooms = [
    {
      id: 1,
      type: 'Deluxe Suite',
      title: 'Premium Deluxe Suite with City View',
      description: 'Panoramic city views, smart home automation, premium bedding and a curated minibar. A stay that stays with you.',
      price: 4500,
      originalPrice: 4500,
      rating: 4.8,
      reviewCount: 342,
      location: 'Gobichettipalayam Premium District',
      images: [dlx1, dlx2, dlx3, dlx4],
      amenities: [
        { name: 'Smart TV', icon: '📺', available: true },
        { name: 'High-Speed WiFi', icon: '📶', available: true },
        { name: 'Mini Bar', icon: '🍷', available: true },
        { name: 'Room Service', icon: '🛎️', available: true },
        { name: 'Balcony', icon: '🏙️', available: true },
        { name: 'Air Conditioning', icon: '❄️', available: true }
      ],
      features: { smartHome: true, voiceControl: true, moodLighting: true, premiumBedding: true, cityView: true, soundproofing: true },
      ecoRating: 4.2,
      carbonFootprint: 'Low Carbon',
      lastBooked: '2 hours ago',
      popularityScore: 95,
      instantConfirmation: true,
      freeCancellation: true,
      cancellationDeadline: '24 hours',
      specialOffers: ['Early Bird 20% Off', 'Extended Stay Discount'],
      nearbyAttractions: ['City Mall - 0.5km', 'Central Park - 1.2km', 'Museum - 2.1km']
    }
  ];

  const weatherInfo = { temperature: '24°C', condition: 'Sunny', humidity: '65%', windSpeed: '12 km/h' };
  const attractions = [
    { name: 'Ancient Temple', distance: '0.8km', rating: 4.7, type: 'Historical', icon: '🏛️' },
    { name: 'Shopping Complex', distance: '1.2km', rating: 4.5, type: 'Shopping', icon: '🛍️' },
    { name: 'Nature Park', distance: '2.1km', rating: 4.9, type: 'Nature', icon: '🌳' },
    { name: 'Local Market', distance: '0.5km', rating: 4.3, type: 'Culture', icon: '🎭' }
  ];

  const reviews = [
    { name: "Sarah Johnson", rating: 5, date: "2 days ago", comment: "Absolutely stunning room with amazing city views. The smart home features were impressive and the staff was incredibly helpful.", helpful: 12 },
    { name: "Michael Chen", rating: 4, date: "1 week ago", comment: "Great location and clean facilities. The eco-friendly initiatives are commendable. Would definitely stay again.", helpful: 8 },
    { name: "Emma Davis", rating: 5, date: "2 weeks ago", comment: "Perfect for business travel. The workspace was well-equipped and the WiFi was excellent throughout my stay.", helpful: 15 }
  ];

  useEffect(() => {
    setTotalAmount(roomCounts[0] * rooms[0].price);
    const interval = setInterval(() => {
      setRealTimeOccupancy(prev => ({ ...prev, [Math.floor(Math.random() * 3) + 1]: Math.floor(Math.random() * 100) }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (checkInDate && checkOutDate) fetchAvailableRooms(checkInDate, checkOutDate);
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const base = rooms[0]?.price || 0;
    setTotalAmount(base * roomCounts[0]);
  }, [roomCounts]);

  // ── handlers ──
  const handleCheckInDateSelect = (date) => {
    const selected = new Date(date);
    setCheckInDate(selected);
    setCheckOutDate(null);
    setSelectingCheckOut(true);
    setShowCheckInCalendar(false);
    setTimeout(() => setShowCheckOutCalendar(true), 150);
  };

  const handleCheckOutDateSelect = (date) => {
    const selected = new Date(date);
    if (!checkInDate) { toast.error("Select Check-in first"); setShowCheckInCalendar(true); return; }
    if (selected <= checkInDate) { toast.error("Checkout must be after Check-In"); return; }
    setCheckOutDate(selected);
    setShowCheckOutCalendar(false);
    setSelectingCheckOut(false);
  };

  const incrementRoom = (index) => {
    const updated = [...roomCounts];
    if (updated[index] < (availableRooms || 10)) {
      updated[index] += 1;
      setRoomCounts(updated);
      setTotalAmount(updated[index] * rooms[index].price);
    }
  };

  const decrementRoom = (index) => {
    const updated = [...roomCounts];
    if (updated[index] > 1) {
      updated[index] -= 1;
      setRoomCounts(updated);
      setTotalAmount(updated[index] * rooms[index].price);
      const updatedGuests = [...guestCounts];
      const maxG = updated[index] * 3;
      if (updatedGuests[index] > maxG) { updatedGuests[index] = maxG; setGuestCounts(updatedGuests); }
    }
  };

  const incrementGuest = (index) => {
    const updated = [...guestCounts];
    if (updated[index] < roomCounts[index] * 3) { updated[index] += 1; setGuestCounts(updated); }
  };

  const decrementGuest = (index) => {
    const updated = [...guestCounts];
    if (updated[index] > 1) { updated[index] -= 1; setGuestCounts(updated); }
  };

  const handleBookNow = (room, index) => {
    if (!checkInDate) { toast.error("Please select Check-In date"); setShowCheckInCalendar(true); return; }
    if (!checkOutDate) { toast.error("Please select Check-Out date"); setShowCheckOutCalendar(true); return; }
    verify(room, index);
  };

  const toggleSaveRoom = (roomId) => {
    const newSet = new Set(savedRooms);
    if (newSet.has(roomId)) newSet.delete(roomId); else newSet.add(roomId);
    setSavedRooms(newSet);
  };

  const shareRoom = async (room) => {
    if (navigator.share) {
      try { await navigator.share({ title: room.title, text: room.description, url: window.location.href }); }
      catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const handleVirtualTour = (room) => {
    setSelectedRoom(room); setShowVirtualTour(true); setVirtualTourProgress(0);
    const iv = setInterval(() => {
      setVirtualTourProgress(p => { if (p >= 100) { clearInterval(iv); return 100; } return p + 2; });
    }, 100);
  };

  const verify = (room, index) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      handleShowModal(room, index);
      setShowLoginModal(false);
      setShowModal(true);
    } else {
      setShowLoginModal(true);
      setShowModal(false);
    }
  };

  const handleShowModal = (room, index) => {
    if (!room) return;
    let price = typeof room.price === "string" ? parseFloat(room.price.replace("₹","").replace(/,/g,"")) : room.price;
    setSelectedRoom({ ...room, roomCount: roomCounts[index], guestCount: guestCounts[index], totalAmount: roomCounts[index] * price });
    setShowModal(true);
  };

  const handleTabSelect = (key) => { setIsNewUser(key === 'signup'); setErrorMessage(''); };
  const handleCheckboxChange = (id) => setSelectedOptions(p => ({ ...p, [id]: { ...p[id], checked: !p[id].checked } }));
  const handleTimeChange = (id, v) => setSelectedOptions(p => ({ ...p, [id]: { ...p[id], time: v } }));
  const handleCountChange = (id, v) => setSelectedOptions(p => ({ ...p, [id]: { ...p[id], count: Number(v) } }));

  const fetchAvailableRooms = async (ci, co) => {
    try {
      const fi = format(new Date(ci), "yyyy-MM-dd");
      const fo = format(new Date(co), "yyyy-MM-dd");
      const res = await axios.get(`https://api.codingboss.in/kovais/hotel/room-availability/?date_in=${fi}&date_out=${fo}`, { headers: { "Content-Type": "application/json" } });
      setRoom(res.data.total_rooms);
      setAvailableRooms(res.data.available_count);
    } catch (e) { console.error(e); }
  };

  const loginUser = async () => {
    if (!userData.username || !userData.password) { setErrorMessage('Username and password are required'); return; }
    setLoading(true); setErrorMessage('');
    try {
      const res = await axios.post("https://api.codingboss.in/kovais/customer-login/", { username: userData.username, password: userData.password }, { headers: { "Content-Type": "application/json" } });
      localStorage.setItem("loggedInUser", JSON.stringify(res.data));
      localStorage.setItem("currentUserId", JSON.stringify(res.data.user_id));
      if (res.data.emblem_url || res.data.points) { localStorage.setItem("url", JSON.stringify(res.data.emblem_url)); localStorage.setItem(`points_${res.data.user_id}`, JSON.stringify(res.data.points)); }
      setUser(res.data); setPoints(res.data.points);
      Swal.fire({ icon: "success", title: "Login Successful!", timer: 1500, showConfirmButton: false });
      setTimeout(() => { setErrorMessage(''); setShowLoginModal(false); setShowModal(true); }, 500);
    } catch (e) {
      setErrorMessage(e.response?.data?.login || e.response?.data?.message || "Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  const signUp = async () => {
    if (!userData.username || !userData.phone_number || !userData.password) { setErrorMessage('All fields are required'); return; }
    setLoading(true);
    try {
      await axios.post("https://api.codingboss.in/kovais/create-customer/", { name: userData.username, phone_number: userData.phone_number, password: userData.password }, { headers: { "Content-Type": "application/json" } });
      setErrorMessage('');
      setTimeout(() => { setIsNewUser(false); setLoading(false); Swal.fire({ icon: "success", title: "Account Created!", text: "Please sign in with your new account" }); }, 1000);
    } catch (e) {
      const msg = e.response?.data?.error || e.response?.data?.message || "Sign-Up Failed.";
      setErrorMessage(msg); Swal.fire({ icon: "error", title: "Signup Failed", text: msg });
    } finally { setLoading(false); }
  };

  const validatePhoneNumber = (number) => {
    if (!number) { setPhoneError('Phone number is required.'); return false; }
    if (!/^[\d\s\-\(\)]+$/.test(number)) { setPhoneError('Only digits and common symbols allowed.'); return false; }
    if (number.replace(/[^\d]/g,'').length < 10) { setPhoneError('Must be at least 10 digits.'); return false; }
    setPhoneError(''); return true;
  };

  const handlePhoneNumberChange = (e) => { setUserData({ ...userData, phone_number: e.target.value }); if (isNewUser) validatePhoneNumber(e.target.value); };
  const handleSignUpClick = () => { if (isNewUser && validatePhoneNumber(userData.phone_number) && userData.username && userData.password) signUp(); };
  const isButtonDisabled = loading || (isNewUser && !!phoneError);

  const handleConfirmBooking = () => {
    if (!paytype) { Swal.fire("Select Method", "Please choose a payment method", "warning"); return; }
    if (paytype === "online") { setShowModal(false); setShowDemoPayment(true); }
    else handleDemoBookNowPayLater({ paymentMethod: "offline" });
  };

  const handleDemoPaymentSuccess = (result) => {
    setDemoPaymentResult(result); setShowDemoPayment(false); setStatus("completed"); setPaytype("online");
    hotelRequest();
    setTimeout(() => setShowDemoConfirmation(true), 500);
  };

  const handleDemoPaymentFailure = (error) => console.log("Payment failed:", error);

  const handleDemoBookNowPayLater = () => {
    setStatus("pending"); setPaytype("offline"); setShowDemoPayment(false); setShowModal(false);
    hotelRequest();
    setTimeout(() => { setDemoPaymentResult({ paymentMethod: "offline", amount: totalAmount || selectedRoom?.totalAmount }); setShowDemoConfirmation(true); }, 500);
  };

  const handleUsePoints = (val) => {
    const pts = Number(val);
    let cur = points;
    const stored = localStorage.getItem("points");
    if (!cur && stored) { cur = Number(stored); setPoints(cur); }
    const bookTotal = selectedRoom?.totalAmount || 0;
    if (!pts || pts <= 0) return Swal.fire("Invalid Input", "Enter valid points.", "warning");
    if (pts > cur) return Swal.fire("Not Enough Points", `You only have ${cur} points.`, "error");
    const disc = pts * 0.10;
    if (disc > bookTotal) return Swal.fire("Exceeds Bill Amount", "Points exceed payable total.", "error");
    const updPts = cur - pts; const finalAmt = bookTotal - disc;
    setPoints(updPts); setTotalAmount(finalAmt); setUsedPoints(pts);
    localStorage.setItem("points", updPts); localStorage.setItem("reducedPrice", finalAmt);
    Swal.fire({ icon: "success", title: "Points Applied 🎉", html: `Used: <b>${pts}</b> pts (₹${disc.toFixed(2)})<br>New Total: <b>₹${finalAmt.toFixed(2)}</b><br>Remaining: <b>${updPts}</b>` });
    setValue("");
  };

  const hotelRequest = async () => {
    setLoading(true);
    const promises = [], success = [], failed = [];
    try {
      for (let i = 0; i < selectedRoom.roomCount; i++) {
        const data = {
          category: roomType, amount: Math.round((totalAmount || selectedRoom.totalAmount) / selectedRoom.roomCount),
          date_in: format(checkInDate, "yyyy-MM-dd"), date_out: format(checkOutDate, "yyyy-MM-dd"),
          payment_status: status, payment_type: paytype, room_count: selectedRoom.roomCount,
          guest_count: selectedRoom.guestCount, status: "booked", customer_id: user.user_id,
          guest_name: user.username, points: usedPoints ? Math.round(usedPoints / selectedRoom.roomCount) : 0, visit: purposeOfVisit
        };
        promises.push(
          axios.post("https://api.codingboss.in/kovais/hotel/orders/", data, { headers: { 'Content-Type': 'application/json' } })
            .then(r => { success.push(r.data); localStorage.setItem("hotelId", JSON.stringify(r.data.order.id)); return r; })
            .catch(e => { failed.push({ error: e.response?.data || e.message, attempt: i + 1 }); return null; })
        );
      }
      await Promise.all(promises);
      if (failed.length === 0 && usedPoints) { const np = points - usedPoints; setPoints(np); localStorage.setItem(`points_${user.user_id}`, JSON.stringify(np)); }
      if (failed.length === 0) {
        Swal.fire({ title: "Booking Successful!", text: `${selectedRoom.roomCount} room(s) booked successfully.`, icon: "success", timer: 3000 });
      } else if (success.length > 0) {
        Swal.fire({ title: "Partial Success", html: `<p>${success.length} booked.</p>${failed.length > 0 ? `<p>${failed.length} failed.</p>` : ''}`, icon: "warning" });
      } else throw new Error("All bookings failed");
      setShowModal(false); setShowLoginModal(false);
    } catch (e) {
      console.error(e);
      Swal.fire({ title: "Booking Failed", text: e.message || "An error occurred", icon: "error" });
    } finally { setLoading(false); }
  };

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.round((new Date(checkOutDate) - new Date(checkInDate)) / 86400000);
  };

  return (
    <div className="kov-root">
      {/* ── Hero Search ─────────────────────────────── */}
      <motion.div 
        className="kov-hero"
        id="kov-hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="kov-hero-bg-glow" />
        <div className="kov-hero-inner">
          <motion.div 
            className="kov-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="kov-eyebrow-dot" />
            Gobichettipalayam · Tamil Nadu
          </motion.div>
          <motion.h1 
            className="kov-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Find your perfect <em>retreat</em>
          </motion.h1>
          <motion.p 
            className="kov-hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Curated stays with exceptional comfort
          </motion.p>

          <motion.div 
            className="kov-search-glass"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          >
            <div className="kov-search-field full">
              <span className="kov-search-label">Location</span>
              <div className="kov-search-input-row">
                <MapPin size={14} className="kov-field-icon" />
                <input className="kov-bare-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Where are you going?" />
              </div>
            </div>

            <div className="kov-search-field">
              <span className="kov-search-label">Check-In</span>
              <div className="kov-search-input-row clickable" onClick={() => { setShowCheckInCalendar(true); setShowCheckOutCalendar(false); }}>
                <Calendar size={14} className="kov-field-icon" />
                <span className={checkInDate ? "kov-date-val set" : "kov-date-val"}>
                  {checkInDate ? format(checkInDate, "dd MMM yyyy") : "Select date"}
                </span>
              </div>
            </div>

            <div className="kov-search-field">
              <span className="kov-search-label">Check-Out</span>
              <div className="kov-search-input-row clickable" onClick={() => { setShowCheckOutCalendar(true); setShowCheckInCalendar(false); }}>
                <Calendar size={14} className="kov-field-icon" />
                <span className={checkOutDate ? "kov-date-val set" : "kov-date-val"}>
                  {checkOutDate ? format(checkOutDate, "dd MMM yyyy") : "Select date"}
                </span>
              </div>
            </div>

            <div className="kov-search-field">
              <span className="kov-search-label">Room Type</span>
              <div className="kov-search-input-row">
                <Bookmark size={14} className="kov-field-icon" />
                <select className="kov-bare-input" value={roomType} onChange={e => setRoomType(e.target.value)}>
                  <option value="Delux Room">Deluxe Room</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Calendars */}
      <DateCalendar isOpen={showCheckInCalendar} onClose={() => setShowCheckInCalendar(false)} onDateSelect={handleCheckInDateSelect} selectedDate={checkInDate} position="checkIn" />
      <DateCalendar isOpen={showCheckOutCalendar} onClose={() => setShowCheckOutCalendar(false)} onDateSelect={handleCheckOutDateSelect} selectedDate={checkOutDate} position="checkOut" />

      {/* ── Strip bar ─────────────────────────────── */}
      <div className="kov-strip">
        <div className="kov-strip-left">
          <span className="kov-strip-item"><Sun size={13} /> {weatherInfo.temperature} · {weatherInfo.condition}</span>
          <span className="kov-strip-item"><MapPin size={12} /> {attractions.length} nearby</span>
          <span className="kov-strip-item"><Clock size={12} /> Updated 2 min ago</span>
        </div>
        <span className="kov-avail-pill">
          <Sparkles size={11} /> {availableRooms} rooms left
        </span>
      </div>

      {/* ── Content ───────────────────────────────── */}
      <div className="kov-content">

        {/* Stay summary bar (when dates selected) */}
        <AnimatePresence>
          {checkInDate && checkOutDate && (
            <motion.div 
              className="kov-date-bar"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
            <div className="kov-date-bar-dates">
              <span className="kov-date-bar-from">{format(checkInDate, "EEE, dd MMM")}</span>
              <span className="kov-date-bar-arrow">→</span>
              <span className="kov-date-bar-to">{format(checkOutDate, "EEE, dd MMM")}</span>
            </div>
            <span className="kov-date-bar-nights">{getNights()} night{getNights() !== 1 ? 's' : ''}</span>
          </motion.div>
        )}
        </AnimatePresence>

        {/* ── Room Cards ──────────────────────────── */}
        {rooms.map((room, index) => (
          <motion.div 
            key={room.id} 
            className="kov-room-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >

            {/* Image Gallery */}
            <div className="kov-gallery">
              <div className="kov-main-img-wrap">
                <img
                  src={room.images[currentImageIndex[room.id] || 0]}
                  alt={room.title}
                  className="kov-main-img"
                />
                <div className="kov-img-gradient" />

                {/* Floating badges */}
                <div className="kov-img-badges-top">
                  {room.instantConfirmation && <span className="kov-img-badge gold"><Zap size={10} /> Instant</span>}
                  {room.freeCancellation && <span className="kov-img-badge">Free Cancel</span>}
                </div>

                {/* Price overlay */}
                <div className="kov-img-price">
                  <span className="kov-img-price-num">₹{room.price.toLocaleString()}</span>
                  <span className="kov-img-price-label">/ night</span>
                </div>

                {/* Action buttons */}
                <div className="kov-img-actions">
                  <button
                    className={`kov-img-action ${savedRooms.has(room.id) ? 'saved' : ''}`}
                    onClick={() => toggleSaveRoom(room.id)}
                    title={savedRooms.has(room.id) ? "Saved" : "Save"}
                  >
                    <Heart size={14} fill={savedRooms.has(room.id) ? "currentColor" : "none"} />
                  </button>
                  <button className="kov-img-action" onClick={() => shareRoom(room)} title="Share">
                    <Share2 size={14} />
                  </button>
                </div>

                {/* Image counter */}
                <div className="kov-img-counter">{(currentImageIndex[room.id] || 0) + 1}/{room.images.length}</div>
              </div>

              {/* Thumbnails */}
              <div className="kov-thumbs">
                {room.images.map((img, i) => (
                  <img
                    key={i} src={img} alt={`Thumbnail ${i + 1}`}
                    className={`kov-thumb ${(currentImageIndex[room.id] || 0) === i ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(p => ({ ...p, [room.id]: i }))}
                  />
                ))}
              </div>

              {/* Tour and Reviews buttons under gallery on desktop */}
              <div className="kov-gallery-actions">
                <button className="kov-btn-outline" onClick={() => handleVirtualTour(room)}>
                  <Camera size={14} /> Tour
                </button>
                <button className="kov-btn-outline" onClick={() => setShowReviewModal(true)}>
                  <MessageCircle size={14} /> Reviews
                </button>
              </div>
            </div>

            {/* Room body */}
            <div className="kov-room-body">
              {/* Header row */}
              <div className="kov-room-head-row">
                <div>
                  <h2 className="kov-room-name">{room.title}</h2>
                  <div className="kov-room-loc"><MapPin size={12} /> {room.location}</div>
                </div>
                <div className="kov-rating-pill">
                  <Star size={12} fill="currentColor" className="kov-rating-star" />
                  <span className="kov-rating-num">{room.rating}</span>
                  <span className="kov-rating-ct">({room.reviewCount})</span>
                </div>
              </div>

              {/* Last booked */}
              <div className="kov-last-booked"><Clock size={11} /> Last booked {room.lastBooked}</div>

              {/* Description */}
              <p className="kov-desc">{room.description}</p>

              {/* Amenities */}
              <div className="kov-amenities">
                {room.amenities.map((a, i) => (
                  <span key={i} className={`kov-amenity ${a.available ? '' : 'unavail'}`}>
                    <span>{a.icon}</span>{a.name}
                  </span>
                ))}
              </div>

              {/* Eco bar */}
              <div className="kov-eco-wrap">
                <div className="kov-eco-head">
                  <span className="kov-eco-label"><Award size={12} /> Eco Score</span>
                  <span className="kov-eco-val">{room.ecoRating}/5.0 · {room.carbonFootprint}</span>
                </div>
                <div className="kov-eco-track"><div className="kov-eco-fill" style={{ width: `${(room.ecoRating/5)*100}%` }} /></div>
              </div>

              {/* Counter controls */}
              <div className="kov-controls-row">
                <div className="kov-counter-group">
                  <span className="kov-counter-label">Rooms</span>
                  <div className="kov-counter">
                    <button className="kov-cnt-btn" onClick={() => decrementRoom(index)} disabled={roomCounts[index] <= 1}>−</button>
                    <span className="kov-cnt-num">{roomCounts[index]}</span>
                    <button className="kov-cnt-btn" onClick={() => incrementRoom(index)} disabled={roomCounts[index] >= (availableRooms || 100)}>+</button>
                  </div>
                  <span className="kov-avail-note">of {availableRooms} left</span>
                </div>

                <div className="kov-counter-group">
                  <span className="kov-counter-label">Guests</span>
                  <div className="kov-counter">
                    <button className="kov-cnt-btn" onClick={() => decrementGuest(index)} disabled={guestCounts[index] <= 1}>−</button>
                    <span className="kov-cnt-num">{guestCounts[index]}</span>
                    <button className="kov-cnt-btn" onClick={() => incrementGuest(index)} disabled={guestCounts[index] >= roomCounts[index] * 3}>+</button>
                  </div>
                  <span className="kov-avail-note">&nbsp;</span>
                </div>

                <div className="kov-total-block">
                  <span className="kov-total-label">Total</span>
                  <span className="kov-total-amt">₹{(roomCounts[index] * room.price * Math.max(getNights(), 1)).toLocaleString()}</span>
                  {getNights() > 1 && <span className="kov-total-note">for {getNights()} nights</span>}
                </div>
              </div>

              {/* Special Requests accordion */}
              <div className="kov-accordion">
                <button className="kov-accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
                  <span className="kov-accordion-title">Special Requests</span>
                  <span className="kov-accordion-note">Subject to availability</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isExpanded && (
                  <div className="kov-accordion-body">
                    {requestOptions.map(({ id, label, showTime, showInput }) => (
                      <div key={id} className="kov-req-item">
                        <label className="kov-req-label">
                          <input type="checkbox" checked={!!selectedOptions[id]?.checked} onChange={() => handleCheckboxChange(id)} className="kov-req-check" />
                          {label}
                        </label>
                        {showTime && selectedOptions[id]?.checked && (
                          <input type="time" value={selectedOptions[id]?.time || ""} onChange={e => handleTimeChange(id, e.target.value)} className="kov-req-time" />
                        )}
                        {showInput && selectedOptions[id]?.checked && (
                          <input type="number" min={1} value={selectedOptions[id]?.count || ""} onChange={e => handleCountChange(id, e.target.value)} placeholder="No. of beds" className="kov-req-time" />
                        )}
                      </div>
                    ))}
                    <textarea rows={2} placeholder="Any other requests?" className="kov-req-textarea" />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="kov-action-row">
                <button className="kov-btn-outline" onClick={() => handleVirtualTour(room)}>
                  <Camera size={14} /> Tour
                </button>
                <button className="kov-btn-outline" onClick={() => setShowReviewModal(true)}>
                  <MessageCircle size={14} /> Reviews
                </button>
                <button className="kov-btn-primary" onClick={() => handleBookNow(room, index)}>
                  <Bookmark size={14} /> Book Now
                </button>
              </div>

              {/* Special offers */}
              {room.specialOffers?.length > 0 && (
                <div className="kov-offers">
                  {room.specialOffers.map((o, i) => <span key={i} className="kov-offer-chip">{o}</span>)}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* ── Nearby Attractions ───────────────────── */}
        <motion.div 
          className="kov-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="kov-section-head">
            <Navigation size={16} className="kov-section-icon" />
            <h3 className="kov-section-title">Explore Nearby</h3>
            <div className="kov-section-line" />
          </div>
          <div className="kov-attract-grid">
            {attractions.map((a, i) => (
              <div key={i} className="kov-attract-card">
                <span className="kov-attract-icon">{a.icon}</span>
                <span className="kov-attract-name">{a.name}</span>
                <span className="kov-attract-dist">{a.distance}</span>
                <div className="kov-attract-rating">
                  <Star size={11} fill="currentColor" /> {a.rating}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer card ──────────────────────────── */}
        <motion.div 
          className="kov-footer-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <iframe
            src="https://www.google.com/maps?q=Kovais+Lodge+A%2FC+Rooms,+097,+SH+15,+Otthakkuthirai,+Gobichettipalayam,+Tamil+Nadu+638455&output=embed"
            width="100%" height="180" style={{ border: 0, display: 'block' }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Kovais Hotel Location"
          />
          <div className="kov-footer-info">
            <h4 className="kov-footer-name">Kovais (AC) Hotel</h4>
            <p className="kov-footer-addr">097, SH 15, Otthakkuthirai, Gobichettipalayam, Tamil Nadu 638455</p>
            <div className="kov-footer-contacts">
              <span>📞 9234567891</span>
              <span>✉️ info@kovaisbeauty.com</span>
            </div>
          </div>
        </motion.div>

        <div className="kov-copyright">© 2024 KOVAIS · All Rights Reserved</div>
      </div>

      {/* ── Booking Modal ─────────────────────────── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="kov-modal-wrapper" backdrop="static">
        <Modal.Header closeButton className="kov-modal-header">
          <Modal.Title className="kov-modal-title">
            <Sparkles size={18} className="kov-modal-icon" /> Complete Your Stay
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="kov-modal-body">
          {selectedRoom && (
            <div className="kov-modal-stack">
              {/* Summary */}
              <div className="kov-summary-box">
                <div className="kov-summary-top">
                  <div>
                    <div className="kov-summary-name">{selectedRoom.title}</div>
                    <div className="kov-summary-meta">
                      {checkInDate && checkOutDate && (
                        <><Calendar size={12} /> {format(checkInDate, "dd MMM")} → {format(checkOutDate, "dd MMM")} · {getNights()} nights &nbsp;</>
                      )}
                      <Users size={12} /> {selectedRoom.roomCount} room · {selectedRoom.guestCount} guest
                    </div>
                  </div>
                  <div className="kov-summary-price">₹{(totalAmount || selectedRoom.totalAmount)?.toLocaleString()}</div>
                </div>
              </div>

              {/* Purpose */}
              <div className="kov-modal-field">
                <label className="kov-modal-label">Purpose of Visit</label>
                <input className="kov-modal-input" placeholder="Business, Leisure, Family…" value={purposeOfVisit} onChange={e => setPurposeOfVisit(e.target.value)} />
              </div>

              {/* Loyalty */}
              <div className="kov-loyalty-box">
                <div className="kov-loyalty-head">
                  <span className="kov-loyalty-title"><Award size={15} /> Use Rewards</span>
                  <span className="kov-loyalty-pts">{points || 0} pts available</span>
                </div>
                <div className="kov-loyalty-row">
                  <input className="kov-modal-input flex1" type="number" placeholder="Enter points" value={value} onChange={e => setValue(e.target.value)} />
                  <button className="kov-apply-btn" onClick={() => handleUsePoints(value)} disabled={!value || parseInt(value) <= 0}>Apply</button>
                </div>
                {usedPoints > 0 && <div className="kov-loyalty-success"><Check size={12} /> ₹{usedPoints} discount applied</div>}
              </div>

              {/* Payment methods */}
              <div className="kov-modal-field">
                <label className="kov-modal-label">Payment Method</label>
                <div className="kov-pay-grid">
                  <div className={`kov-pay-card ${paytype === 'offline' ? 'active' : ''}`} onClick={() => { setStatus("pending"); setPaytype("offline"); }}>
                    <div className="kov-pay-icon"><Clock size={20} /></div>
                    <div>
                      <div className="kov-pay-name">Pay at Hotel</div>
                      <div className="kov-pay-desc">Reserve now, pay later</div>
                    </div>
                    {paytype === 'offline' && <Check size={14} className="kov-pay-check" />}
                  </div>
                  <div className={`kov-pay-card ${paytype === 'online' ? 'active' : ''}`} onClick={() => { setStatus("paid"); setPaytype("online"); }}>
                    <div className="kov-pay-icon"><Zap size={20} /></div>
                    <div>
                      <div className="kov-pay-name">Pay Now</div>
                      <div className="kov-pay-desc">Instant confirmation</div>
                    </div>
                    {paytype === 'online' && <Check size={14} className="kov-pay-check" />}
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="kov-trust-row">
                <span className="kov-trust-item"><Shield size={12} /> Secure</span>
                <span className="kov-trust-item"><Clock size={12} /> Free Cancel</span>
                <span className="kov-trust-item"><Check size={12} /> Verified</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="kov-modal-footer">
          <button className="kov-confirm-btn" onClick={handleConfirmBooking} disabled={!paytype}>
            Confirm Booking · ₹{(totalAmount || selectedRoom?.totalAmount)?.toLocaleString()}
          </button>
        </Modal.Footer>
      </Modal>

      {/* ── Login Modal ──────────────────────────── */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered className="kov-modal-wrapper">
        <Modal.Header closeButton className="kov-modal-header">
          <Modal.Title className="kov-modal-title">Welcome to Kovais</Modal.Title>
        </Modal.Header>
        <Modal.Body className="kov-modal-body">
          <Tabs activeKey={isNewUser ? 'signup' : 'login'} onSelect={handleTabSelect} className="kov-tabs mb-4">
            <Tab eventKey="login" title="Login" />
            <Tab eventKey="signup" title="Sign Up" />
          </Tabs>
          <Form>
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text className="kov-input-icon"><FaUser size={13} /></InputGroup.Text>
                <Form.Control type="text" value={userData.username || ""} onChange={e => setUserData({ ...userData, username: e.target.value })} placeholder="Username" className="kov-form-control" />
              </InputGroup>
            </Form.Group>
            {isNewUser && (
              <Form.Group className="mb-3">
                <InputGroup>
                  <InputGroup.Text className="kov-input-icon"><FaPhoneAlt size={13} /></InputGroup.Text>
                  <Form.Control type="tel" value={userData.phone_number || ""} onChange={handlePhoneNumberChange} placeholder="Phone Number" className="kov-form-control" isInvalid={!!phoneError} />
                  <Form.Control.Feedback type="invalid">{phoneError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text className="kov-input-icon"><FaLock size={13} /></InputGroup.Text>
                <Form.Control type={showPassword ? "text" : "password"} value={userData.password || ""} onChange={e => setUserData({ ...userData, password: e.target.value })} placeholder="Password" className="kov-form-control" />
                <InputGroup.Text className="kov-input-icon clickable" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            {errorMessage && <div className="kov-error-msg">{errorMessage}</div>}
            <button type="button" className="kov-confirm-btn w-100 mt-2" onClick={isNewUser ? handleSignUpClick : loginUser} disabled={isButtonDisabled}>
              {loading ? <><Spinner size="sm" /> {isNewUser ? "Creating..." : "Logging in..."}</> : isNewUser ? "Create Account" : "Login"}
            </button>
            <p className="kov-terms">By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ── Virtual Tour Modal ───────────────────── */}
      {showVirtualTour && (
        <div className="kov-tour-overlay">
          <div className="kov-tour-modal">
            <div className="kov-tour-header">
              <span className="kov-tour-title"><Camera size={16} /> 360° Virtual Tour — {selectedRoom?.title}</span>
              <button className="kov-tour-close" onClick={() => setShowVirtualTour(false)}>×</button>
            </div>
            <div className="kov-tour-body">
              <img src={selectedRoom?.images[0]} alt="Tour" className="kov-tour-img" />
              <div className="kov-tour-controls">
                <button className="kov-tour-btn" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause size={14}/> : <Play size={14}/>}</button>
                <button className="kov-tour-btn" onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={14}/> : <Volume2 size={14}/>}</button>
                <button className="kov-tour-btn"><Maximize size={14}/></button>
              </div>
            </div>
            <div className="kov-tour-progress">
              <div className="kov-tour-track"><div className="kov-tour-fill" style={{ width: `${virtualTourProgress}%` }} /></div>
              <div className="kov-tour-prog-label"><span>Tour Progress</span><span>{virtualTourProgress}%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reviews Modal ────────────────────────── */}
      {showReviewModal && (
        <div className="kov-tour-overlay">
          <div className="kov-review-modal">
            <div className="kov-tour-header">
              <span className="kov-tour-title"><Star size={16} /> Guest Reviews</span>
              <button className="kov-tour-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="kov-review-body">
              <div className="kov-review-overall">
                <div className="kov-review-circle">
                  <span className="kov-review-num">4.8</span>
                  <div className="kov-review-stars">{[...Array(5)].map((_,i) => <Star key={i} size={8} fill="currentColor" />)}</div>
                </div>
                <div className="kov-rating-bars">
                  {[5,4,3,2,1].map(r => (
                    <div key={r} className="kov-rbar-row">
                      <span>{r}</span>
                      <Star size={10} fill="currentColor" className="kov-rbar-star" />
                      <div className="kov-rbar-track"><div className="kov-rbar-fill" style={{ width: `${r===5?75:r===4?20:5}%` }} /></div>
                      <span>{r===5?'256':r===4?'68':'18'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kov-review-list">
                {reviews.map((rev, i) => (
                  <div key={i} className="kov-review-item">
                    <div className="kov-rev-head">
                      <div className="kov-rev-avatar">{rev.name.charAt(0)}</div>
                      <div>
                        <div className="kov-rev-name">{rev.name}</div>
                        <div className="kov-rev-meta">
                          {[...Array(5)].map((_,j) => <Star key={j} size={10} fill={j < rev.rating ? "currentColor" : "none"} className="kov-rbar-star" />)}
                          <span className="kov-rev-date">{rev.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="kov-rev-text">{rev.comment}</p>
                    <div className="kov-rev-actions">
                      <button className="kov-rev-btn helpful"><ThumbsUp size={11} /> Helpful ({rev.helpful})</button>
                      <button className="kov-rev-btn"><ThumbsDown size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Payment / Confirmation */}
      <PaymentPage
        show={showDemoPayment} onHide={() => setShowDemoPayment(false)}
        onSuccess={handleDemoPaymentSuccess} onFailure={handleDemoPaymentFailure}
        onBookNowPayLater={handleDemoBookNowPayLater}
        amount={totalAmount || selectedRoom?.totalAmount || 0}
        serviceName={selectedRoom?.title || "Hotel Room"}
      />
      <ConfirmationPage
        show={showDemoConfirmation} onHide={() => setShowDemoConfirmation(false)}
        paymentResult={demoPaymentResult}
        amount={totalAmount || selectedRoom?.totalAmount || 0}
        serviceName={selectedRoom?.title || "Hotel Room"}
      />
    </div>
  );
};

export default SearchResults;