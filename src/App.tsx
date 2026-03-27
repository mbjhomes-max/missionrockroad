/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Truck, HardHat, Package, ShieldCheck, Clock, FileText, Anchor } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { backgroundImage } from './backgroundImage';

// Nominal change to test Firebase Hosting deployment via GitHub Actions

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const formData = new FormData(e.currentTarget);
    
    const now = new Date();
    const data: Record<string, any> = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      storing: formData.get('storing'),
      space: formData.get('space'),
      createdAt: now.toISOString(),
      date: now.toLocaleDateString('en-US'), // Added formatted date
    };

    // Only add optional fields if they are not empty strings
    const company = formData.get('company');
    if (company) data.company = company;
    
    const email = formData.get('email');
    if (email) data.email = email;

    try {
      await addDoc(collection(db, 'leads'), data);
      
      // Trigger email via Firebase Extension
      await addDoc(collection(db, 'mail'), {
        to: ['815missionrockroad@gmail.com', 'mbjhomes@gmail.com'],
        message: {
          subject: `New Lead: ${data.name} - Mission Rock Storage`,
          html: `
            <h2>New Reservation Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
            <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
            <p><strong>What are they storing:</strong> ${data.storing}</p>
            <p><strong>Space needed:</strong> ${data.space}</p>
            <p><strong>Date Submitted:</strong> ${data.date}</p>
          `
        }
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Failed to submit form. Please check your inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-charcoal-900 selection:bg-safety-orange selection:text-white">
      {/* Navigation / Top Bar */}
      <header className="bg-charcoal-900 text-white sticky top-0 z-50 border-b-4 border-safety-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="font-display font-bold text-2xl tracking-wider">
                815 <span className="text-safety-orange">MISSION ROCK</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="tel:8054500869" className="flex items-center hover:text-safety-orange transition-colors font-semibold">
                <Phone className="w-5 h-5 mr-2 text-safety-orange" />
                805.450.0869
              </a>
              <a href="#contact" className="bg-safety-orange hover:bg-safety-orange-hover text-white px-6 py-2 rounded font-display font-bold tracking-wide transition-colors">
                GET A QUOTE
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-charcoal-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Shipping container yard"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-safety-orange/20 border border-safety-orange text-safety-orange font-semibold text-sm mb-6">
              <MapPin className="w-4 h-4 mr-2" />
              815 Mission Rock Road Industrial Center
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              SECURE, HEAVY-DUTY <br />
              <span className="text-safety-orange">INDUSTRIAL STORAGE</span> <br />
              & YARD SPACE
            </h1>
            <p className="text-xl text-zinc-300 mb-10 max-w-2xl leading-relaxed">
              Your rugged, reliable partner for fleet parking, equipment staging, and bulk storage. 
              Built for contractors, logistics, and heavy industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="bg-safety-orange hover:bg-safety-orange-hover text-white text-center px-8 py-4 rounded font-display font-bold text-lg tracking-wide transition-colors">
                RESERVE YOUR SPACE
              </a>
              <a href="sms:8054500869" className="bg-white text-charcoal-900 hover:bg-zinc-200 text-center px-8 py-4 rounded font-display font-bold text-lg tracking-wide transition-colors flex items-center justify-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                TAP TO TEXT US
              </a>
            </div>
            <div className="mt-8">
              <p className="text-zinc-400 font-medium">Visit us online at <a href="#" className="text-white underline decoration-safety-orange underline-offset-4">MissionRockStorage.com</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-charcoal-900 mb-4">INDUSTRIAL-GRADE CAPABILITIES</h2>
            <div className="w-24 h-1 bg-safety-orange mx-auto"></div>
            <p className="mt-6 text-lg text-zinc-600">
              We provide the raw space and secure environment your business needs to operate efficiently. No frills, just functional, heavy-duty yard space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 border-t-4 border-charcoal-900 shadow-sm hover:shadow-md transition-shadow">
              <Truck className="w-12 h-12 text-safety-orange mb-6" />
              <h3 className="text-xl font-display font-bold mb-3">Heavy Fleet & Truck Parking</h3>
              <p className="text-zinc-600">
                Ample turning radius and reinforced ground suitable for semi-trucks, trailers, and heavy commercial fleets.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 border-t-4 border-charcoal-900 shadow-sm hover:shadow-md transition-shadow">
              <HardHat className="w-12 h-12 text-safety-orange mb-6" />
              <h3 className="text-xl font-display font-bold mb-3">Contractor Yard Space</h3>
              <p className="text-zinc-600">
                Dedicated laydown yards for construction companies, landscapers, and tradesmen to store vehicles and materials.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 border-t-4 border-charcoal-900 shadow-sm hover:shadow-md transition-shadow">
              <Anchor className="w-12 h-12 text-safety-orange mb-6" />
              <h3 className="text-xl font-display font-bold mb-3">Industrial Equipment Staging</h3>
              <p className="text-zinc-600">
                Secure staging areas for heavy machinery, cranes, earthmovers, and oversized industrial equipment.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-8 border-t-4 border-charcoal-900 shadow-sm hover:shadow-md transition-shadow">
              <Package className="w-12 h-12 text-safety-orange mb-6" />
              <h3 className="text-xl font-display font-bold mb-3">Bulk Material Storage</h3>
              <p className="text-zinc-600">
                Open-air storage solutions for non-hazardous bulk materials, aggregates, lumber, and pipe.
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-8 border-t-4 border-charcoal-900 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-12 h-12 text-safety-orange mb-6" />
              <h3 className="text-xl font-display font-bold mb-3">Secure Container Storage</h3>
              <p className="text-zinc-600">
                Safe, accessible ground space for shipping containers (20ft & 40ft) and mobile storage units.
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-8 border-t-4 border-charcoal-900 shadow-sm hover:shadow-md transition-shadow">
              <Clock className="w-12 h-12 text-safety-orange mb-6" />
              <h3 className="text-xl font-display font-bold mb-3">24/7 Gated Access</h3>
              <p className="text-zinc-600">
                Round-the-clock access for authorized personnel, ensuring your operations never have to stop.
              </p>
            </div>

            {/* Service 7 - Centered in last row for grid balance on large screens */}
            <div className="bg-white p-8 border-t-4 border-charcoal-900 shadow-sm hover:shadow-md transition-shadow lg:col-start-2">
              <FileText className="w-12 h-12 text-safety-orange mb-6" />
              <h3 className="text-xl font-display font-bold mb-3">Flexible Lease Terms</h3>
              <p className="text-zinc-600">
                Month-to-month or long-term agreements tailored to your project timelines and business growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-4xl font-display font-bold text-charcoal-900 mb-6">LOCK IN YOUR SPACE TODAY</h2>
              <p className="text-lg text-zinc-600 mb-10">
                Industrial space at 815 Mission Rock Road is in high demand. Contact our team directly or fill out the form to get a custom quote for your storage needs.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-zinc-100 p-4 rounded-full">
                    <Phone className="w-8 h-8 text-safety-orange" />
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Call Us</h4>
                    <a href="tel:8054500869" className="text-2xl font-display font-bold text-charcoal-900 hover:text-safety-orange transition-colors">805.450.0869</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-zinc-100 p-4 rounded-full">
                    <MessageSquare className="w-8 h-8 text-safety-orange" />
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Text Us</h4>
                    <a href="sms:8054500869" className="text-2xl font-display font-bold text-charcoal-900 hover:text-safety-orange transition-colors">805.450.0869</a>
                    <div className="mt-2">
                      <a href="sms:8054500869" className="inline-flex items-center text-sm font-bold text-safety-orange hover:text-safety-orange-hover">
                        TAP TO TEXT <MessageSquare className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-zinc-100 p-4 rounded-full">
                    <Mail className="w-8 h-8 text-safety-orange" />
                  </div>
                  <div className="ml-6">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Email Us</h4>
                    <a href="mailto:815missionrockroad@gmail.com" className="text-xl font-bold text-charcoal-900 hover:text-safety-orange transition-colors break-all">815missionrockroad@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Form */}
            <div className="bg-charcoal-900 p-8 lg:p-10 rounded-lg shadow-xl border-t-8 border-safety-orange">
              {submitted ? (
                <div className="text-center py-12">
                  <ShieldCheck className="w-16 h-16 text-safety-orange mx-auto mb-6" />
                  <h3 className="text-3xl font-display font-bold text-white mb-4">THANK YOU!</h3>
                  <p className="text-zinc-300 text-lg">
                    We've received your request and will be in touch within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 bg-safety-orange hover:bg-safety-orange-hover text-white font-display font-bold text-lg tracking-wide py-3 px-6 rounded transition-colors"
                  >
                    SUBMIT ANOTHER REQUEST
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-display font-bold text-white mb-6">REQUEST A QUOTE</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-zinc-300 mb-2">Company Name</label>
                      <input 
                        type="text" 
                        id="company" 
                        name="company"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors"
                        placeholder="Acme Construction"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="storing" className="block text-sm font-medium text-zinc-300 mb-2">What are you storing? *</label>
                      <select 
                        id="storing" 
                        name="storing"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors appearance-none"
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="trucks">Trucks / Fleet Vehicles</option>
                        <option value="equipment">Heavy Equipment</option>
                        <option value="materials">Bulk Materials</option>
                        <option value="containers">Shipping Containers</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="space" className="block text-sm font-medium text-zinc-300 mb-2">Space Required *</label>
                      <select 
                        id="space" 
                        name="space"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors appearance-none"
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="under-5k">Under 5,000 sq ft</option>
                        <option value="5k-10k">5,000 - 10,000 sq ft</option>
                        <option value="half-acre">1/2 Acre</option>
                        <option value="one-plus-acre">1+ Acre</option>
                      </select>
                    </div>

                    {submitError && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm">
                        {submitError}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-safety-orange hover:bg-safety-orange-hover text-white font-display font-bold text-lg tracking-wide py-4 rounded transition-colors mt-4 disabled:opacity-50"
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                    </button>
                    <p className="text-xs text-zinc-500 text-center mt-4">
                      We'll get back to you within 24 hours with availability and pricing.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-900 border-t border-charcoal-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="font-display font-bold text-xl text-white tracking-wider block mb-2">
              815 <span className="text-safety-orange">MISSION ROCK</span>
            </span>
            <p className="text-zinc-400 text-sm">
              815 Mission Rock Road Industrial Center<br />
              MissionRockStorage.com
            </p>
          </div>
          <div className="text-zinc-500 text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} Mission Rock Storage. All rights reserved.<br />
            Industrial Real Estate & Yard Space Solutions.
          </div>
        </div>
      </footer>
    </div>
  );
}
