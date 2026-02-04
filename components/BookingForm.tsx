"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay,
  addMinutes,
  setHours,
  setMinutes
} from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Mail, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { availability } from "@/lib/availability";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const isDateAvailable = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return false;
    if (!availability.daysOfWeek.includes(date.getDay())) return false;
    const dateString = format(date, 'yyyy-MM-dd');
    if (availability.blockedDates.includes(dateString)) return false;
    return true;
  };

  const generateTimeSlots = () => {
    if (!date) return [];
    const slots = [];
    let currentTime = setMinutes(setHours(date, availability.hours.start), 0);
    const endTime = setMinutes(setHours(date, availability.hours.end), 0);

    while (currentTime <= endTime) {
      slots.push(format(currentTime, "HH:mm"));
      currentTime = addMinutes(currentTime, availability.slotDuration);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setStep(2);
  };

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          date: date ? format(date, "yyyy-MM-dd") : null,
          time,
        }),
      });

      if (res.ok) {
        setIsBooked(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isBooked) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[50vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">All Set! 🎉</h2>
          <p className="text-slate-600 mb-2">Your meeting is confirmed for:</p>
          <p className="text-xl font-semibold text-purple-600 mb-1">
            {date && format(date, "EEEE, MMMM do, yyyy")}
          </p>
          <p className="text-lg text-slate-700 mb-6">at {time} ({availability.timezone})</p>
          <p className="text-sm text-slate-500 mb-6">
            A confirmation email has been sent to {formData.email}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full py-6 text-lg rounded-xl"
          >
            Book Another Meeting
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
        >
          Book a meeting
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-600 text-lg"
        >
          Machine learning • local AI Systems • 100% secure
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-12 gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <motion.div 
              animate={{ 
                scale: step >= s ? 1.1 : 1,
                backgroundColor: step >= s ? "var(--active-color)" : "#e2e8f0",
                color: step >= s ? "#fff" : "#94a3b8"
              }}
              className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold shadow-lg z-10
                ${step >= s ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}
            >
              {s}
            </motion.div>
            {s < 3 && (
              <div className={`h-1 w-16 -ml-2 -mr-2 rounded transition-all duration-500 ${
                step > s ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <motion.div 
        layout
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[500px] border border-slate-100"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12"
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={prevMonth}
                  className="p-3 hover:bg-slate-100 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-3 hover:bg-slate-100 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-bold text-slate-400 uppercase tracking-wider text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-4">
                {days.map((day, i) => {
                  const isAvailable = isDateAvailable(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  
                  return (
                    <motion.button
                      key={day.toISOString()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.01 }}
                      onClick={() => isAvailable && handleDateSelect(day)}
                      disabled={!isAvailable || !isCurrentMonth}
                      className={`
                        aspect-square rounded-2xl font-semibold text-lg transition-all duration-300 relative group
                        ${!isCurrentMonth ? 'invisible' : ''}
                        ${isAvailable 
                          ? 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:scale-110 hover:shadow-lg text-slate-700 bg-slate-50' 
                          : 'text-slate-300 cursor-not-allowed'}
                        ${isToday(day) ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                      `}
                    >
                      {format(day, "d")}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12"
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-slate-500 hover:text-purple-600 mb-8 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to calendar
              </button>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Select a Time</h2>
                <p className="text-purple-600 font-medium text-lg">
                  {date && format(date, "EEEE, MMMM do, yyyy")}
                </p>
                <p className="text-slate-400 text-sm mt-1">{availability.timezone}</p>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {timeSlots.map((slot, i) => (
                  <motion.button
                    key={slot}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleTimeSelect(slot)}
                    className="py-4 px-2 rounded-xl border-2 border-slate-100 hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-slate-600"
                  >
                    {slot}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12 max-w-2xl mx-auto"
            >
              <button
                onClick={() => setStep(2)}
                className="flex items-center text-slate-500 hover:text-purple-600 mb-8 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to times
              </button>
              
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Your Details</h2>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-100/50">
                <div className="flex items-center gap-3 text-purple-900 mb-3 text-lg">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold">{date && format(date, "EEEE, MMMM do, yyyy")}</span>
                </div>
                <div className="flex items-center gap-3 text-purple-900 text-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold">{time}</span>
                  <span className="text-sm text-purple-400 ml-auto">{availability.timezone}</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 text-lg px-6 rounded-xl border-2 border-slate-200 focus:border-purple-600 focus:ring-purple-200 transition-all"
                    placeholder="Otto"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-700 font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-14 text-lg px-6 rounded-xl border-2 border-slate-200 focus:border-purple-600 focus:ring-purple-200 transition-all"
                    placeholder="otto@example.com"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white h-16 rounded-xl font-bold text-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-0 mt-8"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center space-y-2"
      >
        <p className="text-slate-500">
          This calendar is used to schedule meetings with LBdanton.
        </p>
        <p className="text-slate-500">
          For more information visit <a href="https://lbdanton.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors">lbdanton.com</a>.
        </p>
      </motion.div>
    </div>
  );
}
