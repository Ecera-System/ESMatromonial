import React from 'react';
import visitor1 from '../../../assets/userprofile/visiter-1.png';
import visitor2 from '../../../assets/userprofile/visiter-2.png';
import visitor3 from '../../../assets/userprofile/visiter-3.png';
import visitor4 from '../../../assets/userprofile/visiter-4.png';

function RecentVisitors() {
  const visitors = [
    { id: 1, image: visitor1 },
    { id: 2, image: visitor2 },
    { id: 3, image: visitor3 },
    { id: 4, image: visitor4 }
  ];

  return (
    <section className="bg-white rounded-2xl p-4 lg:p-8 shadow-lg hover:shadow-xl w-full transition-all duration-300 border border-gray-100">
      <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-gray-800 flex items-center gap-3">
        <span className="text-xl lg:text-2xl">👀</span>
        Recent Visitors
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-6 justify-items-center">
        {visitors.map(visitor => (
          <div
            key={visitor.id}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-transparent hover:border-purple-200"
          >
            <img src={visitor.image} alt={`Visitor ${visitor.id}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentVisitors;
