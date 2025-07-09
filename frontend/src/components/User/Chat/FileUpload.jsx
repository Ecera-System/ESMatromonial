import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Image, Video, FileText, X, Upload } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileUpload = ({ onFileSelect, isOpen, onToggle }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const uploadFile = async (file, messageType) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      console.log('Uploading file with token:', !!token);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Add authorization header
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const fileData = response.data.file;
      
      onFileSelect({
        content: fileData.originalName,
        messageType,
        file: fileData
      });

      toast.success('File uploaded successfully!');
      onToggle(false);
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Failed to upload file');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    let messageType = 'file';
    
    if (file.type.startsWith('image/')) {
      messageType = 'image';
    } else if (file.type.startsWith('video/')) {
      messageType = 'video';
    } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
      messageType = 'document';
    }

    uploadFile(file, messageType);
  };

  const fileUploadOptions = [
    {
      icon: Image,
      label: 'Image',
      accept: 'image/*',
      ref: imageInputRef,
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Video,
      label: 'Video',
      accept: 'video/*',
      ref: videoInputRef,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: FileText,
      label: 'Document',
      accept: '.pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx',
      ref: fileInputRef,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="relative">
      {/* Upload Button */}
      <motion.button
        type="button"
        onClick={() => onToggle(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={uploading}
        className={`p-2 rounded-lg transition-colors ${
          isOpen 
            ? 'bg-pink-100 text-pink-600' 
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
        } ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <Paperclip className="w-5 h-5" />
      </motion.button>

      {/* Upload Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-2 left-0 z-50"
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Share File</h3>
                <button
                  onClick={() => onToggle(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {uploading ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-blue-500 animate-bounce" />
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">{uploadProgress}%</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fileUploadOptions.map((option, index) => (
                    <div key={option.label}>
                      <input
                        type="file"
                        ref={option.ref}
                        accept={option.accept}
                        onChange={(e) => handleFileSelect(e, option.label.toLowerCase())}
                        className="hidden"
                        multiple={false}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => option.ref.current?.click()}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${option.color}`}>
                          <option.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
