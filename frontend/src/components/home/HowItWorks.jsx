import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    icon: <FaCamera />,
    title: "1. Snap a Photo",
    description: "Spot garbage? Take a clear picture of the waste."
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "2. Pin Location",
    description: "We'll auto-detect your location. Just confirm and submit."
  },
  {
    icon: <FaCheckCircle />,
    title: "3. Get it Cleaned",
    description: "Our workers are notified instantly. Track status in real-time."
  }
];

function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Reporting waste is now as easy as 1-2-3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              // --- FIX: Added 'shadow-lg' and 'border-2' to make cards visible on white bg ---
              className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;