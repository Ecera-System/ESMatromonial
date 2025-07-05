import React, { useState } from 'react';

const CouponDetail = ({ coupon }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a random coupon code if none is provided
  const couponCode = coupon.code || `${coupon.store.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

  const handleRedeem = () => {
    setShowPopup(true);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="coupon-detail-content">
      <div className="coupon-image-container">
        <img src={coupon.logo} alt={coupon.store} className="store-logo" />
      </div>
      
      <div className="coupon-info">
        <h2>{coupon.store}</h2>
        <p className="discount">{coupon.discount}</p>
        <div className="description-container">
          <p className="description">{coupon.description}</p>
        </div>
      </div>

      <div className="terms-container">
        <h3>Terms & Conditions</h3>
        <p>{coupon.terms}</p>
      </div>

      <button className="redeem-btn" onClick={handleRedeem}>Redeem Now</button>

      {/* Coupon Code Popup */}
      {showPopup && (
        <div className="coupon-popup-overlay">
          <div className="coupon-popup">
            <h3>Your Coupon Code</h3>
            <div className="coupon-code-display">
              <span>{couponCode}</span>
              <button 
                onClick={copyToClipboard}
                className={`copy-btn ${copied ? 'copied' : ''}`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="instructions">Use this code at checkout to get your discount</p>
            <button 
              className="close-popup-btn"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponDetail;