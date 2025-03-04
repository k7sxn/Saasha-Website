import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-saasha-cream py-24" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-saasha-brown sm:text-4xl">Get in Touch</h2>
          <p className="mt-4 text-xl text-saasha-brown/70">We'd love to hear from you</p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <ContactCard
            icon={<Mail className="h-6 w-6" />}
            title="Email"
            content="contact@saasha.org"
          />
          <ContactCard
            icon={<Phone className="h-6 w-6" />}
            title="Phone"
            content="+1 (555) 123-4567"
          />
          <ContactCard
            icon={<MapPin className="h-6 w-6" />}
            title="Address"
            content="123 Saasha Street, Cityville, ST 12345"
          />
        </div>

        <form className="mt-16 max-w-xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-saasha-brown">Name</label>
              <input 
                type="text" 
                id="name" 
                className="mt-1 block w-full rounded-md border-saasha-rose/20 shadow-sm focus:border-saasha-rose focus:ring focus:ring-saasha-rose/20 bg-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-saasha-brown">Email</label>
              <input 
                type="email" 
                id="email" 
                className="mt-1 block w-full rounded-md border-saasha-rose/20 shadow-sm focus:border-saasha-rose focus:ring focus:ring-saasha-rose/20 bg-white"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-saasha-brown">Message</label>
              <textarea 
                id="message" 
                rows={4} 
                className="mt-1 block w-full rounded-md border-saasha-rose/20 shadow-sm focus:border-saasha-rose focus:ring focus:ring-saasha-rose/20 bg-white"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="bg-saasha-brown text-saasha-cream py-2 px-4 rounded-md hover:bg-saasha-rose transition-colors duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <div className="text-center">
    <div className="flex justify-center text-saasha-rose">{icon}</div>
    <h3 className="mt-4 text-lg font-medium text-saasha-brown">{title}</h3>
    <p className="mt-2 text-saasha-brown/70">{content}</p>
  </div>
);

export default Contact;