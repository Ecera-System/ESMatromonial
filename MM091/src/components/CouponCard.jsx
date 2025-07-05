import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const CouponCard = ({ coupon, couponIcon, isFavorite, onSelect, onToggleFavorite }) => {
  return (
    <div 
      className={`coupon-card ${isFavorite ? 'favorite' : ''}`}
      onClick={() => onSelect(coupon)}
    >
      <div className="coupon-main">
        <img src={coupon.logo} alt={coupon.store} className="store-logo-small" />
        <div className="coupon-info">
          <h3>{coupon.store}</h3>
          <p className="discount">{coupon.discount}</p>
          <p className="description">{coupon.description}</p>
        </div>
      </div>
      
      <div className="coupon-actions">
        <img src={couponIcon} alt="Coupon" className="coupon-icon" />
        <button 
          className="favorite-btn"
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