import React, { useState } from "react";
import { Modal, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
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
  bookingSummary, // { serviceName, date, time, amount, services[], location, specialist }
  onPaymentSuccess, // callback with { transactionId, paymentMethod, amount }
  onPaymentFailure, // callback with error info
  onBookNowPayLater, // callback for offline payment
  // Optional: Points system
  points = 0,
  onUsePoints,
  // Optional: Branch/address
  showBranchSelect = false,
  showAddressInput = false,
  branches = [],
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null); // 'upi', 'card', 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // 'success' | 'failed'
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
      Swal.fire({ icon: "warning", title: "Invalid Points", text: "Enter a valid number." });
      return;
    }
    if (pts > points) {
      Swal.fire({ icon: "error", title: "Not Enough Points", text: `You have ${points} points.` });
      return;
    }
    const discount = pts * 0.10; // 1 point = ₹0.10
    if (discount > amount) {
      Swal.fire({ icon: "error", title: "Exceeds Total", text: "Discount exceeds the total amount." });
      return;
    }
    setAppliedDiscount(discount);
    if (onUsePoints) onUsePoints(pts, discount);
    Swal.fire({
      icon: "success",
      title: "Points Applied! 🎉",
      html: `<b>${pts}</b> points applied (₹${discount.toFixed(2)} discount).<br/>New total: <b>₹${(amount - discount).toFixed(2)}</b>`,
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
    return false;
  };

  const simulatePayment = () => {
    if (!isFormValid()) {
      Swal.fire({ icon: "warning", title: "Incomplete", text: "Please fill all payment details." });
      return;
    }

    setProcessing(true);
    setPaymentResult(null);

    // Simulate 2-3 second processing
    const delay = 2000 + Math.random() * 1000;

    setTimeout(() => {
      // 10% chance of failure
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

  return (
    <Modal show={show} onHide={handleClose} centered scrollable className="payment-modal">
      <Modal.Header closeButton className="payment-modal-header text-center">
        <Modal.Title className="fw-bold d-flex flex-row align-items-center justify-content-center w-100 gap-2">
          <i className="fas fa-shield-alt"></i>
          Secure Payment
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="payment-modal-body">
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
                <div className="processing-circle">
                  <Spinner animation="border" variant="primary" style={{ width: "60px", height: "60px" }} />
                </div>
                <h4 className="mt-4 fw-bold">Processing Payment...</h4>
                <p className="text-muted">Please do not close this window</p>
                <div className="processing-steps">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="step-item active"
                  >
                    <i className="fas fa-check-circle"></i> Verifying details
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="step-item active"
                  >
                    <i className="fas fa-check-circle"></i> Contacting bank
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="step-item pending"
                  >
                    <i className="fas fa-spinner fa-spin"></i> Processing transaction
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
              className="payment-result-screen success"
            >
              <motion.div
                className="result-icon success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <i className="fas fa-check-circle"></i>
              </motion.div>
              <h3 className="fw-bold mt-3">Payment Successful!</h3>
              <p className="text-muted">Your booking has been confirmed</p>

              <div className="transaction-details">
                <div className="detail-row">
                  <span>Transaction ID</span>
                  <strong>{transactionId}</strong>
                </div>
                <div className="detail-row">
                  <span>Amount Paid</span>
                  <strong className="text-success">₹ {finalAmount}</strong>
                </div>
                <div className="detail-row">
                  <span>Payment Method</span>
                  <strong className="text-capitalize">{paymentMethod}</strong>
                </div>
                <div className="detail-row">
                  <span>Status</span>
                  <strong className="text-success">
                    <i className="fas fa-check-circle me-1"></i>Completed
                  </strong>
                </div>
              </div>

              <Button variant="success" className="w-100 mt-3 py-2 fw-bold" onClick={handleClose}>
                <i className="fas fa-check me-2"></i>Done
              </Button>
            </motion.div>
          )}

          {/* FAILED STATE */}
          {!processing && paymentResult === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="payment-result-screen failed"
            >
              <motion.div
                className="result-icon failed-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <i className="fas fa-times-circle"></i>
              </motion.div>
              <h3 className="fw-bold mt-3">Payment Failed</h3>
              <p className="text-muted">Transaction declined by bank. Please try again.</p>

              <div className="failure-info">
                <i className="fas fa-info-circle me-2"></i>
                This might be due to insufficient funds, network issues, or bank server timeout.
              </div>

              <div className="d-flex gap-3 mt-4">
                <Button variant="dark" className="flex-grow-1 py-2 fw-bold" onClick={handleRetry}>
                  <i className="fas fa-redo me-2"></i>Retry Payment
                </Button>
                <Button variant="outline-secondary" className="py-2" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* MAIN PAYMENT FORM */}
          {!processing && !paymentResult && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Booking Summary */}
              <div className="booking-summary-card">
                <h6 className="fw-bold mb-3">
                  <i className="fas fa-receipt me-2"></i>Booking Summary
                </h6>
                {bookingSummary?.services?.map((service, idx) => (
                  <div key={idx} className="summary-service-row">
                    <span>{service.name}</span>
                    <span className="fw-bold">₹ {service.price}</span>
                  </div>
                ))}
                {bookingSummary?.date && (
                  <div className="summary-info-row">
                    <i className="fas fa-calendar-alt me-2"></i>
                    {new Date(bookingSummary.date).toLocaleDateString()} at {bookingSummary.time}
                  </div>
                )}
                {bookingSummary?.specialist && (
                  <div className="summary-info-row">
                    <i className="fas fa-user me-2"></i>
                    {bookingSummary.specialist}
                  </div>
                )}
                {bookingSummary?.location && (
                  <div className="summary-info-row">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {bookingSummary.location === "salon" ? "Salon Visit" : "Doorstep Service (+₹250)"}
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
                      <span className="text-success">- ₹ {appliedDiscount.toFixed(2)}</span>
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
                  <h6 className="fw-bold mb-2">
                    <i className="fas fa-store me-2"></i>Select Branch
                  </h6>
                  <Form.Select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="mb-2"
                  >
                    <option value="">Choose a branch...</option>
                    {branches.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              )}

              {/* Address Input */}
              {showAddressInput && (
                <div className="payment-section">
                  <h6 className="fw-bold mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>Delivery Address
                  </h6>
                  <Form.Control
                    as="textarea"
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
                  <h6 className="fw-bold mb-2">
                    <i className="fas fa-coins me-2"></i>Use Reward Points
                  </h6>
                  <div className="d-flex gap-2 align-items-center">
                    <Form.Control
                      type="number"
                      placeholder="Enter points"
                      value={pointsInput}
                      onChange={(e) => setPointsInput(e.target.value)}
                      min="0"
                    />
                    <Button
                      variant="success"
                      onClick={handleApplyPoints}
                      disabled={!pointsInput || parseInt(pointsInput) <= 0}
                    >
                      Apply
                    </Button>
                  </div>
                  <small className="text-muted mt-1 d-block">Available: {points} points</small>
                </div>
              )}

              {/* Payment Methods */}
              <div className="payment-section">
                <h6 className="fw-bold mb-3">
                  <i className="fas fa-credit-card me-2"></i>Payment Method
                </h6>

                <Row className="g-3 mb-4">
                  {/* Book Now Pay Later */}
                  <Col xs={6} md={3}>
                    <div
                      className={`payment-method-card ${paymentMethod === "offline" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("offline")}
                    >
                      <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "8px" }}>
                        <rect x="40" y="65" width="120" height="78" rx="12" fill="#4F46E5" stroke="#1E2937" stroke-width="14"/>
                        <rect x="40" y="88" width="120" height="14" fill="#1E2937"/>
                        <circle cx="135" cy="118" r="26" fill="#F8FAFC" stroke="#FBBF24" stroke-width="10"/>
                        <line x1="135" y1="118" x2="135" y2="102" stroke="#1E2937" stroke-width="5" stroke-linecap="round"/>
                        <line x1="135" y1="118" x2="148" y2="125" stroke="#1E2937" stroke-width="5" stroke-linecap="round"/>
                        <text x="68" y="118" font-family="Arial" font-size="32" font-weight="bold" fill="#F1F5F9" text-anchor="middle" dominant-baseline="middle">$</text>
                      </svg>
                      <span>Pay Later</span>
                      <small>₹0 now</small>
                    </div>
                  </Col>

                  {/* UPI */}
                  <Col xs={6} md={3}>
                    <div
                      className={`payment-method-card ${paymentMethod === "upi" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: "40px", width: "40px", objectFit: "contain", marginBottom: "8px" }} />
                      <span>UPI</span>
                      <small>GPay, PhonePe</small>
                    </div>
                  </Col>

                  {/* Card */}
                  <Col xs={6} md={3}>
                    <div
                      className={`payment-method-card ${paymentMethod === "card" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "8px" }}>
                        <rect x="40" y="65" width="120" height="78" rx="12" fill="#4F46E5" stroke="#1E2937" stroke-width="14"/>
                        <rect x="40" y="88" width="120" height="14" fill="#1E2937"/>
                        <circle cx="135" cy="118" r="26" fill="#F8FAFC" stroke="#FBBF24" stroke-width="10"/>
                        <line x1="135" y1="118" x2="135" y2="102" stroke="#1E2937" stroke-width="5" stroke-linecap="round"/>
                        <line x1="135" y1="118" x2="148" y2="125" stroke="#1E2937" stroke-width="5" stroke-linecap="round"/>
                        <text x="68" y="118" font-family="Arial" font-size="32" font-weight="bold" fill="#F1F5F9" text-anchor="middle" dominant-baseline="middle">$</text>
                      </svg>
                      <span>Card</span>
                      <small>Debit/Credit</small>
                    </div>
                  </Col>

                  {/* Net Banking */}
                  <Col xs={6} md={3}>
                    <div
                      className={`payment-method-card ${paymentMethod === "netbanking" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("netbanking")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style={{ marginBottom: "8px" }}>
                        <title>bank</title>
                        <path d="M11.614 0.673l-10.864 5.231v2.721h22.5v-2.736zM21.75 7.125h-19.5v-0.279l9.386-4.519 10.114 4.534z" fill="#daa520"/>
                        <path d="M2.25 19.125h19.5v1.5h-19.5v-1.5z" fill="#daa520"/>
                        <path d="M0.75 21.75h22.5v1.5h-22.5v-1.5z" fill="#daa520"/>
                        <path d="M2.625 10.125h1.5v7.5h-1.5v-7.5z" fill="#daa520"/>
                        <path d="M19.875 10.125h1.5v7.5h-1.5v-7.5z" fill="#daa520"/>
                        <path d="M15.375 10.125h1.5v7.5h-1.5v-7.5z" fill="#daa520"/>
                        <path d="M7.125 10.125h1.5v7.5h-1.5v-7.5z" fill="#daa520"/>
                        <path d="M11.25 10.125h1.5v7.5h-1.5v-7.5z" fill="#daa520"/>
                      </svg>
                      <span>Net Banking</span>
                      <small>All Banks</small>
                    </div>
                  </Col>
                </Row>

                {/* Payment Method Forms */}
                <AnimatePresence mode="wait">
                  {/* UPI Form */}
                  {paymentMethod === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="payment-form-section"
                    >
                      <div className="upi-apps-row">
                        {[
                          { name: "Google Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" },
                          { name: "PhonePe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" },
                          { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
                          { name: "BHIM", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/BHIM_Logo.png" }
                        ].map((app) => (
                          <div key={app.name} className="upi-app-chip">
                            <img src={app.logo} alt={app.name} style={{ height: "16px", marginRight: "6px" }} />
                            {app.name}
                          </div>
                        ))}
                      </div>
                      <Form.Group className="mt-3">
                        <Form.Label className="fw-medium">UPI ID</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="payment-input"
                        />
                        <Form.Text className="text-muted">
                          Enter your UPI ID (e.g., name@oksbi, name@ybl)
                        </Form.Text>
                      </Form.Group>
                    </motion.div>
                  )}

                  {/* Card Form */}
                  {paymentMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="payment-form-section"
                    >
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="payment-input"
                        />
                      </Form.Group>
                      <Row className="g-3 mb-3">
                        <Col xs={6}>
                          <Form.Label className="fw-medium">Expiry</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                            className="payment-input"
                          />
                        </Col>
                        <Col xs={6}>
                          <Form.Label className="fw-medium">CVV</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            maxLength={4}
                            className="payment-input"
                          />
                        </Col>
                      </Row>
                      <Form.Group>
                        <Form.Label className="fw-medium">Cardholder Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="payment-input"
                        />
                      </Form.Group>
                    </motion.div>
                  )}

                  {/* Net Banking Form */}
                  {paymentMethod === "netbanking" && (
                    <motion.div
                      key="netbanking"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="payment-form-section"
                    >
                      <Form.Label className="fw-medium">Select Your Bank</Form.Label>
                      <div className="bank-grid">
                        {banks.map((bank) => {
                          const bankLogos = {
                            sbi: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-Logo.svg",
                            hdfc: "https://upload.wikimedia.org/wikipedia/commons/c/cc/HDFC_Bank_logo.svg",
                            icici: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
                            axis: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Axis_Bank_logo.svg",
                            kotak: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kotak_Mahindra_Bank_logo.svg",
                            bob: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Bank_of_Baroda_logo.svg",
                            pnb: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Punjab_National_Bank_Logo.svg",
                            canara: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Canara_Bank_Logo.svg"
                          };
                          return (
                            <div
                              key={bank.value}
                              className={`bank-option ${selectedBank === bank.value ? "selected" : ""}`}
                              onClick={() => setSelectedBank(bank.value)}
                            >
                              {bankLogos[bank.value] ? (
                                <img src={bankLogos[bank.value]} alt={bank.label} style={{ height: "20px", marginRight: "8px", maxWidth: "40px", objectFit: "contain" }} />
                              ) : (
                                <i className="fas fa-university me-2"></i>
                              )}
                              {bank.label}
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="payment-form-section offline-info"
                    >
                      <div className="offline-notice">
                        <i className="fas fa-info-circle me-2"></i>
                        <div>
                          <strong>Book Now, Pay Later</strong>
                          <p className="mb-0 mt-1">
                            Your appointment will be booked. Payment of <strong>₹{finalAmount}</strong> can be
                            made at the venue on the day of your appointment.
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
                  <Button
                    variant="success"
                    className="w-100 pay-btn"
                    onClick={handleOfflinePayment}
                  >
                    <i className="fas fa-calendar-check me-2"></i>
                    Confirm Booking (Pay Later)
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-100 pay-btn"
                    onClick={simulatePayment}
                    disabled={!isFormValid()}
                  >
                    <i className="fas fa-lock me-2"></i>
                    Pay ₹ {finalAmount} Securely
                  </Button>
                )}

                <div className="security-badges">
                  <span><i className="fas fa-shield-alt me-1"></i>SSL Secured</span>
                  <span><i className="fas fa-lock me-1"></i>256-bit Encryption</span>
                  <span><i className="fas fa-check-circle me-1"></i>PCI DSS Compliant</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentPage;
