import React from 'react';
import { Heart, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-saasha-brown mb-8">About Saasha</h2>
            <p className="text-lg text-saasha-brown/80 mb-8">
              Saasha was born from the shared vision of two aspiring medical students committed to making healthcare knowledge accessible and actionable. The name "Saasha" not only combines the founders' names but also rhymes with "Aasha," the Hindi word for hope, symbolizing our mission to inspire hope and empowerment through health education and advocacy.
            </p>
            
            <div className="space-y-8">
              <div className="bg-saasha-cream/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 text-saasha-rose mr-3" />
                  <h3 className="text-xl font-semibold text-saasha-brown">Our Mission</h3>
                </div>
                <p className="text-saasha-brown/80">
                  To empower communities through accessible healthcare education and advocacy, creating lasting positive change in people's lives.
                </p>
              </div>

              <div className="bg-saasha-cream/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-saasha-rose mr-3" />
                  <h3 className="text-xl font-semibold text-saasha-brown">Why Saasha?</h3>
                </div>
                <p className="text-saasha-brown/80">
                  We believe in the power of knowledge and community support to transform healthcare outcomes. Our unique approach combines medical expertise with grassroots engagement, ensuring that vital health information reaches those who need it most.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
                alt="Medical professionals collaborating"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-saasha-cream p-6 rounded-xl shadow-lg">
              <p className="text-saasha-brown font-semibold text-lg">Founded in 2023</p>
              <p className="text-saasha-rose">Making healthcare accessible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;