import React from 'react';
import { BookOpen, Heart, Home } from 'lucide-react';

const Programs = () => {
  return (
    <div className="bg-saasha-cream py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-saasha-brown sm:text-4xl">Our Programs</h2>
          <p className="mt-4 text-xl text-saasha-brown/70">Making a difference through targeted initiatives</p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <ProgramCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Education Support"
            description="Providing educational resources and mentorship to underprivileged students"
          />
          <ProgramCard
            icon={<Heart className="h-8 w-8" />}
            title="Healthcare Access"
            description="Ensuring communities have access to essential healthcare services"
          />
          <ProgramCard
            icon={<Home className="h-8 w-8" />}
            title="Housing Initiative"
            description="Working to provide safe and affordable housing solutions"
          />
        </div>
      </div>
    </div>
  );
};

const ProgramCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="text-saasha-rose">{icon}</div>
    <h3 className="mt-4 text-xl font-semibold text-saasha-brown">{title}</h3>
    <p className="mt-2 text-saasha-brown/70">{description}</p>
    <a href="#learn-more" className="mt-4 inline-block text-saasha-rose hover:text-saasha-brown transition-colors duration-300">
      Learn more →
    </a>
  </div>
);

export default Programs;