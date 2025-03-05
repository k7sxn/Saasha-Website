import React from 'react';
import { Heart, Users, Globe } from 'lucide-react';

const WhySupport = () => {
  return (
    <section className="py-24 bg-white dark:bg-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-6">Why Support Saasha?</h2>
          <p className="text-xl text-saasha-brown/80 dark:text-dark-text/80 max-w-3xl mx-auto">
            Your support enables us to continue our mission of creating lasting change in underserved communities through education, healthcare, and economic development initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <ReasonCard
            icon={<Heart className="w-12 h-12 text-saasha-rose dark:text-dark-accent" />}
            title="Direct Impact"
            description="100% of your donation goes directly to our programs, ensuring maximum impact in the communities we serve."
          />
          <ReasonCard
            icon={<Users className="w-12 h-12 text-saasha-rose dark:text-dark-accent" />}
            title="Community Focus"
            description="We work closely with local communities to develop sustainable solutions that address their specific needs."
          />
          <ReasonCard
            icon={<Globe className="w-12 h-12 text-saasha-rose dark:text-dark-accent" />}
            title="Proven Track Record"
            description="Our evidence-based approach has successfully transformed thousands of lives across multiple regions."
          />
        </div>

        <div className="mt-16 text-center">
          <button className="bg-saasha-brown hover:bg-saasha-rose dark:bg-dark-accent dark:hover:bg-saasha-rose text-saasha-cream px-8 py-4 rounded-full transition-colors duration-300 text-lg font-medium">
            Make a Difference Today
          </button>
        </div>
      </div>
    </section>
  );
};

const ReasonCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-saasha-cream/30 dark:bg-dark-secondary/30 rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-transform duration-300">
    <div className="flex justify-center mb-6">{icon}</div>
    <h3 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-4">{title}</h3>
    <p className="text-saasha-brown/70 dark:text-dark-text/70">{description}</p>
  </div>
);

export default WhySupport;