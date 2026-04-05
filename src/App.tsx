/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Truck, HardHat, Package, ShieldCheck, Clock, FileText, Anchor } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { backgroundImage } from './backgroundImage';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Nominal change to test Firebase Hosting deployment via GitHub Actions

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted && formRef.current) {
      // Scroll slightly above the element to give it some breathing room
      const yOffset = -80; 
      const element = formRef.current;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [submitted]);

  const trackPhoneClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact', { method: 'phone' });
    }
  };

  const trackEmailClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact', { method: 'email' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const formData = new FormData(e.currentTarget);
    
    const now = new Date();
    const data: Record<string, any> = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      storageNeeds: formData.get('storageNeeds'),
      userType: formData.get('userType'),
      createdAt: now.toISOString(),
      date: now.toLocaleDateString('en-US'),
    };

    const inquiry = formData.get('inquiry');
    if (inquiry) data.inquiry = inquiry;

    try {
      await addDoc(collection(db, 'leads'), data);
      
      // Trigger email via Firebase Extension
      await addDoc(collection(db, 'mail'), {
        to: ['815missionrockroad@gmail.com', 'mbjhomes@gmail.com'],
        message: {
          subject: `New Grand Opening Lead: ${data.name} - Mission Rock Storage`,
          html: `
            <h2>New Grand Opening Promotional Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Storage Needs:</strong> ${data.storageNeeds || 'Not provided'}</p>
            <p><strong>User Type:</strong> ${data.userType || 'Not provided'}</p>
            <p><strong>Inquiry:</strong> ${data.inquiry || 'Not provided'}</p>
            <p><strong>Date Submitted:</strong> ${data.date}</p>
          `
        }
      });

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead');
      }

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
                MISSION ROCK <span className="text-safety-orange">INDUSTRIAL CENTER</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="tel:8054500869" onClick={trackPhoneClick} className="flex items-center hover:text-safety-orange transition-colors font-semibold">
                <Phone className="w-5 h-5 mr-2 text-safety-orange" />
                805.450.0869
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
                GRAND OPENING <br />
                <span className="text-safety-orange">INDUSTRIAL OUTDOOR STORAGE (IOS)</span> <br />
                & SEMI-TRUCK PARKING
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-10">
                <a href="tel:8054500869" onClick={trackPhoneClick} className="flex items-center text-2xl font-display font-bold hover:text-safety-orange transition-colors">
                  <div className="bg-safety-orange/20 p-3 rounded-full mr-4">
                    <Phone className="w-6 h-6 text-safety-orange" />
                  </div>
                  805.450.0869
                </a>
                <a href="mailto:815missionrockroad@gmail.com" onClick={trackEmailClick} className="flex items-center text-xl font-display font-bold hover:text-safety-orange transition-colors">
                  <div className="bg-safety-orange/20 p-3 rounded-full mr-4">
                    <Mail className="w-6 h-6 text-safety-orange" />
                  </div>
                  Email Us
                </a>
              </div>

              <p className="text-xl text-zinc-300 mb-6 max-w-2xl leading-relaxed">
                Your rugged, reliable partner for fleet parking, equipment staging, and bulk storage. 
                Built for contractors, logistics, and heavy industry.
              </p>
              <p className="text-xl text-safety-orange font-semibold mb-10 max-w-2xl leading-relaxed">
                Make sure you register to be notified of all our grand opening events and promotions.
              </p>
            </div>

            {/* Simplified Form */}
            <div id="contact" ref={formRef} className="bg-charcoal-900/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl border-t-8 border-safety-orange">
              {submitted ? (
                <div className="text-center py-12">
                  <ShieldCheck className="w-16 h-16 text-safety-orange mx-auto mb-6" />
                  <h3 className="text-3xl font-display font-bold text-white mb-4">THANK YOU!</h3>
                  <p className="text-zinc-300 text-lg">
                    We've received your request and will be in touch shortly.
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
                  <h3 className="text-2xl font-display font-bold text-white mb-6">REQUEST GRAND OPENING PROMOTIONAL</h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">Full Name *</label>
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
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">Phone Number *</label>
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
                      <label htmlFor="storageNeeds" className="block text-sm font-medium text-zinc-300 mb-1">Storage Needs *</label>
                      <select 
                        id="storageNeeds" 
                        name="storageNeeds"
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors appearance-none"
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Select an option</option>
                        <option value="Semi-Truck Parking">Semi-Truck Parking</option>
                        <option value="Electric Fleet Charging">Electric Fleet Charging</option>
                        <option value="Bulk Material Storage">Bulk Material Storage</option>
                        <option value="Shipping Container Storage">Shipping Container Storage</option>
                        <option value="Heavy Equipment Storage">Heavy Equipment Storage</option>
                        <option value="Referral Program">Referral Program</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">I am a: *</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex items-center">
                          <input type="radio" name="userType" value="Primary User" className="mr-2 text-safety-orange focus:ring-safety-orange" required />
                          <span className="text-zinc-300">Primary User</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="userType" value="Referral Program" className="mr-2 text-safety-orange focus:ring-safety-orange" required />
                          <span className="text-zinc-300">Referral Program</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiry" className="block text-sm font-medium text-zinc-300 mb-1">Inquiry (Optional)</label>
                      <textarea 
                        id="inquiry" 
                        name="inquiry"
                        rows={3}
                        className="w-full bg-charcoal-800 border border-charcoal-700 rounded px-4 py-3 text-white focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange transition-colors"
                        placeholder="Tell us about your storage needs..."
                      ></textarea>
                    </div>

                    {submitError && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded text-sm">
                        {submitError}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-safety-orange hover:bg-safety-orange-hover text-white font-display font-bold text-lg tracking-wide py-4 rounded transition-colors mt-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'REQUEST PROMOTIONAL / REFERRAL FEE'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Link Section */}
      <section className="bg-charcoal-800 text-white py-12 border-b-4 border-safety-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <a 
            href="https://maps.app.goo.gl/uLMCPTEERyLH5F1a6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-2xl hover:text-safety-orange transition-colors font-semibold mb-8"
          >
            <MapPin className="w-8 h-8 mr-3 text-safety-orange" />
            Mission Rock Industrial Center & Truck Parking
          </a>
          <div className="w-full h-[450px] rounded-lg overflow-hidden border-4 border-charcoal-700 shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src="https://maps.google.com/maps?q=Mission+Rock+Industrial+Center,+815+Mission+Rock+Road,+Santa+Paula,+CA&t=&z=14&ie=UTF8&iwloc=&output=embed"
              title="Mission Rock Location Map"
            ></iframe>
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

      {/* Build to Suit Section */}
      <section className="py-20 bg-charcoal-900 text-white border-b-4 border-safety-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">BUILD TO SUIT</h2>
              <div className="w-24 h-1 bg-safety-orange mb-8"></div>
              <p className="text-xl text-zinc-300 mb-6 leading-relaxed">
                Need a custom solution? We offer comprehensive Build to Suit options tailored specifically to your operational requirements.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-safety-orange/20 p-2 rounded mr-4 mt-1">
                    <Package className="w-5 h-5 text-safety-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Custom Warehouses</h4>
                    <p className="text-zinc-400">Purpose-built structures for your inventory and logistics.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-safety-orange/20 p-2 rounded mr-4 mt-1">
                    <Truck className="w-5 h-5 text-safety-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Electric Fleet Charging Facilities</h4>
                    <p className="text-zinc-400">Future-proof your operations with dedicated EV charging infrastructure.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-safety-orange/20 p-2 rounded mr-4 mt-1">
                    <HardHat className="w-5 h-5 text-safety-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Specialized Facilities</h4>
                    <p className="text-zinc-400">Maintenance bays, cross-docking, and specialized industrial setups.</p>
                  </div>
                </li>
              </ul>
              <button 
                onClick={() => {
                  const contactForm = document.getElementById('contact');
                  if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-transparent border-2 border-safety-orange text-safety-orange hover:bg-safety-orange hover:text-white font-display font-bold text-lg tracking-wide py-3 px-8 rounded transition-colors"
              >
                DISCUSS YOUR PROJECT
              </button>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl border-4 border-charcoal-800">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                alt="Industrial Warehouse Construction" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-charcoal-900 border-t border-charcoal-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <span className="font-display font-bold text-xl text-white tracking-wider block mb-2">
              MISSION ROCK <span className="text-safety-orange">INDUSTRIAL CENTER</span>
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
