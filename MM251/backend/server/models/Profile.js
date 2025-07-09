import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  height: {
    type: String,
    required: true
  },
  weight: String,
  maritalStatus: {
    type: String,
    required: true,
    enum: ['Never Married', 'Divorced', 'Widowed', 'Separated']
  },
  religion: {
    type: String,
    required: true
  },
  caste: String,
  motherTongue: {
    type: String,
    required: true
  },
  manglik: String,
  bodyType: String,
  complexion: String,
  physicalStatus: String,

  // Contact Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  residentialStatus: String,

  // Professional Information
  education: {
    type: String,
    required: true
  },
  educationDetails: String,
  occupation: {
    type: String,
    required: true
  },
  occupationDetails: String,
  annualIncome: String,
  workLocation: String,

  // Family Information
  familyType: String,
  familyStatus: String,
  familyValues: String,
  fatherOccupation: String,
  motherOccupation: String,
  siblings: String,
  familyLocation: String,

  // Lifestyle
  diet: String,
  smoking: String,
  drinking: String,
  hobbies: String,
  interests: String,
  aboutMe: String,

  // Partner Preferences
  partnerAgeMin: Number,
  partnerAgeMax: Number,
  partnerHeightMin: String,
  partnerHeightMax: String,
  partnerEducation: String,
  partnerOccupation: String,
  partnerIncome: String,
  partnerLocation: String,
  partnerReligion: String,
  partnerCaste: String,
  partnerMaritalStatus: String,
  partnerAbout: String,

  // Photos
  photos: [{
    url: String,
    publicId: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileViews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search optimization
profileSchema.index({ 
  gender: 1, 
  maritalStatus: 1, 
  religion: 1, 
  city: 1, 
  education: 1 
});



export default mongoose.model('Profile', profileSchema);
