import { Mail, MessageSquare, Instagram, Send, Loader2 } from 'lucide-react';
import { useState, FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import PageLayout from './layout/PageLayout';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'f5af0961-3131-4613-b30e-ba1e8cf7da1e', // Get this from Web3Forms
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageLayout>
      <div className="bg-saasha-cream dark:bg-dark-primary py-4" id="contact">
        <Toaster position="top-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-saasha-brown dark:text-dark-text sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-xl text-saasha-brown/70 dark:text-dark-text/70">
              We’d love to hear from you
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <div className="text-center">
                <div className="flex justify-center text-saasha-rose dark:text-dark-accent">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-saasha-brown dark:text-dark-text">Email</h3>
                <p className="mt-2 text-saasha-brown/70 dark:text-dark-text/70">
                  help.foundation.saasha@gmail.com
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="text-center">
                <div className="flex justify-center text-saasha-rose dark:text-dark-accent">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-saasha-brown dark:text-dark-text">WhatsApp</h3>
                <p className="mt-2 text-saasha-brown/70 dark:text-dark-text/70">
                  Join our community on WhatsApp!
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-16 max-w-xl mx-auto">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-saasha-brown dark:text-dark-text">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  {...register('name')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-saasha-cream'} focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-saasha-brown dark:text-dark-text">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-saasha-cream'} focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-saasha-brown dark:text-dark-text">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  {...register('subject')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-saasha-cream'} focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                  placeholder="How can we help?"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-saasha-brown dark:text-dark-text">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  {...register('message')}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-saasha-cream'} focus:outline-none focus:ring-2 focus:ring-saasha-rose/20`}
                  placeholder="Your message here..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-saasha-brown hover:bg-saasha-rose text-saasha-cream py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
