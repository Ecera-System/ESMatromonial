import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userProfile1 from '../../../assets/userprofile/emma.png';
import userProfile2 from '../../../assets/userprofile/user.png';

const recommendations = [
  {
    id: 1,
    name: 'Emma Johnson',
    age: 25,
    profession: 'Teacher',
    location: 'Santa Angeles, California',
    match: 92,
    avatar: userProfile1,
  },
  {
    id: 2,
    name: 'John Doe',
    age: 28,
    profession: 'Engineer',
    location: 'New York, USA',
    match: 88,
    avatar: userProfile2,
  },
  // Add more profiles as needed
];

function DailyRecommendations() {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSkip = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
      setCurrent((prev) => (prev + 1) % recommendations.length);
    }, 350); // match transition duration
  };

  const handleConnect = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      // Redirect to chat page with default message as query param
      const defaultMsg = encodeURIComponent('Hi, I just sent you an invitation!');
      navigate(`/chat?prefill=${defaultMsg}`);
    }, 1500);
  };

  const rec = recommendations[current];

  return (
    <section className="bg-white rounded-2xl p-4 lg:p-8 shadow-lg w-full border border-gray-100">
      <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6 flex items-center gap-3">
        <span className="text-xl lg:text-2xl">✨</span>
        Daily Recommendations
      </h2>
      <div className="relative min-h-[180px]">
        {/* Animated Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm backdrop-saturate-150">
            <div className="bg-gradient-to-br from-blue-100 via-white to-indigo-100 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center animate-pop-in">
              <div className="text-5xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2 animate-fade-in">Invitation Sent!</h3>
              <p className="text-gray-600 text-center mb-4 animate-fade-in">You've sent an invitation to <span className="font-semibold">{rec.name}</span>.<br/>Redirecting to chat...</p>
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-200 mb-2 animate-fade-in">
                <img src={rec.avatar} alt={rec.name} className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Animations */}
            <style>{`
              .animate-pop-in {
                animation: pop-in 0.5s cubic-bezier(.68,-0.55,.27,1.55);
              }
              @keyframes pop-in {
                0% { transform: scale(0.7); opacity: 0; }
                80% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }
              .animate-fade-in { animation: fade-in 0.7s; }
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </div>
        )}
        <div
          className={`flex items-center gap-8 py-4 w-full transition-all duration-300 ${animate ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
        >
          {/* Profile Info */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg flex-shrink-0">
              <img src={rec.avatar} alt={rec.name} className="w-full h-full object-cover" />
            </div>
            {/* Profile Details */}
            <div className="flex flex-col gap-2 min-w-0">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 m-0 truncate">{rec.name}</h3>
              <p className="text-base lg:text-lg text-gray-600 m-0 font-medium">{rec.age} • {rec.profession}</p>
              <p className="text-sm lg:text-base text-gray-500 m-0 truncate">{rec.location}</p>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 lg:py-3 px-6 lg:px-8 rounded-full mt-2 lg:mt-4 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-indigo-700 text-sm lg:text-base w-fit"
                onClick={handleConnect}
              >
                Connect
              </button>
            </div>
          </div>
          {/* Match Info & Skip Button on right */}
          <div className="flex flex-col items-end justify-center min-w-[120px] lg:min-w-[140px] gap-3 lg:gap-4 ml-auto">
            <div className="text-right">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-1 lg:mb-2">{rec.match}%</div>
              <span className="text-xs lg:text-sm font-semibold text-green-600 bg-green-50 px-3 lg:px-4 py-1 lg:py-2 rounded-full">Perfect Match</span>
            </div>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-full transition-all duration-300 hover:shadow-md hover:scale-105 text-sm lg:text-base"
              onClick={handleSkip}
            >
              ⏭️ Skip
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DailyRecommendations;
