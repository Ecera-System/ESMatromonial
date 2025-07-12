import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  }
  const handleSignup = () => {
    navigate('/signup');
  }
  return (
    <div className="font-sans bg-white text-black overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="bg-gray-100 h-20 sm:h-24 lg:h-28 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6 sm:space-x-8 lg:space-x-12">
          <img 
            src="/assets/Matrimony/save_the_date_card.png" 
            alt="Logo" 
            className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
          />
          
          <div className="hidden lg:flex space-x-6 xl:space-x-8">
            <a href="#" className="text-lg xl:text-2xl font-semibold hover:text-teal-600 transition-colors">Home</a>
            <a href="#" className="text-lg xl:text-2xl hover:text-teal-600 transition-colors">Services</a>
            <a href="#" className="text-lg xl:text-2xl hover:text-teal-600 transition-colors">About</a>
            <a href="#" className="text-lg xl:text-2xl hover:text-teal-600 transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={handleLogin} className="bg-teal-400 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-bold text-sm sm:text-base lg:text-lg cursor-pointer hover:bg-teal-500 transition-colors">
            Login
          </button>
          <button onClick={handleSignup} className="bg-teal-400 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-bold text-sm sm:text-base lg:text-lg cursor-pointer hover:bg-teal-500 transition-colors">
            Signup
          </button>
          <img 
            src="/assets/Matrimony/87a2197ff62dbde390a5c7601340e371.svg" 
            alt="Menu" 
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-green-900 overflow-hidden">
        <img 
          src="/assets/Matrimony/pine_forest.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 py-12 sm:py-16 lg:py-20">
          <img 
            src="/assets/Matrimony/couple_piggyback.png" 
            alt="Happy couple" 
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mb-6 sm:mb-8"
          />
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 max-w-4xl leading-tight">
            Find your forever
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white mb-8 sm:mb-12">
            Discover a world beyond matrimony
          </p>
          
          <button className="bg-teal-400 text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-teal-500 transition-colors">
            Find Your Match
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-red-600 py-6 sm:py-8">
        <div className="container mx-auto flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-white px-4">
          <div className="text-center px-2 sm:px-4">
            <p className="text-base sm:text-lg lg:text-2xl font-semibold">80 Lakh Success Stories</p>
          </div>
          
          <div className="h-6 sm:h-8 w-px bg-white"></div>
          
          <div className="text-center px-2 sm:px-4">
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <img 
                  key={i}
                  src="/assets/Matrimony/yellow_star_1.svg" 
                  alt="Star" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mx-1"
                />
              ))}
            </div>
            <p className="text-base sm:text-lg lg:text-2xl font-semibold">#1 Matchmaking Service</p>
          </div>
          
          <div className="h-6 sm:h-8 w-px bg-white"></div>
          
          <div className="text-center px-2 sm:px-4">
            <p className="text-base sm:text-lg lg:text-2xl font-semibold">
              Ratings on Playstore by 2.4 lakh users
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">
          The Shaadi Experience
        </h2>
        
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="border border-gray-300 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4 sm:mb-6">
              <img 
                src="/assets/Matrimony/hand_with_coin.svg" 
                alt="Money back" 
                className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 flex-shrink-0"
              />
              <h3 className="text-lg sm:text-xl font-bold">30 Day Money Back Guarantee</h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Get matched with someone special within 30 days, or we'll refund your money—guaranteed!
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="border border-gray-300 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4 sm:mb-6">
              <img 
                src="/assets/Matrimony/blue_checkmark.svg" 
                alt="Blue tick" 
                className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 flex-shrink-0"
              />
              <h3 className="text-lg sm:text-xl font-bold">Blue Tick to find your Green Flag</h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Did you know our blue-tick profiles get 40% more connection requests than others?
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="border border-gray-300 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4 sm:mb-6">
              <img 
                src="/assets/Matrimony/lightbulb_idea.png" 
                alt="AI" 
                className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 flex-shrink-0"
              />
              <h3 className="text-lg sm:text-xl font-bold">Matchmaking Powered by AI</h3>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Cutting-edge technology with two decades of matchmaking expertise to help you find "the one".
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-red-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">
            Real Stories, True Connections
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16 px-4">
            Discover how Shaadi has brought together couples through meaningful connections and shared journeys. Your success story could be next!
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-pink-50 border-2 border-black p-4 sm:p-6 rounded-lg">
              <img 
                src="/assets/Matrimony/couple_embrace.png" 
                alt="Couple" 
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded mb-4 sm:mb-6"
              />
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ajinkya & Ashwini</h3>
              <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
                Thank you, I have found my soulmate on this site. We started talking and later involved our parents and everything went well. Both families are happy now and we are engaged on 9th May 2025.
              </p>
              <button className="bg-teal-200 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:bg-teal-300 transition-colors text-sm sm:text-base">
                View Story
              </button>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-pink-50 border-2 border-black p-4 sm:p-6 rounded-lg">
              <img 
                src="/assets/Matrimony/traditional_ceremony.png" 
                alt="Couple" 
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded mb-4 sm:mb-6"
              />
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Shreyashree & Sukdev</h3>
              <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
                Thank you, I have found my soulmate on this site. We started talking and later involved our parents and everything went well. Both families are happy now and we are engaged on 9th May 2025.
              </p>
              <button className="bg-teal-200 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:bg-teal-300 transition-colors text-sm sm:text-base">
                View Story
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12 sm:mt-16">
            <button className="bg-green-300 px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full text-lg sm:text-xl font-bold hover:bg-green-400 transition-colors">
              Get Your Match
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-800 to-blue-400 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 sm:mb-8">
            Trusted matchmakers committed to your perfect match
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-4xl mx-auto">
            Contact Us for Legal Assistance
          </p>
          <button className="bg-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-950 transition-colors text-sm sm:text-base">
            Profession-Based Matching
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">RabDiJodi</h3>
              <p className="mb-4 text-gray-400 text-sm sm:text-base">
                Trusted matchmakers committed to your perfect match
              </p>
              <div className="flex space-x-4">
                <img src="/assets/Matrimony/facebook_logo.svg" alt="Facebook" className="w-6 h-6 sm:w-8 sm:h-8" />
                <img src="/assets/Matrimony/instagram_logo.svg" alt="Instagram" className="w-6 h-6 sm:w-8 sm:h-8" />
                <img src="/assets/Matrimony/linkedin_logo.svg" alt="LinkedIn" className="w-6 h-6 sm:w-8 sm:h-8" />
                <img src="/assets/Matrimony/youtube_logo.svg" alt="YouTube" className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Useful Links</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li>About Us</li>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Careers</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li>Blog</li>
                <li>Press</li>
                <li>Partnerships</li>
                <li>Support</li>
                <li>Help Center</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Resources</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li>Events</li>
                <li>Community</li>
                <li>Social Media</li>
                <li>Newsletter</li>
                <li>Subscribe</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
              <a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm sm:text-base">Cookies Policy</a>
            </div>
            
            <p className="text-gray-400 text-sm sm:text-base text-center">
              © 2024 RabDiJodi. All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;