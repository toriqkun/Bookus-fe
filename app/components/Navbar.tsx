"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <>
      {/* Header (selalu kelihatan) */}
      <header className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md flex items-center justify-between px-6 md:px-10 py-3 shadow z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/brand.png" alt="SLOTIFY" className="w-20" />
        </div>

        {/* Desktop only: Sign In / Sign Up */}
        <nav className="hidden md:flex gap-3 items-center">
          <Link
            href="/login"
            className="rounded-md py-2 px-4 border border-purple-600"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          {open ? (
            <X
              size={28}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          ) : (
            <Menu
              size={28}
              onClick={() => setOpen(true)}
              className="cursor-pointer"
            />
          )}
        </div>
      </header>

      {/* Overlay + Drawer (keluar dari header, cover full screen) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay full screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-screen w-4/5 sm:w-1/2 bg-white shadow-lg z-50 flex flex-col"
            >
              {/* Header with Close */}
              <div className="flex items-center justify-end p-4">
                <X
                  size={28}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-gray-700 hover:text-purple-950 font-semibold"
                />
              </div>

              {/* Menu Links */}
              <div className="flex flex-col text-lg font-medium">
                <button
                  onClick={() => scrollToSection("hero")}
                  className="py-4 px-6 text-left text-gray-700 hover:text-purple-950 font-semibold cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="py-4 px-6 text-left text-gray-700 hover:text-purple-950 font-semibold cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="py-4 px-6 text-left text-gray-700 hover:text-purple-950 font-semibold cursor-pointer"
                >
                  Benefits
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="py-4 px-6 text-left text-gray-700 hover:text-purple-950 font-semibold cursor-pointer"
                >
                  Contact Us
                </button>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-auto flex flex-col gap-3 p-6">
                <Link
                  href="/register"
                  className="bg-purple-600 text-white rounded-md py-3 text-center hover:bg-purple-700"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="border border-purple-600 rounded-md py-3 text-center hover:bg-purple-50"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
