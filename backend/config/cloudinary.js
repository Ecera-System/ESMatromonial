// Cloudinary configuration
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Configure Cloudinary with error checking
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Debug logging
console.log('Cloudinary config attempt:');
console.log('cloud_name:', cloudinaryConfig.cloud_name);
console.log('api_key:', cloudinaryConfig.api_key ? 'Set' : 'Missing');
console.log('api_secret:', cloudinaryConfig.api_secret ? 'Set' : 'Missing');

// Check if all required environment variables are present
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  console.error('Missing Cloudinary credentials:');
  console.error('CLOUDINARY_CLOUD_NAME:', cloudinaryConfig.cloud_name ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_KEY:', cloudinaryConfig.api_key ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_SECRET:', cloudinaryConfig.api_secret ? 'Set' : 'Missing');
  console.error('Make sure your .env file is in the backend directory and contains the Cloudinary credentials');
  throw new Error('Cloudinary credentials are not properly configured');
}

cloudinary.config(cloudinaryConfig);

// Test the configuration
console.log('Cloudinary configured successfully with cloud name:', cloudinaryConfig.cloud_name);

// General upload for any file type
export const uploadFile = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      // Determine folder based on file type
      let folder = 'files';
      let resourceType = 'auto';
      
      if (file.mimetype.startsWith('image/')) {
        folder = 'images';
        resourceType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        folder = 'videos';
        resourceType = 'video';
      } else {
        folder = 'documents';
        resourceType = 'raw';
      }

      return {
        folder: `Matrimony/chat/${folder}`,
        resource_type: resourceType,
        allowed_formats: resourceType === 'image' ? ['jpg', 'jpeg', 'png', 'gif', 'webp'] : undefined,
        transformation: resourceType === 'image' ? [
          { width: 1000, height: 1000, crop: 'limit', quality: 'auto' }
        ] : undefined,
      };
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    // Allow all file types for now
    cb(null, true);
  }
});

export default cloudinary;
