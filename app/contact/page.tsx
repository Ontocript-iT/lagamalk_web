"use client";

import { useState } from "react";
import SmartNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      <SmartNavbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 mt-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in Touch</h1>
            <p className="text-gray-600 text-lg">
              Have a question about the Lagama LK app, want to become a partner, or need technical support? Drop us a line.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Contact Information */}
            <div className="md:col-span-2 bg-black text-white p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-orange-500 opacity-20 blur-2xl"></div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6 text-orange-500">Contact Information</h2>
                <p className="text-gray-400 mb-10">
                  Fill out the form and our support team will get back to you within 24 hours.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <span className="text-orange-500 text-xl">📍</span>
                    <div>
                      <p className="font-semibold">Headquarters</p>
                      <p className="text-gray-400 text-sm">Colombo, Sri Lanka</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <span className="text-orange-500 text-xl">📞</span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-400 text-sm">+94 11 234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <span className="text-orange-500 text-xl">✉️</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-400 text-sm">support@nearmeapp.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-3 p-10">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl mb-4">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold">Message Sent!</h3>
                  <p className="text-gray-600">Thanks for reaching out. We will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-black text-orange-500 font-bold text-lg py-3 rounded-lg hover:bg-gray-800 transition shadow-md"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}