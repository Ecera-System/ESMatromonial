import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({ sender: String, receiver: String });
export default mongoose.model('Request', requestSchema);