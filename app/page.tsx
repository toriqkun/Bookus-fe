"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Mail, Phone, Instagram, Twitter, Facebook } from "lucide-react";
import Navbar from "../app/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <main id="hero" className="scroll-mt-25 flex flex-col items-center text-center mt-28 md:mt-30 px-4 md:px-6">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-snug"
        >
          Time is Your Book. <br /> Book Your Slot, <br /> Master Your Schedule.
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-gray-600 max-w-lg md:max-w-2xl mt-6 text-sm md:text-base">
          SLOTIFY is the integrated library booking platform that eliminates scheduling conflicts. Reserve time slots for books, reading rooms, or library services with instant notifications.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto"
        >
          <Link href="/login" className="bg-purple-600 text-white rounded-md hover:bg-purple-700 px-6 py-2 cursor-pointer text-center w-full sm:w-auto">
            Get Started
          </Link>
          <Link href="/library" className="rounded-md px-6 py-2 border border-purple-600 text-center w-full sm:w-auto">
            Explore Library
          </Link>
        </motion.div>
      </main>

      {/* Stats */}
      <section className="mt-15 px-6 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { title: "Total Books", value: "12,500+", note: "+5% from last month" },
          { title: "Active Readers", value: "8,230", note: "+12% this month" },
          { title: "Popular Genre", value: "Science Fiction", note: "Most read this month" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 text-center md:text-left"
          >
            <h3 className="text-gray-700 font-medium">{stat.title}</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</p>
            <p className="text-xs md:text-sm text-green-600 mt-1">{stat.note}</p>
          </motion.div>
        ))}
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-25 mt-24 px-6 md:px-10 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-2xl md:text-3xl font-bold text-gray-900">
          Why SLOTIFY?
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-gray-600 mt-4 max-w-2xl md:max-w-3xl mx-auto text-sm md:text-base">
          SLOTIFY was created based on the philosophy that time is your most valuable asset. As a digital library booking system, we provide tools for providers to manage schedules, and for users to
          secure slots in real time.
        </motion.p>

        {/* How it Works */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          {[
            { step: "1. Search & View Slots", desc: "Browse real-time availability.", img: "/1.svg" },
            { step: "2. Instant Booking", desc: "Select a time slot and confirm instantly.", img: "/2.svg" },
            { step: "3. Get Notified", desc: "Receive reminders via email or app.", img: "/3.svg" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center"
            >
              <h3 className="font-semibold text-purple-600">{item.step}</h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base">{item.desc}</p>
              <img src={item.img} alt={item.step} className="mt-4 w-20 h-20 md:w-28 md:h-28" />
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div id="benefits" className="scroll-mt-25 mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-purple-50 rounded-xl p-6 text-left">
            <h4 className="text-lg md:text-xl font-bold text-purple-700">For Users</h4>
            <ul className="list-disc pl-5 mt-3 text-gray-600 space-y-2 text-sm md:text-base">
              <li>24/7 Booking Access</li>
              <li>Instant Confirmation & Reminders</li>
              <li>Quick Resource Access</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-purple-50 rounded-xl p-6 text-left">
            <h4 className="text-lg md:text-xl font-bold text-purple-700">For Service Providers</h4>
            <ul className="list-disc pl-5 mt-3 text-gray-600 space-y-2 text-sm md:text-base">
              <li>Centralized Schedule Management</li>
              <li>Minimize Conflicts & No-Shows</li>
              <li>Analytics & Reporting</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-25 mt-24 px-6 md:px-10 text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-2xl md:text-3xl font-bold text-gray-900">
          Contact Us
        </motion.h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Have questions or need support? Reach out to us!</p>
        <form className="max-w-2xl mx-auto mt-8 space-y-4 px-2">
          <Input placeholder="Your Name" className="w-full rounded-[7px] focus:outline-none focus:ring-0 focus:border-purple-600 text-purple-950" />
          <Input type="email" placeholder="Your Email" className="w-full rounded-[7px] focus:outline-none focus:ring-0 focus:border-purple-600 text-purple-950" />
          <Textarea placeholder="Your Message" className="w-full rounded-[7px] focus:outline-none focus:ring-0 focus:border-purple-600 text-purple-950" rows={6} />
          <Button className="w-full md:w-auto bg-purple-600 text-white rounded-[7px] hover:bg-purple-700 px-6 cursor-pointer">Send Message</Button>
        </form>

        <div className="mt-10 text-gray-600 space-y-2">
          <Link href="" className="flex items-center justify-center gap-2 hover:text-purple-600 text-sm md:text-base">
            <Mail size={18} /> support@slotify.com
          </Link>
          <Link href="" className="flex items-center justify-center gap-2 hover:text-purple-600 text-sm md:text-base">
            <Phone size={18} /> +62 812-3456-7890
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-purple-900 text-white py-6 px-6 md:px-10">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-left">
          <div></div>
          <p className="text-sm sm:ml-0 md:ml-25 md:text-base">© {new Date().getFullYear()} SLOTIFY. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-black">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-black">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-black">
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
