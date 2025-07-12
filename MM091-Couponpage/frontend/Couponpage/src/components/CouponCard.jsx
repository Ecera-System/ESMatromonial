import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const CouponCard = ({ coupon, couponIcon, isFavorite, onSelect, onToggleFavorite }) => {
  // Styles
  const styles = {
    card: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      marginBottom: '15px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderLeft: '4px solid #ff6b6b',
      ...(isFavorite && {
        borderLeft: '4px solid #ff6b6b',
        backgroundColor: '#fff9f9'
      }),
      ':hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    },
    main: {
      display: 'flex',
      alignItems: 'center',
      flex: 1
    },
    logoSmall: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '15px',
      objectFit: 'cover',
      border: '2px solid #eee'
    },
    info: {
      flex: 1
    },
    storeName: {
      color: '#333',
      marginBottom: '5px'
    },
    discount: {
      fontWeight: 'bold',
      color: '#ff6b6b',
      marginBottom: '5px'
    },
    description: {
      color: '#666',
      fontSize: '0.9rem'
    },
    actions: {
      display: 'flex',
      alignItems: 'center'
    },
    couponIcon: {
      width: '28px',
      height: '28px',
      marginRight: '15px'
    },
    favoriteBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      color: isFavorite ? 'red' : '#ccc',
      transition: 'all 0.2s',
      ':hover': {
        color: '#ff6b6b'
      }
    }
  };

  return (
    <div 
      style={styles.card}
      onClick={() => onSelect(coupon)}
    >
      <div style={styles.main}>
        <img src={coupon.logo} alt={coupon.store} style={styles.logoSmall} />
        <div style={styles.info}>
          <h3 style={styles.storeName}>{coupon.store}</h3>
          <p style={styles.discount}>{coupon.discount}</p>
          <p style={styles.description}>{coupon.description}</p>
        </div>
      </div>
      
      <div style={styles.actions}>
        <img src={couponIcon} alt="Coupon" style={styles.couponIcon} />
        <button 
          style={styles.favoriteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(coupon.id);
          }}
        >
          {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

export default CouponCard;