import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Calendar, User, ShoppingBag, CheckCircle, ArrowRight, Clock, MapPin, Gift } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./History.css";

// Import your images
import hotel from "./Image/hotl.jpg";
import gym from "./Image/Gym.jpg";
import saloon from "./Image/saloon.jpg";
import spa from "./Image/sp.jpg";

const History = ({ points, setPoints }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  
  // Feedback related state
  const [ratings, setRatings] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const imagesCategory = {
    hotel: hotel,
    spa: spa,
    saloon: saloon,
    gym: gym,
  };

  // Function to navigate to Home page and scroll to booking section
  const handleBookService = () => {
    navigate('/');
    setTimeout(() => {
      const bookingsElement = document.getElementById('bookings');
      if (bookingsElement) {
        bookingsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const normalizeDate = (date) => {
    const d = typeof date === "string"
      ? new Date(date.split("T")[0] + "T12:00:00")
      : new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  const getOrderDate = (order) => {
    const dateValue = order.check_in || order.date || order.date_in || order.purchaseddate;
    if (!dateValue) return new Date();
    return new Date(dateValue);
  };

  const isTrackingAvailable = (order) => {
    if (
      order.Category !== "saloon" ||
      order.order_type !== "Door Step" ||
      !order.employee_id || 
      !order.time ||
      !order.date
    ) {
      return false;
    }

    const [hour, minute] = order.time.split(":").map(Number);
    const bookingDateTime = new Date(order.date);
    bookingDateTime.setHours(hour, minute, 0, 0);

    const now = new Date();
    const diffInMs = bookingDateTime - now;
    const diffInMinutes = diffInMs / (1000 * 60);

    return diffInMinutes <= 60 && diffInMinutes >= -120;
  };

  const fetchOrders = useCallback(async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    setErrorMessage("");
    
    try {
      const response = await fetch(
        `https://api.codingboss.in/kovais/orders/?user_id=${userId}&status=booked`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const hotelOrders = data.hotel_orders || [];
      const gymOrders = data.gym_orders || [];
      const spaOrders = data.spa_orders || [];
      const saloonOrders = data.saloon_orders || [];
      
      const allOrders = [
        ...hotelOrders.map((order) => ({
          id: order.id,
          guest_name: order.guest_name,
          category: order.category || "Deluxe Room",
          check_in: order.date_in,
          room_count: order.room_count,
          amount: order.amount,
          status: order.status,
          paymentStatus: order.payment_status,
          date: order.date_in,
          Category: "hotel",
        })),
        ...gymOrders.map((order) => ({
          id: order.id,
          guest_name: order.customer_name,
          category: order.plan,
          timeslot: order.timeslot,
          date: order.purchaseddate,
          amount: order.amount,
          status: order.status,
          paymentStatus: order.payment_status,
          Category: "gym",
        })),
        ...spaOrders.map((order) => ({
          id: order.id,
          guest_name: order.customer_name,
          category: order.services,
          date: order.date,
          time: order.time,
          amount: order.amount,
          status: order.status,
          paymentStatus: order.payment_status,
          Category: "spa",
        })),
        ...saloonOrders.map((order) => ({
          id: order.id,
          guest_name: order.customer_name,
          category: order.services,
          gender: order.category,
          date: order.date,
          time: order.time,
          amount: order.amount,
          status: order.status,
          paymentStatus: order.payment_status,
          order_type: order.order_type,
          employee_id: order.employee_id,
          Category: "saloon",
        })),
      ];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingOrders = allOrders.filter((order) => {
        const orderDate = getOrderDate(order);
        return orderDate >= today;
      });
      setOrders(upcomingOrders);
      
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMessage(`Failed to load bookings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPoints = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const response = await fetch(
        `https://api.codingboss.in/kovais/user-points/?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch points: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      setPoints(data.points);
      localStorage.setItem(`points_${data.user_id}`, JSON.stringify(data.points));
      
    } catch (error) {
      console.error("Points Error:", error.message);
      setErrorMessage("Unable to fetch user points.");
    }
  }, [setPoints]);

  // Get userId from localStorage
  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem("loggedInUser");
      
      if (!loggedInUser) {
        console.warn("User not logged in!");
        setErrorMessage("Please log in to view your bookings.");
        return;
      }

      const user = JSON.parse(loggedInUser);
      const uid = user?.user_id;
      
      if (!uid) {
        console.warn("User ID is not available!");
        setErrorMessage("User ID not found. Please log in again.");
        return;
      }
      
      setUserId(uid);
      
      const storedFeedbacks = JSON.parse(localStorage.getItem("submittedFeedbacks")) || {};
      const restoredRatings = {};
      const restoredComments = {};
      Object.keys(storedFeedbacks).forEach((id) => {
        restoredRatings[id] = storedFeedbacks[id].rating;
        restoredComments[id] = storedFeedbacks[id].comment;
      });
      setSubmittedFeedbacks(Object.fromEntries(Object.keys(storedFeedbacks).map(id => [id, true])));
      setRatings(restoredRatings);
      setFeedbacks(restoredComments);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setErrorMessage("Invalid user data. Please log in again.");
    }
  }, []);

  // Fetch data when userId changes
  useEffect(() => {
    if (!userId) return;
    
    fetchOrders(userId);
    fetchUserPoints(userId);
  }, [userId, fetchOrders, fetchUserPoints]);

  const filteredOrders = orders.filter((order) => {
    const matchesCategory = filter === "all" || order.Category === filter;
    const orderDate = getOrderDate(order);
    const bookingDate = normalizeDate(orderDate);
    const selectedDateStr = selectedDate ? normalizeDate(selectedDate) : null;
    const matchesDate = selectedDateStr ? bookingDate === selectedDateStr : true;
    return matchesCategory && matchesDate;
  });

  const groupedOrders = filteredOrders.reduce((groups, order) => {
    const category = order.Category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(order);
    return groups;
  }, {});

  const handleCancel = async (orderId, order) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      setCancellingId(orderId);
      const response = await axios.delete(
        `https://api.codingboss.in/kovais/delete-booking/?booking_id=${orderId}&user_id=${userId}&role=${order.Category}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 204 || response.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        await fetchUserPoints(userId);
      } else {
        console.error("Failed to cancel order:", response);
        setErrorMessage("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setErrorMessage("Error cancelling booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayment = async (orderId) => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, paymentStatus: "paid" } : order
        )
      );
      setLoading(false);
    }, 1000);
  };

  const handleFeedbackSubmit = async (e, orderId, order) => {
    e.preventDefault();
    if (!ratings[orderId] || !feedbacks[orderId]) {
      alert("Please select a rating and write a review");
      return;
    }

    setSubmittingFeedback(true);
    try {
      await axios.post(`https://api.codingboss.in/kovais/${order.Category}/orders/update/?customer_id=${userId}&order_id=${orderId}`, {
        customer_id: userId, 
        order_id: orderId, 
        order_type: order.Category, 
        rating: ratings[orderId], 
        comment: feedbacks[orderId]
      });
      
      const updated = { ...JSON.parse(localStorage.getItem("submittedFeedbacks") || "{}"), 
        [orderId]: { rating: ratings[orderId], comment: feedbacks[orderId] } 
      };
      localStorage.setItem("submittedFeedbacks", JSON.stringify(updated));
      setSubmittedFeedbacks(prev => ({ ...prev, [orderId]: true }));
    } catch (e) { 
      alert("Error submitting feedback. Please try again."); 
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="history-page">
      {/* Hero Section */}
      <div className="history-hero">
        <div className="history-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge">My Journey</span>
            <h1 className="hero-title">Service History</h1>
            <p className="hero-subtitle">Your personalized booking journey in timeless elegance</p>
          </motion.div>
        </div>
      </div>

      <div className="history-container">
        {/* Points Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="points-banner"
        >
          <div className="points-icon">
            <Gift size={24} />
          </div>
          <div className="points-content">
            <span className="points-label">Loyalty Points</span>
            <span className="points-value">{points || 0}</span>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="filters-section"
        >
          <div className="filter-buttons">
            {["all", "hotel", "spa", "gym", "saloon"].map((type) => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? "active" : ""}`}
                onClick={() => setFilter(type)}
              >
                {type === "all" ? "All Services" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="date-filter">
            <label className="date-filter-label">
              <Calendar size={16} />
              <span>Filter by Date</span>
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              placeholderText="Select a date"
              dateFormat="dd/MM/yyyy"
              className="date-picker-input"
              isClearable
            />
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="error-alert"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && Object.keys(groupedOrders).length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state"
          >
            <div className="empty-icon">
              <ShoppingBag size={64} />
            </div>
            <h3>No Bookings Found</h3>
            <p>
              {filter !== "all" 
                ? `No ${filter} bookings found. Try changing the filter.`
                : "You don't have any upcoming bookings at the moment."
              }
            </p>
            <button className="book-now-btn" onClick={handleBookService}>
              Book Now <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Orders Grid */}
        {!loading && Object.entries(groupedOrders).map(([category, categoryOrders], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="order-group"
          >
            <div className="order-card">
              <div className="card-image-section">
                <div className="image-wrapper">
                  <img
                    src={imagesCategory[category]}
                    alt={category}
                    className="service-image"
                  />
                  <div className="image-overlay"></div>
                  <div className="image-content">
                    <span className="booking-badge">
                      {categoryOrders.length} {categoryOrders.length === 1 ? 'Booking' : 'Bookings'}
                    </span>
                    <h2 className="service-category-title">
                      {category.charAt(0).toUpperCase() + category.slice(1)} Services
                    </h2>
                    <div className="image-info">
                      <div className="info-row">
                        <User size={14} />
                        <span>{categoryOrders[0].guest_name}</span>
                      </div>
                      <div className="info-row">
                        <Calendar size={14} />
                        <span>{categoryOrders[0].date ? normalizeDate(categoryOrders[0].date) : normalizeDate(categoryOrders[0].check_in)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-details-section">
                <div className="service-header">
                  <h3 className="service-name">{categoryOrders[0].category}</h3>
                  {isTrackingAvailable(categoryOrders[0]) && (
                    <span className="tracking-badge">
                      <MapPin size={12} /> Live Tracking
                    </span>
                  )}
                </div>

                <div className="service-details">
                  {category === "hotel" && (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Check-In:</span>
                        <span className="detail-value">{categoryOrders[0].check_in ? normalizeDate(categoryOrders[0].check_in) : 'Not specified'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Room Count:</span>
                        <span className="detail-value">{categoryOrders[0].room_count || 1}</span>
                      </div>
                    </>
                  )}
                  
                  {["spa", "gym", "saloon"].includes(category) && (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{categoryOrders[0].date ? normalizeDate(categoryOrders[0].date) : 'Not specified'}</span>
                      </div>
                      {categoryOrders[0].time && (
                        <div className="detail-item">
                          <span className="detail-label">Time:</span>
                          <span className="detail-value">{categoryOrders[0].time}</span>
                        </div>
                      )}
                      {categoryOrders[0].timeslot && (
                        <div className="detail-item">
                          <span className="detail-label">Time Slot:</span>
                          <span className="detail-value">{categoryOrders[0].timeslot}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {category === "saloon" && categoryOrders[0].gender && (
                    <div className="detail-item">
                      <span className="detail-label">Gender:</span>
                      <span className="detail-value">{categoryOrders[0].gender}</span>
                    </div>
                  )}
                </div>

                {categoryOrders.length > 1 && (
                  <div className="multiple-bookings">
                    <h6>Multiple Bookings Summary</h6>
                    <div className="bookings-list">
                      {categoryOrders.map((order, idx) => (
                        <div key={order.id} className="booking-summary-item">
                          • {order.category} - {order.date ? normalizeDate(order.date) : normalizeDate(order.check_in)} - ₹{order.amount}
                        </div>
                      ))}
                    </div>
                    <div className="total-amount">
                      Total Amount: ₹{categoryOrders.reduce((sum, order) => sum + order.amount, 0)}
                    </div>
                  </div>
                )}

                <div className="price-status">
                  <div className="price">
                    <span className="label">Price</span>
                    <span className="value">₹{categoryOrders[0].amount}</span>
                  </div>
                  <div className="status">
                    <span className="label">Payment</span>
                    <span className={`status-badge ${categoryOrders[0].paymentStatus?.toLowerCase() === "paid" ? "paid" : "pending"}`}>
                      {categoryOrders[0].paymentStatus || 'Pending'}
                    </span>
                  </div>
                  <div className="status">
                    <span className="label">Booking</span>
                    <span className="status-badge confirmed">{categoryOrders[0].status}</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className={`btn-action ${categoryOrders[0].paymentStatus?.toLowerCase() === "pending" ? "btn-pay" : "btn-paid"}`}
                    onClick={() => categoryOrders[0].paymentStatus?.toLowerCase() === "pending" ? handlePayment(categoryOrders[0].id) : null}
                    disabled={categoryOrders[0].paymentStatus?.toLowerCase() === "paid" || loading}
                  >
                    {categoryOrders[0].paymentStatus?.toLowerCase() === "pending" ? (
                      <>
                        <span className="btn-icon">💳</span>
                        Pay Now
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Paid
                      </>
                    )}
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => handleCancel(categoryOrders[0].id, categoryOrders[0])}
                    disabled={cancellingId === categoryOrders[0].id}
                  >
                    {cancellingId === categoryOrders[0].id ? "Cancelling..." : "Cancel Booking"}
                  </button>
                </div>

                {/* Feedback Section */}
                <div className="feedback-section">
                  <div className="feedback-divider"></div>
                  <AnimatePresence mode="wait">
                    {submittedFeedbacks[categoryOrders[0].id] ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="feedback-submitted"
                      >
                        <CheckCircle size={20} />
                        <div>
                          <strong>Thank you for your feedback!</strong>
                          <p>Your feedback helps us improve.</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="feedback-form"
                      >
                        <p className="feedback-label">Rate your experience</p>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={28}
                              className="star-icon"
                              fill={ratings[categoryOrders[0].id] >= star ? "#A07830" : "none"}
                              color={ratings[categoryOrders[0].id] >= star ? "#A07830" : "#d4d4d4"}
                              onClick={() => setRatings(prev => ({ ...prev, [categoryOrders[0].id]: star }))}
                            />
                          ))}
                        </div>
                        <div className="feedback-input-group">
                          <input 
                            type="text"
                            className="feedback-input"
                            placeholder="Write a review..." 
                            value={feedbacks[categoryOrders[0].id] || ""}
                            onChange={(e) => setFeedbacks(prev => ({ ...prev, [categoryOrders[0].id]: e.target.value }))}
                          />
                          <button 
                            className="submit-feedback"
                            disabled={!ratings[categoryOrders[0].id] || !feedbacks[categoryOrders[0].id] || submittingFeedback}
                            onClick={(e) => handleFeedbackSubmit(e, categoryOrders[0].id, categoryOrders[0])}
                          >
                            {submittingFeedback ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;