import React from "react";
import { Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  CheckCircle, 
  Home, 
  Calendar, 
  Clock, 
  User, 
  CreditCard,
  PartyPopper,
  Sparkles,
  Scissors,
  X
} from "lucide-react";
import "./ConfirmationPage.css";

const ConfirmationPage = ({
  show,
  onHide,
  transactionId,
  amount,
  paymentMethod,
  bookingSummary,
  onDone,
}) => {
  const handleDone = () => {
    if (onDone) onDone();
    onHide();
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50 
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: {
        duration: 0.2
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const successIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.4,
      },
    },
  };

  const floatingElements = [
    { icon: PartyPopper, delay: 0.8, x: -55, y: -35 },
    { icon: Sparkles, delay: 1.0, x: 55, y: -25 },
    { icon: Sparkles, delay: 1.2, x: -35, y: -55 },
    { icon: PartyPopper, delay: 1.4, x: 45, y: -45 },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotal = () => {
    if (amount) return amount;
    if (bookingSummary?.services) {
      return bookingSummary.services.reduce(
        (sum, service) => sum + parseFloat(String(service.price).replace(/,/g, "")), 
        0
      ).toLocaleString("en-IN");
    }
    return "0";
  };

  const displayAmount = calculateTotal();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="confirmation-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="confirmation-modal-wrapper"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="confirmation-card">
              {/* Close Button */}
              <button 
                className="close-button"
                onClick={handleDone}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="confirmation-container"
              >
                {/* Floating Celebration Elements */}
                <div className="floating-elements">
                  {floatingElements.map((item, index) => (
                    <motion.div
                      key={index}
                      className="floating-element"
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.1, 0.8],
                        x: item.x,
                        y: item.y,
                      }}
                      transition={{
                        duration: 2.5,
                        delay: item.delay,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                    >
                      <item.icon size={22} />
                    </motion.div>
                  ))}
                </div>

                {/* Success Icon */}
                <motion.div 
                  className="success-icon-wrapper"
                  variants={successIconVariants}
                >
                  <div className="success-icon-outer">
                    <div className="success-icon-inner">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      >
                        <Check size={44} strokeWidth={3} color="#ffffff" />
                      </motion.div>
                    </div>
                    <div className="success-ripple"></div>
                  </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants} className="heading-section">
                  <h2 className="confirmation-title">
                    Booking Confirmed!
                  </h2>
                  <p className="confirmation-subtitle">
                    Your appointment has been successfully booked
                  </p>
                </motion.div>

                {/* Booking Details Card */}
                <motion.div 
                  variants={itemVariants}
                  className="booking-details-card"
                >
                  <div className="card-header-decoration"></div>
                  
                  <div className="card-content">
                    {/* Transaction ID */}
                    {transactionId && (
                      <motion.div 
                        className="detail-item"
                        whileHover={{ backgroundColor: "rgba(160, 120, 48, 0.03)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="detail-icon">
                          <CreditCard size={18} />
                        </div>
                        <div className="detail-info">
                          <span className="detail-label">Transaction ID</span>
                          <span className="detail-value highlight">{transactionId}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Services List */}
                    {bookingSummary?.services?.map((service, idx) => (
                      <motion.div 
                        key={idx}
                        className="detail-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(160, 120, 48, 0.03)" }}
                      >
                        <div className="detail-icon">
                          <Scissors size={18} />
                        </div>
                        <div className="detail-info">
                          <span className="detail-label">{service.name}</span>
                          <span className="detail-value price">₹ {service.price}</span>
                        </div>
                      </motion.div>
                    ))}

                    {/* Date */}
                    {bookingSummary?.date && (
                      <motion.div 
                        className="detail-item"
                        whileHover={{ backgroundColor: "rgba(160, 120, 48, 0.03)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="detail-icon">
                          <Calendar size={18} />
                        </div>
                        <div className="detail-info">
                          <span className="detail-label">Date</span>
                          <span className="detail-value">{formatDate(bookingSummary.date)}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Time */}
                    {bookingSummary?.time && (
                      <motion.div 
                        className="detail-item"
                        whileHover={{ backgroundColor: "rgba(160, 120, 48, 0.03)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="detail-icon">
                          <Clock size={18} />
                        </div>
                        <div className="detail-info">
                          <span className="detail-label">Time</span>
                          <span className="detail-value">{bookingSummary.time}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Specialist */}
                    {bookingSummary?.specialist && (
                      <motion.div 
                        className="detail-item"
                        whileHover={{ backgroundColor: "rgba(160, 120, 48, 0.03)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="detail-icon">
                          <User size={18} />
                        </div>
                        <div className="detail-info">
                          <span className="detail-label">Specialist</span>
                          <span className="detail-value">{bookingSummary.specialist}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Total Amount */}
                    <motion.div 
                      className="detail-item total-section"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="detail-info">
                        <span className="detail-label total-label">
                          Amount {paymentMethod === "offline" ? "(Pay at Venue)" : "Paid"}
                        </span>
                        <span className="detail-value total-price">₹ {displayAmount}</span>
                      </div>
                    </motion.div>

                    {/* Payment Method & Status */}
                    <div className="payment-status-row">
                      <motion.div 
                        className="payment-method-item"
                        whileHover={{ 
                          scale: 1.02,
                          borderColor: "#A07830"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="payment-label">Payment</span>
                        <span className="payment-value">
                          {paymentMethod === "offline" ? "Pay at Venue" : paymentMethod}
                        </span>
                      </motion.div>

                      <motion.div 
                        className="status-badge-item"
                        whileHover={{ 
                          scale: 1.02,
                          borderColor: "#A07830"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="payment-label">Status</span>
                        <span className="status-value">
                          <CheckCircle size={16} />
                          {paymentMethod === "offline" ? "Booked" : "Paid"}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div 
                  variants={itemVariants}
                  className="action-section"
                >
                  <motion.button
                    className="done-button"
                    onClick={handleDone}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(160, 120, 48, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Home size={20} />
                    <span>Back to Home</span>
                  </motion.button>

                  <motion.p 
                    className="confirmation-note"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Sparkles size={14} className="inline-icon" />
                    A confirmation has been sent to your registered email & phone
                  </motion.p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationPage;