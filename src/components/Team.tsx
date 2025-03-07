import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Team = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const teamMembers = [
    { id: 1, name: 'Sarah Chen', role: 'Co-Founder', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Michael Park', role: 'Co-Founder', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80' },
    { id: 3, name: 'Emma Rodriguez', role: 'Social Media Manager', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Alex Wong', role: 'Lead Designer', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80' },
    { id: 5, name: 'Julia Smith', role: 'UI/UX Designer', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80' },
    { id: 6, name: 'David Kim', role: 'Creative Strategist', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80' },
    { id: 7, name: 'Lisa Johnson', role: 'Creative Strategist', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80' },
    { id: 8, name: 'James Wilson', role: 'Content Writer', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80' },
    { id: 9, name: 'Maria Garcia', role: 'Content Writer', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80' },
    { id: 10, name: 'Tom Anderson', role: 'Event Manager', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80' },
    { id: 11, name: 'Ryan Lee', role: 'Photographer', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80' },
    { id: 12, name: 'Sophie Taylor', role: 'Head of Content Creation', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80' }
  ];

  const itemsPerPage = {
    desktop: 4,
    tablet: 3,
    mobile: 2
  };

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === teamMembers.length - itemsPerPage.desktop ? 0 : prevIndex + 1
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, teamMembers.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === teamMembers.length - itemsPerPage.desktop ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? teamMembers.length - itemsPerPage.desktop : prevIndex - 1
    );
  };

  return (
    <section className="py-24 bg-white" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-saasha-brown">Meet The Team</h2>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-saasha-brown text-saasha-cream p-2 rounded-full hover:bg-saasha-rose transition-colors duration-300 z-10"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-saasha-brown text-saasha-cream p-2 rounded-full hover:bg-saasha-rose transition-colors duration-300 z-10"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Team Members Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage.desktop)}%)` }}
            >
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4"
                >
                  <div className="bg-saasha-cream/30 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="mb-4">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-saasha-brown mb-2">{member.name}</h3>
                    <p className="text-saasha-rose">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(teamMembers.length / itemsPerPage.desktop) }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerPage.desktop) === index 
                    ? 'w-8 bg-saasha-brown' 
                    : 'w-2 bg-saasha-rose'
                }`}
                onClick={() => setCurrentIndex(index * itemsPerPage.desktop)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
