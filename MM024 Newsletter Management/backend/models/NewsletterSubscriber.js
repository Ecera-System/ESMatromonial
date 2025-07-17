import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  isSubscribed: { type: Boolean, default: true }
});

export default mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
