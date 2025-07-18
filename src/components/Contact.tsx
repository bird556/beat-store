import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from '@tabler/icons-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-transparent px-4 md:rounded-2xl md:px-8 ">
      <h2 className="font-bold text-2xl">Contact</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Reach Out If You Have Any Inquires
      </p>

      <form className="my-8 !text-start" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="subject">Subject</Label>
          <Input
            className="!bg-transparent"
            id="subject"
            placeholder="Subject?"
            type="subject"
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            placeholder="Write Message Here"
            type="message"
            required
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Send Email &rarr;
          <BottomGradient />
        </button>

        <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    </div>
  );
};

export default Contact;

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  );
};

const oldContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !validateEmail(formData.email),
      subject: !formData.subject.trim(),
      message: !formData.message.trim(),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', formData);
      // Add your submission logic here (API call, etc.)
      alert('Form submitted successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }
  };
  return (
    <div className=" flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full text-start max-w-lg backdrop-blur-sm bg-transparent rounded-xl shadow-lg px-8 "
      >
        <h2 className="text-2xl font-bold text-white  text-center">
          Contact Us
        </h2>

        {/* Name Field */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white/80 mb-2"
          >
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
              errors.name ? 'border-rose-500' : 'border-white/20'
            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-rose-500">Name is required</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/80 mb-2"
          >
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
              errors.email ? 'border-rose-500' : 'border-white/20'
            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-rose-500">
              {!formData.email.trim()
                ? 'Email is required'
                : 'Please enter a valid email'}
            </p>
          )}
        </div>

        {/* Subject Field */}
        <div className="mb-6">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-white/80 mb-2"
          >
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
              errors.subject ? 'border-rose-500' : 'border-white/20'
            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            placeholder="What's this about?"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-rose-500">Subject is required</p>
          )}
        </div>

        {/* Message Field */}
        <div className="mb-8">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-white/80 mb-2"
          >
            Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className={`w-full px-4 py-3 rounded-lg bg-transparent border ${
              errors.message ? 'border-rose-500' : 'border-white/20'
            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            placeholder="Your message here..."
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-rose-500">Message is required</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};
