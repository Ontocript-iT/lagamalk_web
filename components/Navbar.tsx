"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SmartNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Smart Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar if scrolling down, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold tracking-tighter text-black flex items-center gap-1">
          Near<span className="text-orange-500">Me</span>
          <span className="w-2 h-2 rounded-full bg-orange-500 mb-4 animate-pulse"></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative text-base font-semibold transition-colors duration-300 ${
                  isActive ? "text-orange-500" : "text-gray-700 hover:text-black"
                } group`}
              >
                {item.name}
                {/* Fiverr-style expanding underline animation */}
                <span 
                  className={`absolute left-0 -bottom-1 h-[2px] bg-orange-500 transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
          
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-6 py-2.5 text-base font-bold text-white bg-black rounded-md overflow-hidden transition-all hover:scale-105"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">Login</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown (Animated) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 space-y-4 shadow-inner">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-semibold ${
                pathname === item.path ? "text-orange-500" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-bold text-orange-500 pt-2 border-t border-gray-100"
          >
            Admin Login &rarr;
          </Link>
        </div>
      </div>
    </nav>
  );
}