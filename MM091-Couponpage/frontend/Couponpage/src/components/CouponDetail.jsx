import React, { useState } from 'react';

const CouponDetail = ({ coupon }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  const couponCode = coupon.code || `${coupon.store.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

  // Styles
  const styles = {
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'left',
      marginBottom: '20px'
    },
    logo: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #ff6b6b'
    },
    info: {
      textAlign: 'left'
    },
    storeName: {
      marginBottom: '10px',
      color: '#333'
    },
    discount: {
      fontSize: '1.5rem',
      marginBottom: '15px',
      fontWeight: 'bold',
      color: '#ff6b6b'
    },
    descriptionContainer: {
      backgroundColor: '#ffffff',
      padding: '15px',
      borderRadius: '8px',
      marginTop: '15px',
      textAlign: 'left'
    },
    description: {
      color: '#0e0202',
      lineHeight: '1.5'
    },
    termsContainer: {
      backgroundColor: '#f5f5f5',
      padding: '15px',
      borderRadius: '8px',
      marginTop: '15px'
    },
    termsTitle: {
      marginBottom: '10px',
      color: '#333',
      textAlign: 'center'
    },
    termsText: {
      color: '#666',
      fontSize: '0.8rem',
      textAlign: 'center'
    },
    redeemBtn: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '4px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'background 0.3s',
      alignSelf: 'center',
      width: '50%',
      ':hover': {
        backgroundColor: '#ff5252'
      }
    },
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    popup: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '400px',
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
    },
    popupTitle: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '1.5rem'
    },
    codeDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      padding: '15px',
      borderRadius: '5px',
      margin: '20px 0'
    },
    codeText: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#ff6b6b',
      letterSpacing: '1px'
    },
    copyBtn: {
      backgroundColor: copied ? '#4CAF50' : '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      ':hover': {
        backgroundColor: copied ? '#4CAF50' : '#ff5252'
      }
    },
    instructions: {
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '20px'
    },
    closeBtn: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      ':hover': {
        backgroundColor: '#e0e0e0'
      }
    }
  };

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
    <div style={styles.content}>
      <div style={styles.imageContainer}>
        <img src={coupon.logo} alt={coupon.store} style={styles.logo} />
      </div>
      
      <div style={styles.info}>
        <h2 style={styles.storeName}>{coupon.store}</h2>
        <p style={styles.discount}>{coupon.discount}</p>
        <div style={styles.descriptionContainer}>
          <p style={styles.description}>{coupon.description}</p>
        </div>
      </div>

      <div style={styles.termsContainer}>
        <h3 style={styles.termsTitle}>Terms & Conditions</h3>
        <p style={styles.termsText}>{coupon.terms}</p>
      </div>

      <button style={styles.redeemBtn} onClick={handleRedeem}>Redeem Now</button>

      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h3 style={styles.popupTitle}>Your Coupon Code</h3>
            <div style={styles.codeDisplay}>
              <span style={styles.codeText}>{couponCode}</span>
              <button 
                onClick={copyToClipboard}
                style={styles.copyBtn}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={styles.instructions}>Use this code at checkout to get your discount</p>
            <button 
              style={styles.closeBtn}
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