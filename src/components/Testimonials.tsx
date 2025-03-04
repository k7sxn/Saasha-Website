import React from 'react';

const Testimonials = () => {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-saasha-brown sm:text-4xl">Impact Stories</h2>
        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <TestimonialCard
            quote="Thanks to Saasha, I was able to complete my education and secure a better future for my family."
            author="Sarah Johnson"
            role="Education Program Beneficiary"
            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
          />
          <TestimonialCard
            quote="The healthcare initiative has made a tremendous difference in our community's well-being."
            author="Michael Chen"
            role="Community Leader"
            image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
          />
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role, image }: { quote: string; author: string; role: string; image: string }) => (
  <div className="bg-saasha-cream rounded-lg p-8">
    <div className="flex items-center mb-8">
      <img className="h-12 w-12 rounded-full object-cover" src={image} alt={author} />
      <div className="ml-4">
        <div className="text-lg font-medium text-saasha-brown">{author}</div>
        <div className="text-saasha-rose">{role}</div>
      </div>
    </div>
    <p className="text-saasha-brown/80 italic">"{quote}"</p>
  </div>
);

export default Testimonials;