"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/components/ui/logo.jpg"; 

import { ArrowRight } from "lucide-react"; 
import { motion } from "framer-motion";
import Prism from "@/components/Prism";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 z-0">
         <Prism 
            timeScale={0.3}
            scale={3.5}
            glow={0.6}
            baseWidth={4.8}
            hueShift={0.36}
         />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950 pointer-events-none" />

      <nav className="relative z-50 flex items-center justify-between px-6 py-4 md:px-16 lg:px-24">
        <div className="flex items-center gap-2">

          <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-lg shadow-indigo-500/20">
             <Image 
               src={logo}          
               alt="SubSentry Logo" 
               fill
               className="object-cover" 
             />
          </div>

          <span className="text-xl font-bold tracking-tight">SubSentry</span>
        </div>
        <Link 
            href="/auth" 
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
            Log in
        </Link>
      </nav>

      <main className="relative z-10 flex h-[calc(100vh-100px)] flex-col items-center justify-center px-4 text-center">

        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 max-w-4xl tracking-tight"
        >
          <span className="block text-white font-extralight text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
            Stop paying for
          </span>
          
          <span className="block font-semibold bg-white bg-clip-text text-transparent text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
            unused subscriptions.
          </span>
        </motion.h1>

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 md:mb-10 max-w-xl text-base md:text-lg text-gray-400 leading-relaxed drop-shadow-md px-4"
        >
            Connect your accounts, find hidden charges, and cancel them with one click. 
            Join 10,000+ users saving money today.
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-4 sm:flex-row w-full sm:w-auto"
        >
          <Button 
            onClick={() => window.location.href = '/auth'}
            size="lg"
            className="gap-2 group bg-white hover:bg-zinc-300 text-black border-0"
          >
            Start Saving for Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
}