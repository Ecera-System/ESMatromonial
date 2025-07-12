import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Briefcase,
  Home,
  Heart,
  Camera,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Users,
  GraduationCap,
  Building,
  DollarSign,
  Edit
} from 'lucide-react';
import BackButton from '../../BackButton';
import { useAuth } from '../../../contexts/Chat/AuthContext';
import axios from 'axios';

const ViewProfile = ({ onBackToCreate, isDarkMode }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (user && user._id) fetchProfile();
  }, [user]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const InfoCard = ({ title, icon: Icon, children, gradient = "from-purple-500 to-pink-500" }) => (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }) => {
    if (!value) return null;
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <span className="text-gray-600 font-medium">{label}:</span>
        </div>
        <span className="text-gray-900 font-semibold">{value}</span>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-xl text-red-600">{error}</p>
      </div>
    </div>
  );
  
  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-4 sm:py-6 lg:py-8 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <BackButton />
        </div>
        
        {/* Header - Enhanced Design */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <button
            onClick={onBackToCreate}
            className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-full font-semibold hover:from-gray-500 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Edit</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              {calculateAge(profileData.dateOfBirth) && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{calculateAge(profileData.dateOfBirth)} years old</span>
                </span>
              )}
              {profileData.city && profileData.state && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.city}, {profileData.state}</span>
                  </span>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={onBackToCreate}
            className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Content - Enhanced Layout */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Photos */}
          <div className="lg:col-span-1">
            <InfoCard title="Photos" icon={Camera} gradient="from-pink-500 to-rose-500">
              {profileData.photos.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {profileData.photos.map((photo, index) => (
                    <div key={index} className="relative overflow-hidden rounded-xl">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-64 object-cover rounded-xl border border-gray-200 hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No photos uploaded</p>
                </div>
              )}
            </InfoCard>
          </div>

          {/* Right Column - Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <InfoCard title="Personal Information" icon={User} gradient="from-blue-500 to-purple-600">
              <div className="space-y-1">
                <InfoRow label="Full Name" value={`${profileData.firstName} ${profileData.lastName}`} />
                <InfoRow label="Date of Birth" value={profileData.dateOfBirth} icon={Calendar} />
                <InfoRow label="Age" value={calculateAge(profileData.dateOfBirth).toString()} />
                <InfoRow label="Gender" value={profileData.gender} />
                <InfoRow label="Height" value={profileData.height} />
                <InfoRow label="Marital Status" value={profileData.maritalStatus} />
                <InfoRow label="Religion" value={profileData.religion} />
                <InfoRow label="Mother Tongue" value={profileData.motherTongue} />
              </div>
            </InfoCard>

            {/* Contact Information */}
            <InfoCard title="Contact & Location" icon={MapPin} gradient="from-green-500 to-teal-600">
              <div className="space-y-1">
                <InfoRow label="Email" value={profileData.email} icon={Mail} />
                <InfoRow label="Phone" value={profileData.phone} icon={Phone} />
                <InfoRow label="Country" value={profileData.country} />
                <InfoRow label="State" value={profileData.state} />
                <InfoRow label="City" value={profileData.city} />
                <InfoRow label="Residential Status" value={profileData.residentialStatus} />
              </div>
            </InfoCard>

            {/* Professional Information */}
            <InfoCard title="Professional Information" icon={Briefcase} gradient="from-orange-500 to-red-500">
              <div className="space-y-1">
                <InfoRow label="Education" value={profileData.education} icon={GraduationCap} />
                <InfoRow label="Education Details" value={profileData.educationDetails} />
                <InfoRow label="Occupation" value={profileData.occupation} icon={Building} />
                <InfoRow label="Occupation Details" value={profileData.occupationDetails} />
                <InfoRow label="Annual Income" value={profileData.annualIncome} icon={DollarSign} />
                <InfoRow label="Work Location" value={profileData.workLocation} />
              </div>
            </InfoCard>

            {/* Family Information */}
            <InfoCard title="Family Information" icon={Home} gradient="from-emerald-500 to-green-600">
              <div className="space-y-1">
                <InfoRow label="Family Type" value={profileData.familyType} />
                <InfoRow label="Family Status" value={profileData.familyStatus} />
                <InfoRow label="Father's Occupation" value={profileData.fatherOccupation} />
                <InfoRow label="Mother's Occupation" value={profileData.motherOccupation} />
                <InfoRow label="Siblings" value={profileData.siblings} icon={Users} />
                <InfoRow label="Family Location" value={profileData.familyLocation} />
              </div>
            </InfoCard>

            {/* Lifestyle Information */}
            <InfoCard title="Lifestyle & About Me" icon={Heart} gradient="from-pink-500 to-purple-600">
              <div className="space-y-1">
                <InfoRow label="Diet" value={profileData.diet} />
                <InfoRow label="Smoking" value={profileData.smoking} />
                <InfoRow label="Drinking" value={profileData.drinking} />
                <InfoRow label="Hobbies" value={profileData.hobbies} />
                {profileData.aboutMe && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-500" />
                      About Me
                    </h4>
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                      <p className="text-gray-700 leading-relaxed">{profileData.aboutMe}</p>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Partner Preferences */}
            <InfoCard title="Partner Preferences" icon={Users} gradient="from-indigo-500 to-blue-600">
              <div className="space-y-1">
                <InfoRow 
                  label="Age Range" 
                  value={profileData.partnerAgeMin && profileData.partnerAgeMax ? 
                    `${profileData.partnerAgeMin} - ${profileData.partnerAgeMax} years` : ''} 
                />
                <InfoRow label="Education" value={profileData.partnerEducation} />
                <InfoRow label="Occupation" value={profileData.partnerOccupation} />
                <InfoRow label="Location" value={profileData.partnerLocation} />
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Action Buttons - Enhanced Design */}
        <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={onBackToCreate}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Print Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;