import React, { useState } from 'react';
import CouponCard from './CouponCard';
import CouponDetail from './CouponDetail';
import couponIcon from '../assets/coupon-icon.jpeg';
import defaultImage from '../assets/sample-coupon.png'; // Add this image
import display from '../assets/Coupon-display.jpeg';
import Logo1 from '../assets/Logo1.png';
import Logo2 from '../assets/Logo2.jpeg';
import Logo3 from '../assets/Logo3.jpeg';
import Logo4 from '../assets/Logo4.jpeg';


const CouponsPage = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const coupons = [
    {
      id: 1,
      store: 'H & M',
      discount: '20% off',
      description: 'Shop latest collection and get 20% off',
      terms: 'Valid for first-time customers only',
      code: 'HM20MATCH',
      logo: Logo1, // Store logo
      image: defaultImage, // Coupon image
    },
    {
      id: 2,
      store: 'Dominos',
      discount: 'Grab 15% off on all foot items',
      description: 'Order your favourites now and enjoy!!',
      terms: 'Only valid on oders above Rs.499.',
      logo: Logo2, // Replace with actual logo
    },
    {
      id: 3,
      store: 'Giva',
      discount: '10% off on premium jewellery',
      description: 'Gifting season.Shop now for your loved ones.',
      terms: 'Valid until Oct 2025',
      logo: Logo3, // Replace with actual logo
    },
    {
      id: 4,
      store: 'Lenskart',
      discount: 'Premium Membership',
      description: 'Free* Gold Max Membership for 1 year',
      terms: 'Valid until 31st July 2025',
      logo: Logo4, // Replace with actual logo
    },
  ];

  const toggleFavorite = (couponId) => {
    if (favorites.includes(couponId)) {
      setFavorites(favorites.filter(id => id !== couponId));
    } else {
      setFavorites([...favorites, couponId]);
    }
  };

  const displayedCoupons = activeTab === 'all' 
    ? coupons 
    : coupons.filter(coupon => favorites.includes(coupon.id));

return (
    <div className="coupons-page">
      <h1 className="page-title">Coupons</h1>
      
      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}>
            All Coupons
          </button>
          <button className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}>
            Favorites
          </button>
        </div>
      </div>
      <div className="content-container">
        <div className="coupons-list">
          {displayedCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              couponIcon={couponIcon}
              isFavorite={favorites.includes(coupon.id)}
              onSelect={setSelectedCoupon}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        
        <div className="coupon-detail">
          {selectedCoupon ? (
            <CouponDetail coupon={selectedCoupon} />
          ) : (
            <div className="no-coupon-selected">
              <img src={display} alt="Select a coupon" className="default-image" />
              <p>Select a coupon to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;