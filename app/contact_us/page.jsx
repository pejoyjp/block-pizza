"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <div className="py-8">
      <div className='flex justify-center'>
          <img src="/bg/feedback_bg.png" className='w-52 h-52' alt="Contact illustration" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pb-12">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
            Contact Us
          </h1>
          <p className="text-gray-600 mt-4">
            Whether you're a prospective student, current student, or have general inquiries, we're here to help!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <iframe
              width="100%"
              height="400"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-3.180%2C51.485%2C-3.165%2C51.495&amp;layer=mapnik&amp;marker=51.487%2C-3.172"
              title="Cardiff University Location"
              loading="lazy"
            ></iframe>
            <div className="mt-4 text-center">
              <Button onClick={() => window.open('https://www.openstreetmap.org/directions?to=Cardiff+University', '_blank')}>
                Get Directions
              </Button>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Cardiff University</h2>
            <p className="text-gray-700">
              Main Building, Park Place<br/>
              Cardiff, Wales<br/>
              CF10 3AT<br/>
              United Kingdom<br/><br/>
              Phone: +44 (0)11 1111 1111<br/>
              Email: enquiries@cardiff.ac.uk
            </p>
          </div>
        </div>
        <div className="mt-12 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Form</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                <input type="text" {...register('name', { required: true })} id="name" className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm" />
                {errors.name && <span className="text-red-500">This field is required</span>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                <input type="email" {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })} id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm" />
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
              <textarea {...register('message', { required: true })} id="message" className="mt-1 block w-full p-2 border border-gray-300 rounded shadow-sm" rows="4"></textarea>
              {errors.message && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="mt-4">
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;