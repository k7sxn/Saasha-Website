import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const ComingSoon = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set launch date to 30 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 26);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
      <span className="text-4xl font-bold text-white">{value}</span>
      <span className="text-sm text-white/70">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-saasha-brown flex flex-col items-center justify-center p-4 text-white">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            saasha
          </h1>
          <Heart className="w-8 h-8 md:w-12 md:h-12 text-saasha-rose ml-4 animate-pulse" />
        </div>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12">
          We're crafting something special to serve our community better.
          <br />Stay tuned for our grand launch!
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <CountdownBox value={countdown.days} label="Days" />
          <CountdownBox value={countdown.hours} label="Hours" />
          <CountdownBox value={countdown.minutes} label="Minutes" />
          <CountdownBox value={countdown.seconds} label="Seconds" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg text-white/80">
              Want to get notified when we launch?
            </p>
            <a 
              href="mailto:help.foundation.saasha@gmail.com"
              className="bg-saasha-rose hover:bg-saasha-brown text-white px-8 py-3 rounded-full transition-colors duration-300 inline-flex items-center"
            >
              Contact Us
            </a>
          </div>

          <div className="text-white/60">
            <p> {new Date().getFullYear()} Saasha Foundation. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
