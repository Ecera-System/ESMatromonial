import React, { useState, useEffect } from 'react';
import FeedbackSummary from '../components/Feedback/FeedbackSummary';
import FeedbackTable from '../components/Feedback/FeedbackTable';
import FeaturedStories from '../components/Feedback/FeaturedStories'; // <-- this!
import mockFeedback from '../utils/mockFeedbackData';


const AdminFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    // Replace this with actual API call
    setFeedback(mockFeedback);
  }, []);

  const handleFeatureToggle = (id) => {
    setFeedback((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, isFeatured: !fb.isFeatured } : fb))
    );
  };

  const averageRating =
    feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Feedback & Success Analytics</h1>

      <FeedbackSummary averageRating={averageRating.toFixed(2)} totalFeedback={feedback.length} />
      <FeedbackTable feedback={feedback} onFeatureToggle={handleFeatureToggle} />
      <FeaturedStories feedback={feedback} />
    </div>
  );
};

export default AdminFeedbackPage;
