"use client";

import { motion } from "framer-motion";

export default function FeatureCarousel() {

  return (
    <div className="relative hidden h-full flex-col items-center justify-center bg-white p-12 text-gray-900 lg:flex overflow-hidden">
        {/* X Organizations White Background with Top Glow - Rounded */}
        <div
          className="absolute inset-8 z-0 rounded-3xl"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-semibold leading-[0.9] tracking-tight text-white mb-3 max-w-lg">
              Take control of your spending.
            </h2>
            <p className="text-lg text-gray-300 max-w-md mx-auto">
              Discover hidden charges, cancel unwanted subscriptions, and save money effortlessly.
            </p>
          </motion.div>
        </div>
    </div>
  );
}