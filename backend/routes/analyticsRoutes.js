import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// Debug route to test if routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Analytics routes are working', timestamp: new Date().toISOString() });
});

// Get overview statistics - TEMP: Remove auth
router.get('/overview', async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ 
      isActive: true, 
      expiresAt: { $gt: new Date() } 
    });
    const expiredCoupons = await Coupon.countDocuments({ 
      expiresAt: { $lt: new Date() } 
    });
    
    // Calculate total redemptions and revenue
    const coupons = await Coupon.find({});
    const totalRedemptions = coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0);
    const totalRevenue = coupons.reduce((sum, coupon) => {
      return sum + coupon.redemptions.reduce((redemptionSum, redemption) => {
        return redemptionSum + redemption.discountAmount;
      }, 0);
    }, 0);
    
    // Calculate average discount
    const totalDiscountAmount = coupons.reduce((sum, coupon) => {
      return sum + coupon.redemptions.reduce((redemptionSum, redemption) => {
        return redemptionSum + redemption.discountAmount;
      }, 0);
    }, 0);
    const avgDiscountValue = totalRedemptions > 0 ? totalDiscountAmount / totalRedemptions : 0;
    
    res.json({
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      totalRedemptions,
      totalRevenue,
      avgDiscountValue,
      conversionRate: totalRedemptions > 0 ? (totalRedemptions / totalCoupons) * 100 : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get revenue and redemption trends - TEMP: Remove auth
router.get('/revenue-trends', async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const monthsBack = parseInt(months);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);
    
    const coupons = await Coupon.find({
      'redemptions.redeemedAt': { $gte: startDate }
    });
    
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = monthsBack - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      let monthlyRevenue = 0;
      let monthlyRedemptions = 0;
      let newUsers = new Set();
      
      coupons.forEach(coupon => {
        coupon.redemptions.forEach(redemption => {
          if (redemption.redeemedAt >= monthStart && redemption.redeemedAt <= monthEnd) {
            monthlyRevenue += redemption.discountAmount;
            monthlyRedemptions += 1;
            newUsers.add(redemption.userId);
          }
        });
      });
      
      monthlyData.push({
        month: monthNames[date.getMonth()],
        revenue: monthlyRevenue,
        redemptions: monthlyRedemptions,
        newUsers: newUsers.size
      });
    }
    
    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top performing coupons - TEMP: Remove auth
router.get('/top-performers', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const coupons = await Coupon.find({}).sort({ usageCount: -1 }).limit(parseInt(limit));
    
    const topPerformers = coupons.map(coupon => {
      const revenue = coupon.redemptions.reduce((sum, redemption) => {
        return sum + redemption.discountAmount;
      }, 0);
      
      const conversionRate = coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : 0;
      
      return {
        code: coupon.code,
        redemptions: coupon.usageCount,
        revenue,
        conversionRate: conversionRate.toFixed(1)
      };
    });
    
    res.json(topPerformers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user segments - TEMP: Remove auth
router.get('/user-segments', async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    const userStats = {};
    
    coupons.forEach(coupon => {
      coupon.redemptions.forEach(redemption => {
        if (!userStats[redemption.userId]) {
          userStats[redemption.userId] = {
            redemptions: 0,
            totalSpent: 0,
            plans: new Set()
          };
        }
        userStats[redemption.userId].redemptions += 1;
        userStats[redemption.userId].totalSpent += redemption.originalAmount;
        userStats[redemption.userId].plans.add(redemption.planId);
      });
    });
    
    let newUsers = 0;
    let returningUsers = 0;
    let premiumUsers = 0;
    
    Object.values(userStats).forEach(user => {
      if (user.redemptions === 1) {
        newUsers += 1;
      } else {
        returningUsers += 1;
      }
      
      if (user.plans.has('premium')) {
        premiumUsers += 1;
      }
    });
    
    const totalUsers = Object.keys(userStats).length;
    
    res.json([
      { name: 'New Users', value: Math.round((newUsers / totalUsers) * 100) || 0, color: '#8B5CF6' },
      { name: 'Returning Users', value: Math.round((returningUsers / totalUsers) * 100) || 0, color: '#06B6D4' },
      { name: 'Premium Users', value: Math.round((premiumUsers / totalUsers) * 100) || 0, color: '#10B981' }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get plan distribution - TEMP: Remove auth
router.get('/plan-distribution', async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    const planStats = {
      basic: { usage: 0, revenue: 0 },
      standard: { usage: 0, revenue: 0 },
      premium: { usage: 0, revenue: 0 }
    };
    
    coupons.forEach(coupon => {
      coupon.redemptions.forEach(redemption => {
        if (planStats[redemption.planId]) {
          planStats[redemption.planId].usage += 1;
          planStats[redemption.planId].revenue += redemption.discountAmount;
        }
      });
    });
    
    const planDistribution = Object.entries(planStats).map(([plan, stats]) => ({
      plan: plan.charAt(0).toUpperCase() + plan.slice(1),
      usage: stats.usage,
      revenue: stats.revenue
    }));
    
    res.json(planDistribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversion funnel - TEMP: Remove auth
router.get('/conversion-funnel', async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const couponsWithRedemptions = await Coupon.countDocuments({ usageCount: { $gt: 0 } });
    const totalRedemptions = await Coupon.aggregate([
      { $group: { _id: null, total: { $sum: '$usageCount' } } }
    ]);
    
    const redemptionCount = totalRedemptions.length > 0 ? totalRedemptions[0].total : 0;
    
    // Mock data for demonstration - in real app, you'd track views and attempts
    const mockViews = redemptionCount * 2.5;
    const mockAttempts = redemptionCount * 1.8;
    
    res.json([
      { stage: 'Coupon Views', value: Math.round(mockViews), percentage: 100 },
      { stage: 'Attempted Use', value: Math.round(mockAttempts), percentage: Math.round((mockAttempts / mockViews) * 100) },
      { stage: 'Successful Redemption', value: redemptionCount, percentage: Math.round((redemptionCount / mockViews) * 100) },
      { stage: 'Completed Purchase', value: Math.round(redemptionCount * 0.85), percentage: Math.round((redemptionCount * 0.85 / mockViews) * 100) }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
