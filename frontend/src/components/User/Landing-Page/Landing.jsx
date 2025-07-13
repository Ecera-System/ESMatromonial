import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };
  return (
    <div className="font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg h-20 flex items-center justify-between px-4 sm:px-8 z-50 relative">
        <div className="flex items-center space-x-8">
          <img
            src="/assets/Matrimony/save_the_date_card.png"
            alt="Logo"
            className="h-16 w-auto object-contain"
          />

          <div className="hidden lg:flex space-x-6">
            <a
              href="#"
              className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              Home
            </a>
            <a href="#" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Services
            </a>
            <a href="#" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              About
            </a>
            <a href="#" className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={handleSignup}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Signup
          </button>
          {/* Mobile menu icon - you might want to implement a proper mobile menu */}
          <button className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-5rem)] bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden flex items-center justify-center">
        <img
          src="/assets/Matrimony/pine_forest.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-10 blur-sm"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center text-center lg:text-left px-4 max-w-6xl mx-auto">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 animate-fade-in-down">
              Find your <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">forever</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 animate-fade-in-up">
              Discover a world beyond matrimony, where meaningful connections blossom into lifelong partnerships.
            </p>

            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-scale-in">
              Find Your Match
            </button>
          </div>

          <div className="lg:w-1/2 relative">
            <img
              src="/assets/Matrimony/couple_piggyback.png"
              alt="Happy couple"
              className="w-full h-auto object-contain animate-float"
            />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
        </div>
        <style>{`
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-fade-in-down { animation: fade-in-down 1s ease-out forwards; }
          .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; animation-delay: 0.3s; }
          .animate-scale-in { animation: scale-in 0.8s ease-out forwards; animation-delay: 0.6s; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </section>

      {/* Stats Section */}
      <section className="bg-red-600 py-8">
        <div className="container mx-auto flex flex-wrap justify-center items-center gap-8 text-white">
          <div className="text-center px-4">
            <p className="text-2xl font-semibold">80 Lakh Success Stories</p>
          </div>

          <div className="h-8 w-px bg-white"></div>

          <div className="text-center px-4">
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src="/assets/Matrimony/yellow_star_1.svg"
                  alt="Star"
                  className="w-5 h-5 mx-1"
                />
              ))}
            </div>
            <p className="text-2xl font-semibold">#1 Matchmaking Service</p>
          </div>

          <div className="h-8 w-px bg-white"></div>

          <div className="text-center px-4">
            <p className="text-2xl font-semibold">
              Ratings on Playstore by 2.4 lakh users
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <h2 className="text-5xl font-bold text-center mb-16">
          The Shaadi Experience
        </h2>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="border border-gray-300 rounded-xl p-8 hover:shadow-lg transition">
            <div className="flex items-center mb-6">
              <img
                src="/assets/Matrimony/hand_with_coin.svg"
                alt="Money back"
                className="w-10 h-10 mr-4"
              />
              <h3 className="text-xl font-bold">30 Day Money Back Guarantee</h3>
            </div>
            <p className="text-gray-600">
              Get matched with someone special within 30 days, or we'll refund
              your money—guaranteed!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-gray-300 rounded-xl p-8 hover:shadow-lg transition">
            <div className="flex items-center mb-6">
              <img
                src="/assets/Matrimony/blue_checkmark.svg"
                alt="Blue tick"
                className="w-10 h-10 mr-4"
              />
              <h3 className="text-xl font-bold">
                Blue Tick to find your Green Flag
              </h3>
            </div>
            <p className="text-gray-600">
              Did you know our blue-tick profiles get 40% more connection
              requests than others?
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-gray-300 rounded-xl p-8 hover:shadow-lg transition">
            <div className="flex items-center mb-6">
              <img
                src="/assets/Matrimony/lightbulb_idea.png"
                alt="AI"
                className="w-10 h-10 mr-4"
              />
              <h3 className="text-xl font-bold">Matchmaking Powered by AI</h3>
            </div>
            <p className="text-gray-600">
              Cutting-edge technology with two decades of matchmaking expertise
              to help you find "the one".
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-red-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Real Stories, True Connections
          </h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-16">
            Discover how Shaadi has brought together couples through meaningful
            connections and shared journeys. Your success story could be next!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-pink-50 border-2 border-black p-6 rounded-lg">
              <img
                src="/assets/Matrimony/couple_embrace.png"
                alt="Couple"
                className="w-full h-96 object-cover rounded mb-6"
              />
              <h3 className="text-3xl font-bold mb-4">Ajinkya & Ashwini</h3>
              <p className="text-gray-700">
                Thank you, I have found my soulmate on this site. We started
                talking and later involved our parents and everything went well.
                Both families are happy now and we are engaged on 9th May 2025.
              </p>
              <button className="mt-6 bg-teal-200 px-8 py-3 rounded-lg font-bold hover:bg-teal-300 transition">
                View Story
              </button>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-pink-50 border-2 border-black p-6 rounded-lg">
              <img
                src="/assets/Matrimony/traditional_ceremony.png"
                alt="Couple"
                className="w-full h-96 object-cover rounded mb-6"
              />
              <h3 className="text-3xl font-bold mb-4">Shreyashree & Sukdev</h3>
              <p className="text-gray-700">
                Thank you, I have found my soulmate on this site. We started
                talking and later involved our parents and everything went well.
                Both families are happy now and we are engaged on 9th May 2025.
              </p>
              <button className="mt-6 bg-teal-200 px-8 py-3 rounded-lg font-bold hover:bg-teal-300 transition">
                View Story
              </button>
            </div>
          </div>

          <div className="text-center mt-16">
            <button className="bg-green-300 px-12 py-5 rounded-full text-xl font-bold hover:bg-green-400 transition">
              Get Your Match
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-400 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-medium mb-8">
            Trusted matchmakers committed to your perfect match
          </h2>
          <p className="text-xl mb-12 max-w-4xl mx-auto">
            Contact Us for Legal Assistance
          </p>
          <button className="bg-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-950 transition">
            Profession-Based Matching
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">RabDiJodi</h3>
              <p className="mb-4 text-gray-400">
                Trusted matchmakers committed to your perfect match
              </p>
              <div className="flex space-x-4">
                <img
                  src="/assets/Matrimony/facebook_logo.svg"
                  alt="Facebook"
                  className="w-8 h-8"
                />
                <img
                  src="/assets/Matrimony/instagram_logo.svg"
                  alt="Instagram"
                  className="w-8 h-8"
                />
                <img
                  src="/assets/Matrimony/linkedin_logo.svg"
                  alt="LinkedIn"
                  className="w-8 h-8"
                />
                <img
                  src="/assets/Matrimony/youtube_logo.svg"
                  alt="YouTube"
                  className="w-8 h-8"
                />
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6">Useful Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li>About Us</li>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6">Careers</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Blog</li>
                <li>Press</li>
                <li>Partnerships</li>
                <li>Support</li>
                <li>Help Center</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Events</li>
                <li>Community</li>
                <li>Social Media</li>
                <li>Newsletter</li>
                <li>Subscribe</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookies Policy
              </a>
            </div>

            <p className="text-gray-400">
              © 2024 RabDiJodi. All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
