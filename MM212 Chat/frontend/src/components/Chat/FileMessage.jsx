import { motion } from 'framer-motion';
import { Download, Eye, FileText, Image, Video, File } from 'lucide-react';

const FileMessage = ({ message, isOwnMessage }) => {
  const { file, messageType, content } = message;

  const getFileIcon = () => {
    switch (messageType) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    window.open(file.url, '_blank');
  };

  const handleView = () => {
    window.open(file.url, '_blank');
  };

  if (messageType === 'image') {
    return (
      <div className="max-w-sm">
        <div className="relative group">
          <img
            src={file.url}
            alt={content}
            className="w-full h-auto rounded-lg shadow-sm"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleView}
                className="p-2 bg-white bg-opacity-90 rounded-full shadow-lg"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDownload}
                className="p-2 bg-white bg-opacity-90 rounded-full shadow-lg"
              >
                <Download className="w-4 h-4 text-gray-700" />
              </motion.button>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">{content}</p>
      </div>
    );
  }

  if (messageType === 'video') {
    return (
      <div className="max-w-sm">
        <video
          src={file.url}
          controls
          className="w-full h-auto rounded-lg shadow-sm"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        <p className="text-xs text-gray-500 mt-1 truncate">{content}</p>
      </div>
    );
  }

  // For documents and other files
  const FileIcon = getFileIcon();
  
  return (
    <div className={`max-w-xs p-3 rounded-lg border ${
      isOwnMessage 
        ? 'bg-white border-pink-200' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          messageType === 'document' 
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-600'
        }`}>
          <FileIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{content}</p>
          <p className="text-xs text-gray-500">
            {file.format?.toUpperCase()} • {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleView}
          className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
        >
          View
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex-1 px-3 py-1 bg-green-50 text-green-600 rounded text-xs font-medium hover:bg-green-100 transition-colors"
        >
          Download
        </motion.button>
      </div>
    </div>
  );
};

export default FileMessage;
