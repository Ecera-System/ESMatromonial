import React, { useState } from 'react';
import CouponCard from './CouponCard';
import CouponDetail from './CouponDetail';
import couponIcon from '../assets/coupon-icon.jpeg';
import defaultImage from '../assets/sample-coupon.png';
import display from '../assets/Display.jpeg';
import Logo1 from '../assets/Logo1.jpeg';
import Logo2 from '../assets/Logo2.jpeg';
import Logo3 from '../assets/Logo3.jpeg';

const CouponsPage = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Styles
  const styles = {
    page: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    },
    title: {
      fontSize: '2rem',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center',
      padding: '20px 0'
    },
    tabsContainer: {
      marginBottom: '20px',
      backgroundColor: 'white',
      padding: '0 20px'
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #ddd'
    },
    tab: {
      padding: '12px 24px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      color: '#666',
      position: 'relative',
      transition: 'all 0.3s'
    },
    activeTab: {
      color: '#ff6b6b',
      fontWeight: 'bold'
    },
    activeTabAfter: {
      content: '""',
      position: 'absolute',
      bottom: '-1px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#ff6b6b'
    },
    contentContainer: {
      display: 'flex',
      gap: '20px',
      padding: '0 20px',
      '@media (max-width: 768px)': {
        flexDirection: 'column'
      }
    },
    list: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    detail: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      '@media (max-width: 768px)': {
        order: -1,
        marginBottom: '20px'
      }
    },
    noCoupon: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center'
    },
    defaultImage: {
      width: '200px',
      height: 'auto',
      marginBottom: '20px',
      opacity: '1.7'
    },
    noCouponText: {
      color: '#666',
      fontSize: '1.1rem'
    }
  };

  const coupons = [
    {
      id: 1,
      store: 'Gold Membership',
      discount: '20% off',
      description: 'Get 20% off on Gold Membership and enjoy unlimited matches and messaging!',
      terms: 'Valid for new users only. Offer expires July 31, 2025.',
      code: 'GOLD20MATCH',
      logo: Logo1,
    },
    {
      id: 2,
      store: 'Premium Membership',
      discount: 'Flat ₹500 Off',
      description: 'Upgrade to Premium and save ₹300 on yearly subscription!',
      terms: 'Valid only on annual plans.',
      code: 'PREM500OFF',
      logo: Logo2,
    },
    {
      id: 3,
      store: 'Trial Pack',
      discount: 'Free 7-Day Trial',
      description: 'Try our platform with a free 7-day trial.',
      terms: 'Valid for first-time users only. Limited-time offer.',
      code: 'FREE7DAY',
      logo: Logo3,
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
    <div style={styles.page}>
      <h1 style={styles.title}>Coupons</h1>
      
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'all' && styles.activeTab),
              ...(activeTab === 'all' && { ':after': styles.activeTabAfter })
            }}
            onClick={() => setActiveTab('all')}
          >
            All Coupons
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'favorites' && styles.activeTab),
              ...(activeTab === 'favorites' && { ':after': styles.activeTabAfter })
            }}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>
      </div>
      <div style={styles.contentContainer}>
        <div style={styles.list}>
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
        
        <div style={styles.detail}>
          {selectedCoupon ? (
            <CouponDetail coupon={selectedCoupon} />
          ) : (
            <div style={styles.noCoupon}>
              <img src={display} alt="Select a coupon" style={styles.defaultImage} />
              <p style={styles.noCouponText}>Select a coupon to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;