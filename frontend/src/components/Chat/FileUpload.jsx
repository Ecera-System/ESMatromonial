import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Image,
  Video,
  FileText,
  X,
  Upload,
  Send,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/Chat/AuthContext";

const FileUpload = ({ onFileSelect, isOpen, onToggle, onUploadedFile }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const { user } = useAuth();

  const canUploadFiles = () => {
    if (!user || !user.subscription?.isActive) {
      return false;
    }
    const allowedPlans = ["Premium", "Elite VIP"]; // Define allowed plans
    return allowedPlans.includes(user.subscription.planName);
  };

  const handleFileSelect = (event, type) => {
    if (!canUploadFiles()) {
      toast.error(
        "Please subscribe to a Premium, Elite, or VIP plan to send files."
      );
      return;
    }
    const file = event.target.files[0];
    if (!file) return;

    let messageType = "file";

    if (file.type.startsWith("image/")) {
      messageType = "image";
    } else if (file.type.startsWith("video/")) {
      messageType = "video";
    } else if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("text")
    ) {
      messageType = "document";
    }

    uploadFile(file, messageType);
  };

  const handleSendFile = (uploadedFile) => {
    // Send the file via onFileSelect
    onFileSelect({
      content: uploadedFile.content,
      messageType: uploadedFile.messageType,
      file: uploadedFile.file,
    });

    // Remove from uploaded files
    setUploadedFiles((prev) => prev.filter((f) => f.id !== uploadedFile.id));
  };

  const handleRemoveFile = (uploadedFile) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== uploadedFile.id));
  };

  const fileUploadOptions = [
    {
      icon: Image,
      label: "Image",
      accept: "image/*",
      ref: imageInputRef,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      icon: Video,
      label: "Video",
      accept: "video/*",
      ref: videoInputRef,
      color: "text-rose-600 bg-rose-100",
    },
    {
      icon: FileText,
      label: "Document",
      accept: ".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx",
      ref: fileInputRef,
      color: "text-blue-600 bg-blue-100",
    },
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
            ? "bg-rose-100 text-rose-600"
            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        } ${uploading ? "cursor-not-allowed opacity-50" : ""}`}
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
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 sm:p-3 min-w-[180px] sm:min-w-[200px]">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                  Share File
                </h3>
                <button
                  onClick={() => onToggle(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </button>
              </div>

              {uploading ? (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500 animate-bounce" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      Uploading...
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-rose-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {uploadProgress}%
                  </p>
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2">
                  {fileUploadOptions.map((option, index) => (
                    <div key={option.label}>
                      <input
                        type="file"
                        ref={option.ref}
                        accept={option.accept}
                        onChange={(e) =>
                          handleFileSelect(e, option.label.toLowerCase())
                        }
                        className="hidden"
                        multiple={false}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => option.ref.current?.click()}
                        className={`w-full flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors relative ${
                          !canUploadFiles() ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                        disabled={!canUploadFiles()}
                      >
                        <div className={`p-1.5 sm:p-2 rounded-lg ${option.color}`}>
                          <option.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{option.label}</span>
                        {!canUploadFiles() && (
                          <span className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">PRO</span>
                        )}
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="absolute bottom-full mb-2 left-0 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-2 sm:p-3 min-w-[220px] sm:min-w-[250px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900">
              Uploaded Files
            </h3>
            <span className="text-xs text-gray-500">
              {uploadedFiles.length} file(s)
            </span>
          </div>
          <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {file.messageType === "image" && (
                      <Image className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    )}
                    {file.messageType === "video" && (
                      <Video className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                    )}
                    {file.messageType === "document" && (
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    )}
                  </div>
                  <span className="text-xs text-gray-700 truncate">
                    {file.content}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendFile(file)}
                    className="p-1 bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors"
                    title="Send file"
                  >
                    <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveFile(file)}
                    className="p-1 bg-gray-300 hover:bg-gray-400 text-gray-600 rounded transition-colors"
                    title="Remove file"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
