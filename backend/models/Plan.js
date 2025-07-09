import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [String],
  duration: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  razorpayPlanId: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Plan', planSchema);
