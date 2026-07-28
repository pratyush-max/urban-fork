'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ChevronDown,
  Info
} from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import AmbientParticles from '../ui/AmbientParticles';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Zod Schema matching booking experience requirements
const bookingSchema = z.object({
  name: z.string()
    .min(2, 'May we ask for your name (at least 2 letters)?')
    .max(50, 'Name is too long'),
  guests: z.number()
    .min(1, 'Please select at least 1 guest')
    .max(10, 'For parties larger than 10, please contact our concierge directly'),
  date: z.string().min(1, 'Please select a dining date'),
  time: z.string().min(1, 'Please select a preferred time'),
  occasion: z.string().min(1, 'Please select an occasion'),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const occasions = [
  'Just Dining',
  'Anniversary',
  'Birthday',
  'Business Dinner',
  'Date Night',
];

const timeSlots = [
  { id: '1', time: '5:30 PM' },
  { id: '2', time: '6:00 PM' },
  { id: '3', time: '6:30 PM' },
  { id: '4', time: '7:00 PM' },
  { id: '5', time: '7:30 PM' },
  { id: '6', time: '8:00 PM' },
  { id: '7', time: '8:30 PM' },
  { id: '8', time: '9:00 PM' },
  { id: '9', time: '9:30 PM' },
];

export default function ReservationExperience() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-w: 768px)');
  
  // Custom dropdown states
  const [isOccasionOpen, setIsOccasionOpen] = useState(false);
  
  // Custom calendar states
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  
  // References for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      guests: 2,
      date: '',
      time: '',
      occasion: 'Just Dining',
      specialRequests: '',
    },
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const selectedGuests = watch('guests');
  const selectedOccasion = watch('occasion');
  const allValues = watch();

  // Detect hydration on mount
  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  }, []);

  // Custom Calendar Calculation (Client-side Only to avoid SSR mismatches)
  const getDaysArray = (year: number, month: number) => {
    const numDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0
    const prevMonthNumDays = new Date(year, month, 0).getDate();
    const days = [];

    // Prev month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthNumDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthNumDays - i)
      });
    }

    // Current month days
    for (let i = 1; i <= numDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month padding days to fill grid (42 cells)
    const totalSlots = 42;
    const nextMonthPadding = totalSlots - days.length;
    for (let i = 1; i <= nextMonthPadding; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Navigating between steps with field validation
  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(['name', 'guests']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(['date', 'time']);
      if (isValid) setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Form submission opens validation modal
  const onSubmit = () => {
    setIsModalOpen(true);
  };

  // WhatsApp link generator
  const getWhatsAppLink = () => {
    const formattedDate = formatDateLabel(allValues.date);
    const message = `Hello Urban Fork,

I would like to reserve a table.

Name: ${allValues.name}
Date: ${formattedDate}
Time: ${allValues.time}
Guests: ${allValues.guests}
Occasion: ${allValues.occasion}
Special Requests: ${allValues.specialRequests || 'None'}

Please confirm availability.

Thank you.`;

    return `https://wa.me/918822077515?text=${encodeURIComponent(message)}`;
  };

  // Focus returning trigger for "Modify Reservation"
  const handleModify = () => {
    setIsModalOpen(false);
    // Smoothly focus on name input after modal fades
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
  };

  // Prevent double rendering of elements using Math.random/Dates during Server render
  if (!mounted) {
    return (
      <section id="reservations" className="relative min-h-[100dvh] py-32 bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center font-serif text-lg text-[#D4AF37] opacity-60">
          Loading Concierge Service...
        </div>
      </section>
    );
  }

  const calendarDays = getDaysArray(currentYear, currentMonth);

  return (
    <section 
      id="reservations" 
      className="relative min-h-[100dvh] py-32 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D] flex flex-col justify-center overflow-hidden"
    >
      <AmbientParticles />

      {/* Heading Group */}
      <div className="max-w-3xl mx-auto text-center mb-16 relative z-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
          Concierge Service
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
          Reserve Your Table
        </h2>
        <div className="w-[60px] h-[1px] bg-[#D4AF37] mx-auto mt-6" />
      </div>

      {/* Main Glassmorphism Wizard */}
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="glass-card rounded-2xl p-6 sm:p-12 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-6 mb-8">
            <span className="font-serif text-2xl font-light text-[#D4AF37]">
              {step === 1 && '01 / Guest Details'}
              {step === 2 && '02 / Date & Time'}
              {step === 3 && '03 / Preferences'}
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-[2px] transition-all duration-500 ${
                    s <= step ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Name and Guest Count */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <p className="font-serif text-xl md:text-2xl font-light text-[#B5B5B5] italic">
                    "Welcome to Urban Fork. May we ask for your name and the size of your party?"
                  </p>
                  
                  {/* Guest Name input */}
                  <div className="relative pt-6">
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      ref={(e) => {
                        register('name').ref(e);
                        (nameInputRef as any).current = e;
                      }}
                      autoComplete="off"
                      placeholder=" "
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors peer text-lg font-light"
                    />
                    <label 
                      htmlFor="name"
                      className="absolute left-0 top-6 text-[#B5B5B5] text-lg font-light transition-all duration-300 pointer-events-none origin-left
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                        peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#D4AF37]
                        [&.not-empty]:-translate-y-6 [&.not-empty]:scale-75 [&.not-empty]:text-[#D4AF37]
                        [&:not(:placeholder-shown)]:-translate-y-6 [&:not(:placeholder-shown)]:scale-75 [&:not(:placeholder-shown)]:text-[#D4AF37]"
                    >
                      Your Full Name
                    </label>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-2 font-sans flex items-center gap-1.5">
                        <Info size={14} /> {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Guests selector grid */}
                  <div className="space-y-4">
                    <label className="block text-sm uppercase tracking-wider text-[#B5B5B5] font-light">
                      Number of Guests
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setValue('guests', num)}
                          className={`h-12 rounded-lg border font-sans text-lg flex items-center justify-center transition-all duration-300 ${
                            selectedGuests === num 
                              ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                              : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 text-white'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {selectedGuests > 8 && (
                      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-4 rounded-lg flex items-start gap-3 mt-4">
                        <Info size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#B5B5B5] leading-relaxed">
                          For parties larger than 8, we recommend speaking with our reservations office. Simply complete this form and request booking via WhatsApp.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Custom Date & Time Picker */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  {/* Custom Calendar view (7 columns) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm uppercase tracking-wider text-[#B5B5B5] font-light">
                        Select Date
                      </label>
                      <div className="flex items-center gap-4">
                        <button 
                          type="button" 
                          aria-label="Previous month"
                          onClick={prevMonth}
                          className="p-1 hover:text-[#D4AF37] transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="font-serif text-lg text-white">
                          {monthNames[currentMonth]} {currentYear}
                        </span>
                        <button 
                          type="button" 
                          aria-label="Next month"
                          onClick={nextMonth}
                          className="p-1 hover:text-[#D4AF37] transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      {/* Weekday headers */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                          <span key={d} className="font-sans text-xs text-[#B5B5B5]/60 font-medium">
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Day cells */}
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((cell, idx) => {
                          const isPast = isPastDate(cell.date);
                          const dateString = cell.date.toISOString().split('T')[0];
                          const isSelected = selectedDate === dateString;
                          const isToday = new Date().toDateString() === cell.date.toDateString();

                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={isPast}
                              onClick={() => setValue('date', dateString, { shouldValidate: true })}
                              className={`h-9 w-full rounded-md font-sans text-sm flex items-center justify-center transition-all ${
                                !cell.isCurrentMonth ? 'opacity-25' : ''
                              } ${
                                isSelected 
                                  ? 'bg-[#D4AF37] text-[#0D0D0D] font-medium shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                                  : isToday && !isPast
                                  ? 'border border-[#D4AF37] text-[#D4AF37]'
                                  : isPast
                                  ? 'text-white/20 cursor-not-allowed line-through'
                                  : 'hover:bg-white/10 text-white'
                              }`}
                            >
                              {cell.day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {errors.date && (
                      <p className="text-red-400 text-sm font-sans flex items-center gap-1.5">
                        <Info size={14} /> {errors.date.message}
                      </p>
                    )}
                  </div>

                  {/* Time slot picker */}
                  <div className="lg:col-span-5 space-y-4">
                    <label className="text-sm uppercase tracking-wider text-[#B5B5B5] font-light block">
                      Select Time
                    </label>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setValue('time', slot.time, { shouldValidate: true })}
                            className={`h-11 rounded-lg border font-sans text-xs flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0D0D0D] shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                                : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 text-white'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                    {errors.time && (
                      <p className="text-red-400 text-sm font-sans flex items-center gap-1.5">
                        <Info size={14} /> {errors.time.message}
                      </p>
                    )}

                    {selectedDate && selectedTime && (
                      <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 rounded-lg mt-4">
                        <p className="text-xs text-[#B5B5B5] leading-relaxed">
                          Selected: <span className="text-[#D4AF37] font-medium">{formatDateLabel(selectedDate)}</span> at <span className="text-[#D4AF37] font-medium">{selectedTime}</span>.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Occasion and Custom Request details */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <p className="font-serif text-xl md:text-2xl font-light text-[#B5B5B5] italic">
                    "Is there an occasion we are celebrating, or any bespoke requests for our culinary team?"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Occasion Selection */}
                    <div className="space-y-2 relative">
                      <label className="text-sm uppercase tracking-wider text-[#B5B5B5] font-light block mb-2">
                        Occasion
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsOccasionOpen(!isOccasionOpen)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-left focus:outline-none focus:border-[#D4AF37] transition-all flex items-center justify-between"
                      >
                        <span>{selectedOccasion}</span>
                        <ChevronDown size={18} className={`text-[#D4AF37] transition-transform duration-300 ${isOccasionOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOccasionOpen && (
                          <motion.ul
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-20 w-full mt-2 bg-[#171717]/95 border border-white/10 rounded-lg overflow-hidden shadow-2xl backdrop-blur-xl"
                          >
                            {occasions.map((occ) => (
                              <li key={occ}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setValue('occasion', occ);
                                    setIsOccasionOpen(false);
                                  }}
                                  className="w-full text-left py-3 px-4 hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-colors font-sans text-sm text-white"
                                >
                                  {occ}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Special requests text area */}
                    <div className="relative pt-6">
                      <textarea
                        {...register('specialRequests')}
                        rows={2}
                        id="specialRequests"
                        placeholder=" "
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors peer text-lg font-light resize-none"
                      />
                      <label 
                        htmlFor="specialRequests"
                        className="absolute left-0 top-6 text-[#B5B5B5] text-lg font-light transition-all duration-300 pointer-events-none origin-left
                          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                          peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#D4AF37]
                          [&:not(:placeholder-shown)]:-translate-y-6 [&:not(:placeholder-shown)]:scale-75 [&:not(:placeholder-shown)]:text-[#D4AF37]"
                      >
                        Dietary Requirements / Bespoke Requests
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>

          {/* Navigation Controls footer */}
          <div className="flex items-center justify-between border-t border-[#D4AF37]/10 pt-6 mt-12">
            <div>
              {step > 1 && (
                <MagneticButton 
                  variant="outlined" 
                  onClick={handlePrevStep}
                >
                  Back
                </MagneticButton>
              )}
            </div>
            <div>
              {step < 3 ? (
                <MagneticButton 
                  variant="filled" 
                  onClick={handleNextStep}
                >
                  Continue
                </MagneticButton>
              ) : (
                <MagneticButton 
                  variant="filled"
                  onClick={handleSubmit(onSubmit)}
                >
                  Confirm Table
                </MagneticButton>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Overlay Modal (Desktop) / Bottom Sheet (Mobile) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`relative bg-[#171717] border border-[#D4AF37]/20 w-full overflow-hidden z-10 flex flex-col
                ${isMobile 
                  ? 'rounded-t-2xl max-h-[85vh]' 
                  : 'max-w-xl rounded-2xl p-8'
                }`}
            >
              
              {/* Mobile Swipe handle */}
              {isMobile && (
                <div className="w-12 h-1 bg-white/10 rounded-full mx-auto my-3 shrink-0" />
              )}

              {/* Modal Contents */}
              <div data-lenis-prevent className={`flex-grow overflow-y-auto ${isMobile ? 'px-6 pb-6 pt-2' : ''}`}>
                
                {/* Success Animation & Title */}
                <div className="flex flex-col items-center text-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-16 h-16 bg-[#D4AF37]/15 rounded-full flex items-center justify-center text-[#D4AF37] mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h3 className="font-serif text-3xl text-white font-light">
                    Reservation Staged
                  </h3>
                  <p className="font-sans text-xs text-[#D4AF37] uppercase tracking-wider mt-2">
                    Urban Fork Concierge
                  </p>
                </div>

                {/* Reservation Summary */}
                <div className="space-y-4 border-t border-b border-white/5 py-6 my-6 font-sans">
                  
                  <div className="flex justify-between items-start">
                    <span className="text-white/40 text-sm">Guest Host</span>
                    <span className="text-white text-right font-light text-base">{allValues.name}</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-white/40 text-sm">Date</span>
                    <span className="text-white text-right font-light text-base">{formatDateLabel(allValues.date)}</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-white/40 text-sm">Preferred Time</span>
                    <span className="text-white text-right font-light text-base">{allValues.time}</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-white/40 text-sm">Party Size</span>
                    <span className="text-white text-right font-light text-base">{allValues.guests} {allValues.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-white/40 text-sm">Occasion</span>
                    <span className="text-[#D4AF37] text-right font-light text-base">{allValues.occasion}</span>
                  </div>

                  {allValues.specialRequests && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Dietary & Bespoke requests</span>
                      <p className="text-white/80 font-light text-sm italic">
                        "{allValues.specialRequests}"
                      </p>
                    </div>
                  )}

                  {/* Arrival Reminder */}
                  <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/10 p-4 rounded-lg mt-4 flex gap-3">
                    <Info size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#B5B5B5] leading-relaxed">
                      Please note: We hold reserved tables for a maximum of 15 minutes past the scheduled arrival. Smart elegant dress code recommended.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-4 bg-[#D4AF37] text-[#0D0D0D] font-sans font-medium uppercase tracking-wider text-xs rounded hover:bg-[#CFAE5B] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Confirm via WhatsApp
                  </a>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleModify}
                      className="py-3.5 border border-white/10 rounded font-sans text-xs uppercase tracking-wider text-white hover:bg-white/5 transition-all"
                    >
                      Modify Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="py-3.5 bg-white/5 hover:bg-white/10 rounded font-sans text-xs uppercase tracking-wider text-white transition-all"
                    >
                      Close Window
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
