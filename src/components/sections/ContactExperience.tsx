'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Send,
  Loader2,
  Info
} from 'lucide-react';
import { restaurantConfig } from '@/constants/restaurant';
import MagneticButton from '../ui/MagneticButton';
import AmbientParticles from '../ui/AmbientParticles';

// Zod Validation Schema
const contactSchema = z.object({
  name: z.string()
    .min(2, 'May we ask for your name (at least 2 letters)?')
    .max(50, 'Name is too long'),
  email: z.string()
    .email('Please provide a valid email address for our reply'),
  phone: z.string()
    .min(6, 'Please enter a valid contact phone number'),
  subject: z.string()
    .min(3, 'Please select a subject for your inquiry'),
  message: z.string()
    .min(10, 'Please write a message of at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactExperience() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [liveStatus, setLiveStatus] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  // Calculate live restaurant status safely client-side to prevent hydration mismatch
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0=Sunday, 1=Monday, ...
      const hour = now.getHours() + now.getMinutes() / 60;

      let isOpen = false;
      let hoursText = '';

      if (day === 0) { // Sunday
        isOpen = hour >= restaurantConfig.openingHours.sunday.startHour && hour < restaurantConfig.openingHours.sunday.endHour;
        hoursText = restaurantConfig.openingHours.sunday.hours;
      } else if (day === 5 || day === 6) { // Friday, Saturday
        isOpen = hour >= restaurantConfig.openingHours.weekend.startHour && hour < restaurantConfig.openingHours.weekend.endHour;
        hoursText = restaurantConfig.openingHours.weekend.hours;
      } else { // Mon-Thu
        isOpen = hour >= restaurantConfig.openingHours.weekday.startHour && hour < restaurantConfig.openingHours.weekday.endHour;
        hoursText = restaurantConfig.openingHours.weekday.hours;
      }

      if (isOpen) {
        setLiveStatus(`We are currently open. Join us this evening.`);
      } else {
        setLiveStatus(`Closed. Doors open at 12:00 PM.`);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        "Full Name": data.name,
        "Email": data.email,
        "Phone Number": data.phone,
        "Subject": data.subject,
        "Message": data.message
      };

      const response = await fetch('https://formspree.io/f/mrenrbjp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsSuccessOpen(true);
        reset();
      } else {
        throw new Error('Failed to submit message to Formspree');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setIsErrorOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValues = watch();

  return (
    <section id="contact" className="relative bg-[#0D0D0D] py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5">
      <AmbientParticles className="absolute inset-0 z-0 pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Information */}
          <div className="space-y-12">
            
            {/* Headers */}
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
                Concierge Desk
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                Connect With Us
              </h2>
              <div className="w-[60px] h-[1px] bg-[#D4AF37] mt-6" />
            </div>

            <p className="font-sans text-base text-[#B5B5B5] font-light leading-relaxed max-w-lg">
              For general inquiries, sommelier cellar reservations, media contacts, or customized private dining events, please reach out to our Manhattan desk.
            </p>

            {/* Quick Cards Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Card 1: Live Status & Hours */}
              <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-[#D4AF37]">
                  <Clock size={18} />
                  <span className="font-serif text-sm font-light tracking-wide">Hours & Status</span>
                </div>
                <div className="space-y-2">
                  <div className="text-[11px] font-sans text-[#B5B5B5]/60 uppercase tracking-wider">
                    {restaurantConfig.openingHours.weekday.days}
                    <span className="block text-xs text-white font-serif mt-0.5">{restaurantConfig.openingHours.weekday.hours}</span>
                  </div>
                  <div className="text-[11px] font-sans text-[#B5B5B5]/60 uppercase tracking-wider">
                    {restaurantConfig.openingHours.weekend.days}
                    <span className="block text-xs text-white font-serif mt-0.5">{restaurantConfig.openingHours.weekend.hours}</span>
                  </div>
                  <div className="text-[11px] font-sans text-[#B5B5B5]/60 uppercase tracking-wider">
                    {restaurantConfig.openingHours.sunday.days}
                    <span className="block text-xs text-white font-serif mt-0.5">{restaurantConfig.openingHours.sunday.hours}</span>
                  </div>
                </div>
                {liveStatus && (
                  <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        liveStatus.startsWith('Closed') ? 'bg-[#B5B5B5]' : 'bg-green-500'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        liveStatus.startsWith('Closed') ? 'bg-[#B5B5B5]' : 'bg-green-500'
                      }`}></span>
                    </span>
                    <span className="font-sans text-[10px] text-[#B5B5B5]/70 font-light">
                      {liveStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Card 2: Contact Methods */}
              <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-[#D4AF37]">
                  <Phone size={18} />
                  <span className="font-serif text-sm font-light tracking-wide">Desk Details</span>
                </div>
                <div className="space-y-3">
                  <a 
                    href={`tel:${restaurantConfig.phoneRaw}`}
                    className="flex items-start gap-3 group/item cursor-none md:cursor-pointer"
                  >
                    <Phone size={14} className="text-[#B5B5B5]/60 group-hover/item:text-[#D4AF37] transition-colors mt-0.5 shrink-0" />
                    <div>
                      <span className="font-sans text-[10px] text-[#B5B5B5]/40 uppercase tracking-widest block">Concierge Call</span>
                      <span className="font-sans text-xs text-[#B5B5B5] group-hover/item:text-white transition-colors">{restaurantConfig.phone}</span>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${restaurantConfig.email}`}
                    className="flex items-start gap-3 group/item cursor-none md:cursor-pointer"
                  >
                    <Mail size={14} className="text-[#B5B5B5]/60 group-hover/item:text-[#D4AF37] transition-colors mt-0.5 shrink-0" />
                    <div>
                      <span className="font-sans text-[10px] text-[#B5B5B5]/40 uppercase tracking-widest block">Concierge Mail</span>
                      <span className="font-sans text-xs text-[#B5B5B5] group-hover/item:text-white transition-colors">{restaurantConfig.email}</span>
                    </div>
                  </a>

                  <a 
                    href={restaurantConfig.socialLinks.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group/item cursor-none md:cursor-pointer"
                  >
                    <MapPin size={14} className="text-[#B5B5B5]/60 group-hover/item:text-[#D4AF37] transition-colors mt-0.5 shrink-0" />
                    <div>
                      <span className="font-sans text-[10px] text-[#B5B5B5]/40 uppercase tracking-widest block">Address</span>
                      <span className="font-sans text-xs text-[#B5B5B5] group-hover/item:text-white transition-colors max-w-[150px] block leading-tight">{restaurantConfig.address}</span>
                    </div>
                  </a>
                </div>
              </div>

            </div>

            {/* Social Channels */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <span className="font-sans text-[10px] text-[#B5B5B5]/40 uppercase tracking-[0.2em] block font-semibold">
                Social Channels
              </span>
              <div className="flex gap-4">
                <a 
                  href={restaurantConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/5 hover:border-[#D4AF37]/30 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center text-[#B5B5B5] hover:text-[#D4AF37] transition-all cursor-none md:cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a 
                  href={restaurantConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/5 hover:border-[#D4AF37]/30 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center text-[#B5B5B5] hover:text-[#D4AF37] transition-all cursor-none md:cursor-pointer"
                  aria-label="Facebook"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a 
                  href={restaurantConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/5 hover:border-[#D4AF37]/30 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center text-[#B5B5B5] hover:text-[#D4AF37] transition-all cursor-none md:cursor-pointer"
                  aria-label="WhatsApp"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Right Side: Form & Map Stack */}
          <div className="space-y-12">
            
            {/* Contact Form Card */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden bg-[#171717]/40 backdrop-blur-md">
              <h3 className="font-serif text-2xl text-white font-light mb-6 tracking-wide">
                Send a Message
              </h3>

              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
              >
                
                {/* Name field */}
                <div className="relative">
                  <input
                    id="contact-name"
                    type="text"
                    {...register('name')}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50 transition-colors"
                  />
                  <label 
                    htmlFor="contact-name"
                    className={`absolute left-4 top-3 text-xs text-[#B5B5B5]/65 transition-all duration-300 pointer-events-none ${
                      focusedField === 'name' || formValues.name
                        ? '-translate-y-6 translate-x-[-8px] text-[10px] text-[#D4AF37] bg-[#0D0D0D] px-1.5'
                        : ''
                    }`}
                  >
                    Full Name
                  </label>
                  {errors.name && (
                    <span className="text-[10px] text-red-500/80 mt-1 flex items-center gap-1.5 px-1">
                      <Info size={10} /> {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email field */}
                <div className="relative">
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50 transition-colors"
                  />
                  <label 
                    htmlFor="contact-email"
                    className={`absolute left-4 top-3 text-xs text-[#B5B5B5]/65 transition-all duration-300 pointer-events-none ${
                      focusedField === 'email' || formValues.email
                        ? '-translate-y-6 translate-x-[-8px] text-[10px] text-[#D4AF37] bg-[#0D0D0D] px-1.5'
                        : ''
                    }`}
                  >
                    Email Address
                  </label>
                  {errors.email && (
                    <span className="text-[10px] text-red-500/80 mt-1 flex items-center gap-1.5 px-1">
                      <Info size={10} /> {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Phone & Subject split row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Phone */}
                  <div className="relative">
                    <input
                      id="contact-phone"
                      type="tel"
                      {...register('phone')}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50 transition-colors"
                    />
                    <label 
                      htmlFor="contact-phone"
                      className={`absolute left-4 top-3 text-xs text-[#B5B5B5]/65 transition-all duration-300 pointer-events-none ${
                        focusedField === 'phone' || formValues.phone
                          ? '-translate-y-6 translate-x-[-8px] text-[10px] text-[#D4AF37] bg-[#0D0D0D] px-1.5'
                          : ''
                      }`}
                    >
                      Phone Number
                    </label>
                    {errors.phone && (
                      <span className="text-[10px] text-red-500/80 mt-1 flex items-center gap-1.5 px-1">
                        <Info size={10} /> {errors.phone.message}
                      </span>
                    )}
                  </div>

                  {/* Subject Dropdown */}
                  <div className="relative">
                    <label 
                      htmlFor="contact-subject"
                      className={`absolute left-4 top-3 text-xs text-[#B5B5B5]/65 transition-all duration-300 pointer-events-none ${
                        focusedField === 'subject' || formValues.subject
                          ? '-translate-y-6 translate-x-[-8px] text-[10px] text-[#D4AF37] bg-[#0D0D0D] px-1.5'
                          : ''
                      }`}
                    >
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      {...register('subject')}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors appearance-none cursor-none md:cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#171717]">Select Subject</option>
                      <option value="General Inquiry" className="bg-[#171717]">General Inquiry</option>
                      <option value="Private Dining Event" className="bg-[#171717]">Private Dining Event</option>
                      <option value="Cellar Pairing Request" className="bg-[#171717]">Cellar Pairing Request</option>
                      <option value="Media & Press" className="bg-[#171717]">Media & Press</option>
                    </select>
                    {errors.subject && (
                      <span className="text-[10px] text-red-500/80 mt-1 flex items-center gap-1.5 px-1">
                        <Info size={10} /> {errors.subject.message}
                      </span>
                    )}
                  </div>

                </div>

                {/* Message field */}
                <div className="relative">
                  <textarea
                    id="contact-message"
                    rows={4}
                    {...register('message')}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50 transition-colors resize-none"
                  />
                  <label 
                    htmlFor="contact-message"
                    className={`absolute left-4 top-3 text-xs text-[#B5B5B5]/65 transition-all duration-300 pointer-events-none ${
                      focusedField === 'message' || formValues.message
                        ? '-translate-y-6 translate-x-[-8px] text-[10px] text-[#D4AF37] bg-[#0D0D0D] px-1.5'
                        : ''
                    }`}
                  >
                    Your Message
                  </label>
                  {errors.message && (
                    <span className="text-[10px] text-red-500/80 mt-1 flex items-center gap-1.5 px-1">
                      <Info size={10} /> {errors.message.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <MagneticButton 
                    variant="filled" 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3.5 flex items-center gap-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </MagneticButton>
                </div>

              </form>

            </div>

            {/* Google Map Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-white/10 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <iframe
                src={restaurantConfig.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ 
                  border: 0, 
                  filter: 'grayscale(1) invert(0.9) contrast(1.15) brightness(0.85)' 
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Urban Fork Manhattan Location map"
              />
              {/* Glass overlay fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5 select-none pointer-events-none">
                <MapPin size={10} /> Lower Manhattan vault
              </div>
            </motion.div>

          </div>

        </div>

      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {isSuccessOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsSuccessOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="glass-card max-w-md w-full p-8 rounded-2xl border border-[#D4AF37]/30 text-center relative overflow-hidden bg-[#171717]/95"
            >
              <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-[#D4AF37] mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <CheckCircle2 size={32} />
              </div>

              <h3 className="font-serif text-2xl text-white font-light mb-3 tracking-wide">
                Message Transmitted
              </h3>
              
              <p className="font-sans text-sm text-[#B5B5B5] font-light leading-relaxed mb-8">
                Your inquiry has been successfully logged with our Manhattan concierge desk. A host will review and reply to your provided address shortly.
              </p>

              <div className="flex justify-center">
                <MagneticButton
                  variant="filled"
                  onClick={() => setIsSuccessOpen(false)}
                  className="px-8 py-3 text-sm"
                >
                  Return to Desk
                </MagneticButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal Overlay */}
      <AnimatePresence>
        {isErrorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsErrorOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="glass-card max-w-md w-full p-8 rounded-2xl border border-red-500/30 text-center relative overflow-hidden bg-[#171717]/95"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <Info size={32} />
              </div>

              <h3 className="font-serif text-2xl text-white font-light mb-3 tracking-wide">
                Transmission Error
              </h3>
              
              <p className="font-sans text-sm text-[#B5B5B5] font-light leading-relaxed mb-8">
                We encountered a connection issue while transmitting your message. Please try again, or connect with our concierge directly via WhatsApp or phone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton
                  variant="outlined"
                  onClick={() => setIsErrorOpen(false)}
                  className="px-6 py-3 text-xs"
                >
                  Try Again
                </MagneticButton>
                <MagneticButton
                  variant="filled"
                  href={restaurantConfig.whatsappUrl}
                  className="px-6 py-3 text-xs"
                >
                  WhatsApp Desk
                </MagneticButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
