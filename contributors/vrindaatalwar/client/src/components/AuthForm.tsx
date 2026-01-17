"use client";

import { Lock, ArrowRight } from "lucide-react"; // Removed ShieldCheck
import { motion } from "framer-motion";
import Image from "next/image"; // 👈 1. Import Image
import logo from "@/components/ui/logo.jpg"; // 👈 2. Import your logo file

export default function AuthForm() {
  return (
    <motion.div 
      className="flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24 bg-white z-10 h-full"
    >
      {/* Branding */}
      <div className="mb-12 flex items-center gap-3">
        {/* 👇 3. REPLACED ICON WITH IMAGE */}
        <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-gray-200 shadow-md">
          <Image 
            src={logo} 
            alt="SubSentry Logo" 
            fill
            className="object-cover" 
          />
        </div>
        
        <span className="text-2xl font-bold tracking-tight text-gray-900">SubSentry</span>
      </div>

      <div className="mb-8">
        <h1 className="mb-1 text-4xl font-medium text-gray-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-gray-500 text-lg">
          Securely manage your subscriptions and track expenses.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <button className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-6 py-4 text-sm font-medium text-white transition-all hover:bg-gray-800">
           <span>Sign in with GitHub</span>
           <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </button>
        
        <button className="group flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-zinc-100">
           <span className="mr-2 text-lg font-bold text-blue-500">G</span> 
           <span>Sign in with Google</span>
        </button>
      </div>

      {/* Footer / Encryption Note */}
      <div className="mt-10 flex items-center justify-center gap-2 rounded-full bg-gray-50 py-2 px-4 w-fit mx-auto border border-gray-100">
        <Lock className="h-3 w-3 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">Bank-grade 256-bit encryption</span>
      </div>
    </motion.div>
  );
}