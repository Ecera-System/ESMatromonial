import express from 'express';
import Profile from '../models/Profile.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create a new profile
router.post('/', upload.array('photos', 10), async (req, res) => {
  try {
    const profileData = req.body;
    
    // Handle photo uploads
    const photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            folder: 'matrimonial-profiles',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' }
            ]
          });
          
          photoUrls.push({
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: photoUrls.length === 0 // First photo is primary
          });
        } catch (uploadError) {
          console.error('Photo upload error:', uploadError);
        }
      }
    }

    // Create profile with uploaded photos
    const profile = new Profile({
      ...profileData,
      photos: photoUrls,
      dateOfBirth: new Date(profileData.dateOfBirth)
    });

    const savedProfile = await profile.save();
    
    res.status(201).json({
      message: 'Profile created successfully',
      profile: savedProfile
    });
  } catch (error) {
    console.error('Profile creation error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists. Please use a different email address.'
      });
    }
    
    res.status(400).json({
      message: 'Failed to create profile',
      error: error.message
    });
  }
});

// Get all profiles with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      gender,
      religion,
      city,
      state,
      education,
      maritalStatus,
      ageMin,
      ageMax,
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (gender) filter.gender = gender;
    if (religion) filter.religion = religion;
    if (city) filter.city = new RegExp(city, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    if (education) filter.education = education;
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    
    // Age filter
    if (ageMin || ageMax) {
      const today = new Date();
      if (ageMax) {
        const minDate = new Date(today.getFullYear() - ageMax - 1, today.getMonth(), today.getDate());
        filter.dateOfBirth = { $gte: minDate };
      }
      if (ageMin) {
        const maxDate = new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate());
        filter.dateOfBirth = { ...filter.dateOfBirth, $lte: maxDate };
      }
    }

    // Text search
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
        { occupation: new RegExp(search, 'i') }
      ];
    }

    const profiles = await Profile.find(filter)
      .select('-email -phone') // Exclude sensitive information
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Profile.countDocuments(filter);

    res.json({
      profiles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({
      message: 'Failed to fetch profiles',
      error: error.message
    });
  }
});

// Get a single profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Increment profile views
    profile.profileViews += 1;
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update a profile
router.put('/:id', upload.array('photos', 10), async (req, res) => {
  try {
    const profileData = req.body;
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Handle new photo uploads
    if (req.files && req.files.length > 0) {
      // Delete old photos from cloudinary
      for (const photo of profile.photos) {
        if (photo.publicId) {
          await deleteFromCloudinary(photo.publicId);
        }
      }

      // Upload new photos
      const photoUrls = [];
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer, {
            folder: 'matrimonial-profiles',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' }
            ]
          });
          
          photoUrls.push({
            url: result.secure_url,
            publicId: result.public_id,
            isPrimary: photoUrls.length === 0
          });
        } catch (uploadError) {
          console.error('Photo upload error:', uploadError);
        }
      }
      profileData.photos = photoUrls;
    }

    // Update profile
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      { ...profileData, dateOfBirth: new Date(profileData.dateOfBirth) },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Delete a profile
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Delete photos from cloudinary
    for (const photo of profile.photos) {
      if (photo.publicId) {
        await deleteFromCloudinary(photo.publicId);
      }
    }

    await Profile.findByIdAndDelete(req.params.id);

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      message: 'Failed to delete profile',
      error: error.message
    });
  }
});

// Search profiles with advanced filters
router.post('/search', async (req, res) => {
  try {
    const {
      gender,
      ageRange,
      heightRange,
      religion,
      caste,
      education,
      occupation,
      location,
      maritalStatus,
      page = 1,
      limit = 10
    } = req.body;

    const filter = { isActive: true };
    
    // Apply filters
    if (gender) filter.gender = gender;
    if (religion) filter.religion = religion;
    if (caste) filter.caste = caste;
    if (education) filter.education = education;
    if (occupation) filter.occupation = new RegExp(occupation, 'i');
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    
    if (location) {
      filter.$or = [
        { city: new RegExp(location, 'i') },
        { state: new RegExp(location, 'i') },
        { country: new RegExp(location, 'i') }
      ];
    }

    // Age range filter
    if (ageRange && (ageRange.min || ageRange.max)) {
      const today = new Date();
      if (ageRange.max) {
        const minDate = new Date(today.getFullYear() - ageRange.max - 1, today.getMonth(), today.getDate());
        filter.dateOfBirth = { $gte: minDate };
      }
      if (ageRange.min) {
        const maxDate = new Date(today.getFullYear() - ageRange.min, today.getMonth(), today.getDate());
        filter.dateOfBirth = { ...filter.dateOfBirth, $lte: maxDate };
      }
    }

    const profiles = await Profile.find(filter)
      .select('-email -phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Profile.countDocuments(filter);

    res.json({
      profiles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    res.status(500).json({
      message: 'Failed to search profiles',
      error: error.message
    });
  }
});

export default router;