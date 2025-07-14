import Subscriber from '../models/NewsletterSubscriber.js';
import sendNewsletterEmail from '../services/emailService.js';

export const subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    let existing = await Subscriber.findOne({ email });
    if (existing) {
      existing.isSubscribed = true;
      await existing.save();
      return res.status(200).json({ message: 'Re-subscribed successfully' });
    }

    const newSub = new Subscriber({ email });
    await newSub.save();
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const unsubscribe = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await Subscriber.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Not found' });

    user.isSubscribed = false;
    await user.save();
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const sendNewsletter = async (req, res) => {
  const { subject, content } = req.body;

  try {
    const subscribers = await Subscriber.find({ isSubscribed: true });

    for (const sub of subscribers) {
      const unsubscribeLink = `https://yourdomain.com/api/newsletter/unsubscribe/${sub.email}`;
      const htmlContent = `${content}<br><br><a href="${unsubscribeLink}">Unsubscribe</a>`;
      await sendNewsletterEmail(sub.email, subject, htmlContent);
    }

    res.status(200).json({ message: 'Newsletter sent to all subscribers' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send emails' });
  }
};
