import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../../services/couponService';
import toast from 'react-hot-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download,
  Target,
  AlertTriangle,
  Loader
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';

const CouponAnalytics = () => {
  const [dateRange, setDateRange] = useState('6');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [userSegments, setUserSegments] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);
  const [conversionFunnel, setConversionFunnel] = useState([]);

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data in parallel
      const [
        overviewRes,
        revenueRes,
        topPerformersRes,
        userSegmentsRes,
        planDistributionRes,
        conversionFunnelRes
      ] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getRevenueTrends(dateRange),
        analyticsAPI.getTopPerformers(5),
        analyticsAPI.getUserSegments(),
        analyticsAPI.getPlanDistribution(),
        analyticsAPI.getConversionFunnel()
      ]);

      setOverview(overviewRes.data);
      setRevenueData(revenueRes.data);
      setTopPerformers(topPerformersRes.data);
      setUserSegments(userSegmentsRes.data);
      setPlanDistribution(planDistributionRes.data);
      setConversionFunnel(conversionFunnelRes.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') ? '₹' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="3">Last 3 months</option>
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {overview.totalRedemptions.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Total Redemptions</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              ₹{overview.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Revenue Impact</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-red-600 font-medium">-2%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {overview.conversionRate.toFixed(1)}%
            </h3>
            <p className="text-gray-600 text-sm">Conversion Rate</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              ₹{Math.round(overview.avgDiscountValue).toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Avg Discount Value</p>
          </div>
        </div>
      )}

      {/* Revenue and Redemption Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue & Redemption Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis yAxisId="left" stroke="#666" />
              <YAxis yAxisId="right" orientation="right" stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                fill="#8B5CF6"
                fillOpacity={0.1}
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Revenue (₹)"
              />
              <Bar
                yAxisId="right"
                dataKey="redemptions"
                fill="#06B6D4"
                name="Redemptions"
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h2>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <span className="text-sm text-gray-500">{stage.value.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    >
                      {stage.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers and User Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Coupons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Coupons</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformers} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" />
              <YAxis dataKey="code" type="category" width={80} stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue (₹)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Segments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">User Segment Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Coupon Usage by Plan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={planDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="plan" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="usage" fill="#10B981" name="Usage Count" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#F59E0B" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fraud Detection Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          Fraud Detection & Security Alerts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-l-4 bg-yellow-50 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Multiple Usage Attempts</div>
                <div className="text-sm text-gray-600">Monitoring suspicious activity patterns</div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Review
                </button>
                <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700">
                  Flag
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">System Status</div>
                <div className="text-sm text-gray-600">All systems operational</div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  Active
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponAnalytics;

