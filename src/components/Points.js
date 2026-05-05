// LoyaltyPoints.jsx
import React, { useState } from 'react';
import './Points.css';

const Icons = {
  Gift: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  Star: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Rupee: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  InformationCircle: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  DocumentText: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
};

const LoyaltyPoints = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pointsHistory] = useState([
    {
      id: 1,
      type: 'signup_bonus',
      points: 200,
      date: '2025-01-15',
      description: 'Welcome Bonus - New Account',
      status: 'credited'
    },
    {
      id: 2,
      type: 'purchase',
      points: 50,
      date: '2025-01-20',
      description: 'Purchase Order #PO-2025-001',
      status: 'credited'
    },
    {
      id: 3,
      type: 'redemption',
      points: -100,
      date: '2025-01-25',
      description: 'Points Redeemed for Discount',
      status: 'debited'
    },
    {
      id: 4,
      type: 'purchase',
      points: 75,
      date: '2025-02-01',
      description: 'Purchase Order #PO-2025-002',
      status: 'credited'
    }
  ]);

  const currentPoints = 225;
  const pointValue = 0.10;
  const totalValue = currentPoints * pointValue;

  const howToEarn = [
    {
      title: 'Account Registration',
      points: '200 points',
      description: 'One-time bonus for creating your account'
    },
    {
      title: 'Purchase Orders',
      points: '1 point per ₹100',
      description: 'Earn points on every purchase order value'
    },
    {
      title: 'Early Payments',
      points: '50 points',
      description: 'Bonus for paying invoices before due date'
    },
    {
      title: 'Referral Program',
      points: '100 points',
      description: 'Refer new business partners and earn bonus'
    }
  ];

  const howToUse = [
    {
      title: 'Discount on Orders',
      description: 'Redeem points for instant discounts on purchase orders',
      conversion: '100 pts = ₹10 off'
    },
    {
      title: 'Priority Support',
      description: 'Use points to get priority customer support',
      conversion: '50 pts/request'
    },
    {
      title: 'Extended Credit',
      description: 'Redeem points for extended payment terms',
      conversion: '200 pts = +15 days'
    }
  ];

  const termsAndConditions = [
    'Points are valid for 12 months from the date of earning',
    'Minimum 100 points required for redemption',
    'Points cannot be transferred or exchanged for cash',
    'Company reserves the right to modify the program terms',
    'Fraudulent activities will result in points forfeiture',
    'Points are non-refundable and cannot be combined with other offers'
  ];

  return (
    <div className="loyalty-container">
      {/* Header Section */}
      <div className="loyalty-header">
        <div className="loyalty-hero">
          <div className="loyalty-hero-icon">
            <Icons.Sparkles />
          </div>
          <div className="loyalty-hero-content">
            <h1 className="loyalty-title">Loyalty Rewards</h1>
            <p className="loyalty-subtitle">Earn points with every purchase and unlock exclusive privileges</p>
          </div>
        </div>
        
        {/* Points Balance Card */}
        <div className="points-balance-card">
          <div className="points-balance-pattern"></div>
          <div className="points-balance-header">
            <Icons.Star />
            <span>Your Balance</span>
          </div>
          <div className="points-balance-main">
            <div className="points-amount">{currentPoints.toLocaleString()}</div>
            <div className="points-label">Reward Points</div>
          </div>
          <div className="points-value">
            <Icons.Rupee />
            <span>₹{totalValue.toFixed(2)}</span>
            <span className="points-rate">1 pt = ₹{pointValue}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="loyalty-tabs">
        <button 
          className={`loyalty-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Icons.InformationCircle />
          <span>Overview</span>
        </button>
        <button 
          className={`loyalty-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Icons.Clock />
          <span>History</span>
        </button>
        <button 
          className={`loyalty-tab ${activeTab === 'earn' ? 'active' : ''}`}
          onClick={() => setActiveTab('earn')}
        >
          <Icons.Star />
          <span>How to Earn</span>
        </button>
        <button 
          className={`loyalty-tab ${activeTab === 'redeem' ? 'active' : ''}`}
          onClick={() => setActiveTab('redeem')}
        >
          <Icons.Gift />
          <span>How to Use</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="loyalty-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon accent">
                  <Icons.Star />
                </div>
                <h3>Point Value</h3>
                <div className="info-value">₹{pointValue}/point</div>
              </div>
              
              <div className="info-card">
                <div className="info-icon accent">
                  <Icons.Gift />
                </div>
                <h3>Welcome Bonus</h3>
                <div className="info-value">200 points</div>
              </div>
              
              <div className="info-card">
                <div className="info-icon accent">
                  <Icons.Clock />
                </div>
                <h3>Validity</h3>
                <div className="info-value">12 months</div>
              </div>
              
              <div className="info-card">
                <div className="info-icon accent">
                  <Icons.CheckCircle />
                </div>
                <h3>Min. Redemption</h3>
                <div className="info-value">100 points</div>
              </div>
            </div>

            <div className="quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn primary">
                  <Icons.Gift />
                  Redeem Points
                </button>
                <button className="action-btn secondary">
                  <Icons.DocumentText />
                  View Statement
                </button>
                <button className="action-btn outline">
                  <Icons.ShieldCheck />
                  Program Terms
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Points History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content">
            <div className="history-header">
              <h3>Transaction History</h3>
              <div className="history-stats">
                <span>Earned: 325</span>
                <span>Redeemed: 100</span>
                <span>Balance: 225</span>
              </div>
            </div>
            
            <div className="transactions-list">
              {pointsHistory.map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    {transaction.status === 'credited' ? (
                      <div className="icon-success">
                        <Icons.CheckCircle />
                      </div>
                    ) : (
                      <div className="icon-debit">
                        <Icons.ArrowRight />
                      </div>
                    )}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">
                      {transaction.description}
                    </div>
                    <div className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className={`transaction-points ${transaction.status}`}>
                    {transaction.status === 'credited' ? '+' : '−'}{Math.abs(transaction.points)} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Earn Tab */}
        {activeTab === 'earn' && (
          <div className="tab-content">
            <h3>Ways to Earn Points</h3>
            <div className="earn-grid">
              {howToEarn.map((item, index) => (
                <div key={index} className="earn-card">
                  <div className="earn-card-accent"></div>
                  <div className="earn-card-header">
                    <div className="earn-icon">
                      <Icons.Star />
                    </div>
                    <div className="earn-points">{item.points}</div>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="earning-tips">
              <h4>Tips to Maximize Points</h4>
              <ul>
                <li>Make regular purchases to accumulate points faster</li>
                <li>Pay invoices early to earn bonus points</li>
                <li>Refer new business partners for referral bonuses</li>
                <li>Check for special promotions and double-point events</li>
              </ul>
            </div>
          </div>
        )}

        {/* How to Use Tab */}
        {activeTab === 'redeem' && (
          <div className="tab-content">
            <h3>Redeem Your Points</h3>
            <div className="redeem-grid">
              {howToUse.map((item, index) => (
                <div key={index} className="redeem-card">
                  <div className="redeem-card-accent"></div>
                  <div className="redeem-card-header">
                    <h4>{item.title}</h4>
                    <div className="redeem-conversion">{item.conversion}</div>
                  </div>
                  <p>{item.description}</p>
                  <button className="redeem-btn">
                    Redeem Now
                    <Icons.ArrowRight />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="redemption-info">
              <h4>Redemption Process</h4>
              <ol>
                <li>Select the redemption option from your dashboard</li>
                <li>Choose how many points you want to redeem</li>
                <li>Confirm the redemption and applicable benefits</li>
                <li>Points will be deducted immediately upon confirmation</li>
                <li>Enjoy your rewards and benefits!</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="loyalty-footer">
        <div className="footer-links">
          <a href="/terms" className="footer-link">
            <Icons.DocumentText />
            Terms & Conditions
          </a>
          <a href="/privacy" className="footer-link">
            <Icons.ShieldCheck />
            Privacy Policy
          </a>
          <a href="/refund" className="footer-link">
            <Icons.ArrowRight />
            Refund & Cancellation
          </a>
        </div>
        
        <div className="terms-section">
          <h4>Program Terms</h4>
          <div className="terms-list">
            {termsAndConditions.map((term, index) => (
              <div key={index} className="term-item">
                <Icons.CheckCircle />
                <span>{term}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="contact-support">
          <p>Need help with your points? <a href="/support">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPoints;