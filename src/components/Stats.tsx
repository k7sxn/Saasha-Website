import React from 'react';
import { Users, Heart, Globe } from 'lucide-react';

const Stats = () => {
  return (
    <div className="bg-white dark:bg-dark-primary py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <StatCard
            icon={<Users className="h-8 w-8 text-saasha-rose dark:text-dark-accent" />}
            number="50,000+"
            label="Lives Impacted"
          />
          <StatCard
            icon={<Heart className="h-8 w-8 text-saasha-rose dark:text-dark-accent" />}
            number="1,000+"
            label="Volunteers"
          />
          <StatCard
            icon={<Globe className="h-8 w-8 text-saasha-rose dark:text-dark-accent" />}
            number="20+"
            label="Communities Served"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) => (
  <div className="text-center">
    <div className="flex justify-center">{icon}</div>
    <p className="mt-2 text-3xl font-extrabold text-saasha-brown dark:text-dark-text">{number}</p>
    <p className="mt-1 text-xl text-saasha-brown/70 dark:text-dark-text/70">{label}</p>
  </div>
);

export default Stats;