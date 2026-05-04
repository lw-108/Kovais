import React, { useState } from 'react';
import './Tc.css';

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setShowModal(false);
    console.log('Terms accepted for THIRAN360AI');
  };

  return (
    <div className="terms-container">
      {/* Header */}
      <header className="terms-header">
        <div className="container">
          <div className="brand-header">
            <div className="brand-logo">Kovais</div>
            <h1>Terms & Conditions</h1>
          </div>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="terms-content">
        <div className="container">
          <div className="content-wrapper">
            {/* Table of Contents */}
            <aside className="toc-sidebar">
              <div className="toc-sticky">
                <h3>Table of Contents</h3>
                <nav className="toc-nav">
                  <a href="#introduction">1. Introduction</a>
                  <a href="#definitions">2. Definitions</a>
                  <a href="#account">3. Account Registration</a>
                  <a href="#services">4. Services</a>
                  <a href="#payments">5. Payments & Billing</a>
                  <a href="#user-responsibilities">6. User Responsibilities</a>
                  <a href="#intellectual-property">7. Intellectual Property</a>
                  <a href="#privacy">8. Privacy</a>
                  <a href="#termination">9. Termination</a>
                  <a href="#disclaimer">10. Disclaimer</a>
                  <a href="#limitation-liability">11. Limitation of Liability</a>
                  <a href="#governing-law">12. Governing Law</a>
                  <a href="#changes">13. Changes to Terms</a>
                  <a href="#contact">14. Contact Information</a>
                </nav>
              </div>
            </aside>

            {/* Terms Content */}
            <article className="terms-article">
              <section id="introduction" className="terms-section">
                <h2>1. Introduction</h2>
                <p>Welcome to THIRAN360AI. These terms and conditions outline the rules and regulations for the use of THIRAN360AI's Website, located at thiran360ai.com.</p>
                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use THIRAN360AI if you do not agree to take all of the terms and conditions stated on this page.</p>
              </section>

              <section id="definitions" className="terms-section">
                <h2>2. Definitions</h2>
                <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements:</p>
                <ul>
                  <li><strong>"Client", "You" and "Your"</strong> refers to you, the person log on this website and compliant to the Company's terms and conditions.</li>
                  <li><strong>"The Company", "Ourselves", "We", "Our" and "Us"</strong> refers to THIRAN360AI.</li>
                  <li><strong>"Party", "Parties", or "Us"</strong> refers to both the Client and ourselves.</li>
                </ul>
              </section>

              <section id="account" className="terms-section">
                <h2>3. Account Registration</h2>
                <p>To access certain features of THIRAN360AI services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
                <p>You are responsible for safeguarding your password and for all activities that occur under your account. You agree not to disclose your password to any third party.</p>
              </section>

              <section id="services" className="terms-section">
                <h2>4. Services</h2>
                <p>THIRAN360AI provides various AI-powered wellness services including but not limited to:</p>
                <ul>
                  <li>AI-driven spa and wellness recommendations</li>
                  <li>Smart gym membership management</li>
                  <li>Intelligent hotel booking systems</li>
                  <li>Personalized salon service coordination</li>
                  <li>360-degree wellness analytics and insights</li>
                </ul>
                <p>We reserve the right to modify, suspend, or discontinue any part of our AI-powered services at any time without prior notice.</p>
              </section>

              <section id="payments" className="terms-section">
                <h2>5. Payments & Billing</h2>
                <h3>5.1 Payment Processing</h3>
                <p>All payments for services booked through THIRAN360AI are processed by THIRAN360AI (Cashfree) as our payment processor. By using our services, you agree to the payment terms and conditions of our payment processor.</p>
                
                <h3>5.2 Billing Information</h3>
                <p>When you make a payment through our platform, you authorize THIRAN360AI to charge the provided payment method for the total amount of your booking. All payment information is processed securely through our payment gateway.</p>
                
                <h3>5.3 Payment Security</h3>
                <p>THIRAN360AI uses industry-standard encryption and security measures to protect your payment information. We do not store your complete payment card details on our servers.</p>

                <div className="payment-notice">
                  <strong>Payment Processor:</strong> All transactions are processed by THIRAN360AI (Cashfree) as the payment processor.
                </div>
              </section>

              {/* Other sections remain similar but updated with THIRAN360AI branding */}
              
              <section id="contact" className="terms-section">
                <h2>14. Contact Information</h2>
                <p>If you have any questions about these Terms, please contact THIRAN360AI:</p>
                <ul>
                  <li>By email: info@kovaisbeauty.com</li>
                  <li>By visiting this page on our website: kovaisbeauty.com/contact</li>
                  <li>By phone: +91 9234567891</li>
                </ul>
              </section>

              {/* Acceptance Section */}
              <div className="acceptance-section">
                <div className="acceptance-box">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I have read and agree to the Kovais Terms and Conditions
                  </label>
                  <button 
                    className={`accept-btn ${accepted ? 'active' : ''}`}
                    onClick={() => accepted && setShowModal(true)}
                    disabled={!accepted}
                  >
                    Accept Terms
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="terms-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Kovais. All rights reserved.</p>
          <nav className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/refund">Refund Policy</a>
            <a href="/contact">Contact Us</a>
          </nav>
          <div className="payment-footer-note">
            <p>Secure payment processing for your safety</p>
          </div>
        </div>
      </footer>

      {/* Acceptance Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Terms Accepted</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              {/* <div className="modal-icon">🤖</div> */}
              <p>Thank you for accepting Kovais Terms and Conditions. You can now continue using our premium wellness services.</p>
            </div>
            <div className="modal-footer">
              <button onClick={handleAccept} className="confirm-btn">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsAndConditions;