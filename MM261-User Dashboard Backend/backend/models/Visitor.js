import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', //it match the name of your User model
    required: true
  },
  visitedAt: {
    type: Date,
    default: Date.now
  }
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
