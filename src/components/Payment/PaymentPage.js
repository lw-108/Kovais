import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Shield,
  X,
  Receipt,
  Calendar,
  User,
  MapPin,
  Store,
  Coins,
  CreditCard,
  Landmark,
  CalendarCheck,
  Lock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Info,
  RotateCcw,
  Check,
  Loader2,
  ChevronDown,
  Smartphone,
  Banknote,
} from "lucide-react";
import "./PaymentPage.css";

// Generate a fake transaction ID
const generateTransactionId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TXN";
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const PaymentPage = ({
  show,
  onHide,
  bookingSummary,
  onPaymentSuccess,
  onPaymentFailure,
  onBookNowPayLater,
  points = 0,
  onUsePoints,
  showBranchSelect = false,
  showAddressInput = false,
  branches = [],
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  // UPI form state
  const [upiId, setUpiId] = useState("");

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Net Banking state
  const [selectedBank, setSelectedBank] = useState("");

  // Points state
  const [pointsInput, setPointsInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Branch/address state
  const [branch, setBranch] = useState("");
  const [address, setAddress] = useState("");

  const amount = bookingSummary?.amount || 0;
  const finalAmount = Math.max(0, amount - appliedDiscount);

  // Lock body scroll when payment page is shown
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const resetState = () => {
    setPaymentMethod(null);
    setProcessing(false);
    setPaymentResult(null);
    setTransactionId(null);
    setUpiId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardName("");
    setSelectedBank("");
    setPointsInput("");
    setAppliedDiscount(0);
    setBranch("");
    setAddress("");
  };

  const handleClose = () => {
    resetState();
    onHide();
  };

  const handleApplyPoints = () => {
    const pts = parseInt(pointsInput);
    if (isNaN(pts) || pts <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Points",
        text: "Enter a valid number.",
      });
      return;
    }
    if (pts > points) {
      Swal.fire({
        icon: "error",
        title: "Not Enough Points",
        text: `You have ${points} points.`,
      });
      return;
    }
    const discount = pts * 0.1;
    if (discount > amount) {
      Swal.fire({
        icon: "error",
        title: "Exceeds Total",
        text: "Discount exceeds the total amount.",
      });
      return;
    }
    setAppliedDiscount(discount);
    if (onUsePoints) onUsePoints(pts, discount);
    Swal.fire({
      icon: "success",
      title: "Points Applied! 🎉",
      html: `<b>${pts}</b> points applied (₹${discount.toFixed(
        2
      )} discount).<br/>New total: <b>₹${(amount - discount).toFixed(2)}</b>`,
    });
    setPointsInput("");
  };

  const isFormValid = () => {
    if (!paymentMethod) return false;
    if (paymentMethod === "upi") return upiId.includes("@");
    if (paymentMethod === "card") {
      return (
        cardNumber.replace(/\s/g, "").length >= 13 &&
        cardExpiry.length >= 4 &&
        cardCvv.length >= 3 &&
        cardName.length > 0
      );
    }
    if (paymentMethod === "netbanking") return selectedBank.length > 0;
    if (paymentMethod === "offline") return true;
    return false;
  };

  const simulatePayment = () => {
    if (!isFormValid()) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete",
        text: "Please fill all payment details.",
      });
      return;
    }

    setProcessing(true);
    setPaymentResult(null);

    const delay = 2000 + Math.random() * 1000;

    setTimeout(() => {
      const isFailure = Math.random() < 0.1;

      if (isFailure) {
        setProcessing(false);
        setPaymentResult("failed");
        if (onPaymentFailure) {
          onPaymentFailure({ reason: "Transaction declined by bank" });
        }
      } else {
        const txnId = generateTransactionId();
        setTransactionId(txnId);
        setProcessing(false);
        setPaymentResult("success");
        if (onPaymentSuccess) {
          onPaymentSuccess({
            transactionId: txnId,
            paymentMethod,
            amount: finalAmount,
            branch,
            address,
          });
        }
      }
    }, delay);
  };

  const handleRetry = () => {
    setPaymentResult(null);
    setProcessing(false);
  };

  const handleOfflinePayment = () => {
    if (onBookNowPayLater) {
      onBookNowPayLater({ branch, address });
    }
    handleClose();
  };

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    return cleaned;
  };

  const banks = [
    { value: "sbi", label: "State Bank of India" },
    { value: "hdfc", label: "HDFC Bank" },
    { value: "icici", label: "ICICI Bank" },
    { value: "axis", label: "Axis Bank" },
    { value: "kotak", label: "Kotak Mahindra Bank" },
    { value: "bob", label: "Bank of Baroda" },
    { value: "pnb", label: "Punjab National Bank" },
    { value: "canara", label: "Canara Bank" },
  ];

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="payment-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="payment-container"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="payment-header">
              <div className="payment-header-content">
                <div className="payment-header-icon-wrapper">
                  <Shield size={20} strokeWidth={2} />
                </div>
                <h2 className="payment-header-title">Secure Payment</h2>
              </div>
              <button className="payment-close-btn" onClick={handleClose} aria-label="Close payment">
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="payment-body">
              <AnimatePresence mode="wait">
                {/* PROCESSING STATE */}
                {processing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="payment-processing-screen"
                  >
                    <div className="processing-animation">
                      <div className="processing-spinner">
                        <Loader2 size={56} strokeWidth={1.5} className="spinning-icon" />
                      </div>
                      <h3 className="processing-title">Processing Payment...</h3>
                      <p className="processing-text">Please do not close this window</p>
                      <div className="processing-steps">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="step-item completed"
                        >
                          <CheckCircle2 size={16} strokeWidth={2} />
                          <span>Verifying details</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                          className="step-item completed"
                        >
                          <CheckCircle2 size={16} strokeWidth={2} />
                          <span>Contacting bank</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5 }}
                          className="step-item active"
                        >
                          <Loader2 size={16} strokeWidth={2} className="spinning-icon" />
                          <span>Processing transaction</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUCCESS STATE */}
                {!processing && paymentResult === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="payment-result-screen result-success"
                  >
                    <motion.div
                      className="result-icon-wrapper"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <div className="result-icon-circle success-circle">
                        <CheckCircle2 size={48} strokeWidth={2} />
                      </div>
                    </motion.div>
                    <h3 className="result-title">Payment Successful!</h3>
                    <p className="result-subtitle">Your booking has been confirmed</p>

                    <div className="transaction-details">
                      <div className="detail-row">
                        <span>Transaction ID</span>
                        <strong>{transactionId}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Amount Paid</span>
                        <strong className="text-success-color">₹ {finalAmount}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Payment Method</span>
                        <strong className="text-capitalize">{paymentMethod}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Status</span>
                        <strong className="text-success-color">
                          <CheckCircle2 size={14} strokeWidth={2} className="me-1" />
                          Completed
                        </strong>
                      </div>
                    </div>

                    <button className="payment-btn payment-btn-success" onClick={handleClose}>
                      <Check size={18} strokeWidth={2.5} />
                      Done
                    </button>
                  </motion.div>
                )}

                {/* FAILED STATE */}
                {!processing && paymentResult === "failed" && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="payment-result-screen result-failed"
                  >
                    <motion.div
                      className="result-icon-wrapper"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <div className="result-icon-circle danger-circle">
                        <XCircle size={48} strokeWidth={2} />
                      </div>
                    </motion.div>
                    <h3 className="result-title">Payment Failed</h3>
                    <p className="result-subtitle">Transaction declined by bank. Please try again.</p>

                    <div className="failure-info">
                      <Info size={18} strokeWidth={2} className="failure-info-icon" />
                      <span>This might be due to insufficient funds, network issues, or bank server timeout.</span>
                    </div>

                    <div className="failure-actions">
                      <button className="payment-btn payment-btn-dark" onClick={handleRetry}>
                        <RotateCcw size={16} strokeWidth={2.5} />
                        Retry Payment
                      </button>
                      <button className="payment-btn payment-btn-outline" onClick={handleClose}>
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* MAIN PAYMENT FORM */}
                {!processing && !paymentResult && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="payment-form-wrapper"
                  >
                    {/* Booking Summary */}
                    <div className="booking-summary-card">
                      <h6 className="summary-title">
                        <Receipt size={16} strokeWidth={2} />
                        Booking Summary
                      </h6>
                      {bookingSummary?.services?.map((service, idx) => (
                        <div key={idx} className="summary-service-row">
                          <span>{service.name}</span>
                          <span className="fw-semibold">₹ {service.price}</span>
                        </div>
                      ))}
                      {bookingSummary?.date && (
                        <div className="summary-info-row">
                          <Calendar size={13} strokeWidth={2} />
                          {new Date(bookingSummary.date).toLocaleDateString()} at {bookingSummary.time}
                        </div>
                      )}
                      {bookingSummary?.specialist && (
                        <div className="summary-info-row">
                          <User size={13} strokeWidth={2} />
                          {bookingSummary.specialist}
                        </div>
                      )}
                      {bookingSummary?.location && (
                        <div className="summary-info-row">
                          <MapPin size={13} strokeWidth={2} />
                          {bookingSummary.location === "salon"
                            ? "Salon Visit"
                            : "Doorstep Service (+₹250)"}
                        </div>
                      )}
                      <div className="summary-total-row">
                        <span>Total</span>
                        <span className="total-amount">₹ {amount}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <>
                          <div className="summary-discount-row">
                            <span>Points Discount</span>
                            <span className="text-success-color">- ₹ {appliedDiscount.toFixed(2)}</span>
                          </div>
                          <div className="summary-total-row final">
                            <span>Amount to Pay</span>
                            <span className="total-amount">₹ {finalAmount.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Branch Selection */}
                    {showBranchSelect && (
                      <div className="payment-section">
                        <h6 className="section-title">
                          <Store size={16} strokeWidth={2} />
                          Select Branch
                        </h6>
                        <div className="select-wrapper">
                          <select
                            className="payment-select"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                          >
                            <option value="">Choose a branch...</option>
                            {branches.map((b) => (
                              <option key={b.value} value={b.value}>
                                {b.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={16} strokeWidth={2} className="select-chevron" />
                        </div>
                      </div>
                    )}

                    {/* Address Input */}
                    {showAddressInput && (
                      <div className="payment-section">
                        <h6 className="section-title">
                          <MapPin size={16} strokeWidth={2} />
                          Delivery Address
                        </h6>
                        <textarea
                          className="payment-textarea"
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your full address..."
                        />
                      </div>
                    )}

                    {/* Points Section */}
                    {points > 0 && (
                      <div className="payment-section points-section">
                        <h6 className="section-title">
                          <Coins size={16} strokeWidth={2} />
                          Use Reward Points
                        </h6>
                        <div className="points-input-group">
                          <input
                            type="number"
                            className="payment-input points-input"
                            placeholder="Enter points"
                            value={pointsInput}
                            onChange={(e) => setPointsInput(e.target.value)}
                            min="0"
                          />
                          <button
                            className="payment-btn payment-btn-apply"
                            onClick={handleApplyPoints}
                            disabled={!pointsInput || parseInt(pointsInput) <= 0}
                          >
                            Apply
                          </button>
                        </div>
                        <small className="points-available">Available: {points} points</small>
                      </div>
                    )}

                    {/* Payment Methods */}
                    <div className="payment-section">
                      <h6 className="section-title">
                        <CreditCard size={16} strokeWidth={2} />
                        Payment Method
                      </h6>

                      <div className="payment-methods-grid">
                        {/* Pay Later */}
                        <div
                          className={`payment-method-card ${
                            paymentMethod === "offline" ? "selected" : ""
                          }`}
                          onClick={() => setPaymentMethod("offline")}
                        >
                          <div className="method-icon-circle pay-later-icon-circle">
                            <Banknote size={22} strokeWidth={1.8} />
                          </div>
                          <span className="method-name">Pay Later</span>
                          <span className="method-desc">₹0 now</span>
                        </div>

                        {/* UPI */}
                        <div
                          className={`payment-method-card ${
                            paymentMethod === "upi" ? "selected" : ""
                          }`}
                          onClick={() => setPaymentMethod("upi")}
                        >
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                            alt="UPI"
                            className="method-icon-img"
                          />
                          <span className="method-name">UPI</span>
                          <span className="method-desc">GPay, PhonePe</span>
                        </div>

                        {/* Card */}
                        <div
                          className={`payment-method-card ${
                            paymentMethod === "card" ? "selected" : ""
                          }`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <div className="method-icon-circle card-icon-circle">
                            <CreditCard size={22} strokeWidth={1.8} />
                          </div>
                          <span className="method-name">Card</span>
                          <span className="method-desc">Debit/Credit</span>
                        </div>

                        {/* Net Banking */}
                        <div
                          className={`payment-method-card ${
                            paymentMethod === "netbanking" ? "selected" : ""
                          }`}
                          onClick={() => setPaymentMethod("netbanking")}
                        >
                          <div className="method-icon-circle bank-icon-circle">
                            <Landmark size={22} strokeWidth={1.8} />
                          </div>
                          <span className="method-name">Net Banking</span>
                          <span className="method-desc">All Banks</span>
                        </div>
                      </div>

                      {/* Payment Method Forms */}
                      <AnimatePresence mode="wait">
                        {/* UPI Form */}
                        {paymentMethod === "upi" && (
                          <motion.div
                            key="upi"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="payment-form-section"
                          >
                            <div className="upi-apps-row">
                              {[
                                {
                                  name: "Google Pay",
                                  logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg",
                                },
                                {
                                  name: "PhonePe",
                                  logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg",
                                },
                                {
                                  name: "Paytm",
                                  logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
                                },
                                {
                                  name: "BHIM",
                                  logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/BHIM_Logo.png",
                                },
                              ].map((app) => (
                                <div key={app.name} className="upi-app-chip">
                                  <img src={app.logo} alt={app.name} />
                                  {app.name}
                                </div>
                              ))}
                            </div>
                            <div className="form-group">
                              <label className="form-label">UPI ID</label>
                              <input
                                type="text"
                                className="payment-input"
                                placeholder="yourname@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                              <small className="form-hint">
                                Enter your UPI ID (e.g., name@oksbi, name@ybl)
                              </small>
                            </div>
                          </motion.div>
                        )}

                        {/* Card Form */}
                        {paymentMethod === "card" && (
                          <motion.div
                            key="card"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="payment-form-section"
                          >
                            <div className="form-group">
                              <label className="form-label">Card Number</label>
                              <input
                                type="text"
                                className="payment-input"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) =>
                                  setCardNumber(formatCardNumber(e.target.value))
                                }
                                maxLength={19}
                              />
                            </div>
                            <div className="form-row">
                              <div className="form-group half">
                                <label className="form-label">Expiry</label>
                                <input
                                  type="text"
                                  className="payment-input"
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) =>
                                    setCardExpiry(formatExpiry(e.target.value))
                                  }
                                  maxLength={5}
                                />
                              </div>
                              <div className="form-group half">
                                <label className="form-label">CVV</label>
                                <input
                                  type="password"
                                  className="payment-input"
                                  placeholder="•••"
                                  value={cardCvv}
                                  onChange={(e) =>
                                    setCardCvv(
                                      e.target.value.replace(/\D/g, "").slice(0, 4)
                                    )
                                  }
                                  maxLength={4}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Cardholder Name</label>
                              <input
                                type="text"
                                className="payment-input"
                                placeholder="Name on card"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Net Banking Form */}
                        {paymentMethod === "netbanking" && (
                          <motion.div
                            key="netbanking"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="payment-form-section"
                          >
                            <label className="form-label">Select Your Bank</label>
                            <div className="bank-grid">
                              {banks.map((bank) => {
                                const bankLogos = {
                                  sbi: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-Logo.svg",
                                  hdfc: "https://upload.wikimedia.org/wikipedia/commons/c/cc/HDFC_Bank_logo.svg",
                                  icici:
                                    "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
                                  axis: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Axis_Bank_logo.svg",
                                  kotak:
                                    "https://upload.wikimedia.org/wikipedia/commons/3/39/Kotak_Mahindra_Bank_logo.svg",
                                  bob: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Bank_of_Baroda_logo.svg",
                                  pnb: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Punjab_National_Bank_Logo.svg",
                                  canara:
                                    "https://upload.wikimedia.org/wikipedia/commons/8/8e/Canara_Bank_Logo.svg",
                                };
                                return (
                                  <div
                                    key={bank.value}
                                    className={`bank-option ${
                                      selectedBank === bank.value ? "selected" : ""
                                    }`}
                                    onClick={() => setSelectedBank(bank.value)}
                                  >
                                    {bankLogos[bank.value] ? (
                                      <img
                                        src={bankLogos[bank.value]}
                                        alt={bank.label}
                                        className="bank-logo"
                                      />
                                    ) : (
                                      <Landmark size={18} strokeWidth={1.8} className="bank-icon-fallback" />
                                    )}
                                    <span>{bank.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}

                        {/* Offline / Pay Later */}
                        {paymentMethod === "offline" && (
                          <motion.div
                            key="offline"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="payment-form-section offline-section"
                          >
                            <div className="offline-notice">
                              <Info size={20} strokeWidth={2} className="offline-notice-icon" />
                              <div>
                                <strong>Book Now, Pay Later</strong>
                                <p>
                                  Your appointment will be booked. Payment of{" "}
                                  <strong>₹{finalAmount}</strong> can be made at the venue
                                  on the day of your appointment.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Pay Button */}
                    <div className="payment-actions">
                      {paymentMethod === "offline" ? (
                        <button
                          className="payment-btn payment-btn-primary"
                          onClick={handleOfflinePayment}
                        >
                          <CalendarCheck size={18} strokeWidth={2.5} />
                          Confirm Booking (Pay Later)
                        </button>
                      ) : (
                        <button
                          className="payment-btn payment-btn-primary"
                          onClick={simulatePayment}
                          disabled={!isFormValid()}
                        >
                          <Lock size={18} strokeWidth={2.5} />
                          Pay ₹ {finalAmount} Securely
                        </button>
                      )}

                      <div className="security-badges">
                        <span>
                          <Shield size={12} strokeWidth={2} />
                          SSL Secured
                        </span>
                        <span>
                          <Lock size={12} strokeWidth={2} />
                          256-bit Encryption
                        </span>
                        <span>
                          <CheckCircle2 size={12} strokeWidth={2} />
                          PCI DSS Compliant
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentPage;