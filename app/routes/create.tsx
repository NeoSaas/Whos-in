import type { Route } from "./+types/create";
import { Form, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { createEvent } from "../../services/eventservice";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Event - Who's In" },
    { name: "description", content: "Create a new event in seconds" },
  ];
}

export default function CreateEvent() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🎉");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [dateFormat, setDateFormat] = useState<'long' | 'short' | 'numeric'>('long');
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isPM, setIsPM] = useState(false);
  const [timeError, setTimeError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fix for time display consistency between server and client
  useEffect(() => {
    // Only run time-related initializations on the client side
    if (typeof window !== 'undefined') {
      const now = new Date();
      const currentHour = now.getHours();
      setHours(currentHour > 12 ? (currentHour - 12).toString() : currentHour.toString());
      setMinutes(now.getMinutes().toString().padStart(2, '0'));
      setIsPM(currentHour >= 12);
      
      // Set initial date only on client side
      if (!selectedDate) {
        setSelectedDate(now);
      }
    }
  }, []);

  // Separate useEffect for event handlers to prevent issues with SSR
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
        setShowYearPicker(false);
      }
    }

    if (showEmojiPicker || showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker, showCalendar]);

  const commonEmojis = ["🎉", "🎮", "🍕", "🏞️", "🎬", "🎤", "🍹", "🎨", "🎸", "🎪", "🎯", "🎲"];

  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: dateFormat,
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + (direction === 'next' ? 1 : -1)));
  };

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isDateDisabled = (date: Date) => {
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, part: 'hours' | 'minutes') => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (part === 'hours') {
      if (value.length <= 2) {
        const numValue = parseInt(value);
        if (value === '' || (numValue >= 1 && numValue <= 12) || value.length === 1) {
          setHours(value);
        }
      }
    } else {
      if (value.length <= 2) {
        const numValue = parseInt(value);
        if (value === '' || (numValue >= 0 && numValue <= 59) || value.length === 1) {
          setMinutes(value);
        }
      }
    }

    // Validate complete time
    if (hours && minutes) {
      const timeString = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
      const timeRegex = /^([0-1]?[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
      if (!timeRegex.test(timeString)) {
        setTimeError('Please enter a valid time (HH:MM AM/PM)');
      } else {
        setTimeError('');
      }
    } else {
      setTimeError('');
    }
  };

  // Client-side only rendering for calendar components
  const renderCalendarContent = () => {
    if (typeof window === 'undefined') {
      return null; // Don't render calendar on server
    }
    
    // Calendar rendering logic here (existing code)
    // ...
  };

  
  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.currentTarget);
    
    // Format the time string
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    const timeString = `${formattedHours}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;
    
    const eventData = {
      name: formData.get("name") as string,
      date: selectedDate?.toISOString().split('T')[0] || '', // Get date in YYYY-MM-DD format
      time: timeString, // Time in 12-hour format
      place: formData.get("location") as string,
      emoji: formData.get("emoji") as string || "🎉",
      description: formData.get("description") as string,
      private: formData.get("private") === "on",
      attendees: [] // Initialize empty attendees array
    };
    
    try {
      setIsCreating(true);
      // Create the event in Firebase
      const eventId = await createEvent(eventData);
      setCreatedEventId(eventId);
      
      // Navigate to the event page
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);
      // Show error message to user
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 pt-24">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
              Create Your Event
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the details below to create your event. It'll take just a minute!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
              {/* Event Name with Emoji */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Name
                </label>
                <div className="flex gap-2">
                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-16 h-16 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <span className="text-4xl">{selectedEmoji}</span>
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute z-10 mt-2 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-[600px]">
                        <div className="grid grid-cols-8 gap-4">
                          {commonEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setSelectedEmoji(emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="w-16 h-16 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            >
                              <span className="text-3xl">{emoji}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g., Game Night, Pizza Party"
                  />
                </div>
                <input type="hidden" name="emoji" value={selectedEmoji} />
              </div>

              {/* Event Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <div className="relative" ref={calendarRef}>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-left"
                    >
                      {selectedDate ? formatDate(selectedDate) : 'Select a date'}
                    </button>
                    {showCalendar && (
                      <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-[350px]">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigateMonth('prev')}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                            >
                              ←
                            </button>
                            <div className="w-[160px] text-center">
                              <button
                                type="button"
                                onClick={() => setShowYearPicker(!showYearPicker)}
                                className="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                              >
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigateMonth('next')}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                            >
                              →
                            </button>
                          </div>
                        </div>
                        {showYearPicker ? (
                          <div className="grid grid-cols-4 gap-2">
                            {years.map(year => (
                              <button
                                key={year}
                                type="button"
                                onClick={() => {
                                  setCurrentMonth(new Date(year, currentMonth.getMonth()));
                                  setShowYearPicker(false);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm text-gray-500 dark:text-gray-400">
                                  {day}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {Array(firstDayOfMonth).fill(null).map((_, i) => (
                                <div key={`empty-${i}`} />
                              ))}
                              {days.map(day => {
                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const isSelected = selectedDate && 
                                  date.getDate() === selectedDate.getDate() &&
                                  date.getMonth() === selectedDate.getMonth() &&
                                  date.getFullYear() === selectedDate.getFullYear();
                                const isToday = day === today.getDate() && 
                                  currentMonth.getMonth() === today.getMonth() && 
                                  currentMonth.getFullYear() === today.getFullYear();
                                const isDisabled = isDateDisabled(date);

                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      if (!isDisabled) {
                                        setSelectedDate(date);
                                        setShowCalendar(false);
                                      }
                                    }}
                                    disabled={isDisabled}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                                      ${isSelected 
                                        ? 'bg-indigo-500 text-white' 
                                        : isToday 
                                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                                          : isDisabled
                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <input type="hidden" name="date" value={selectedDate?.toISOString().split('T')[0] || ''} required />
                  </div>
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="hours"
                      name="hours"
                      value={hours}
                      onChange={(e) => handleTimeChange(e, 'hours')}
                      placeholder="HH"
                      maxLength={2}
                      required
                      className={`w-16 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border ${
                        timeError ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center`}
                    />
                    <span className="text-gray-500 dark:text-gray-400 text-xl">:</span>
                    <input
                      type="text"
                      id="minutes"
                      name="minutes"
                      value={minutes}
                      onChange={(e) => handleTimeChange(e, 'minutes')}
                      placeholder="MM"
                      maxLength={2}
                      required
                      className={`w-16 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border ${
                        timeError ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center`}
                    />
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setIsPM(false)}
                        className={`px-3 py-3 rounded-xl border transition-all ${
                          !isPM 
                            ? 'bg-indigo-500 text-white border-indigo-500' 
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPM(true)}
                        className={`px-3 py-3 rounded-xl border transition-all ${
                          isPM 
                            ? 'bg-indigo-500 text-white border-indigo-500' 
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                  {timeError && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{timeError}</p>
                  )}
                  <input 
                    type="hidden" 
                    name="time" 
                    value={hours && minutes ? `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} ${isPM ? 'PM' : 'AM'}` : ''} 
                  />
                </div>
              </div>

              {/* Event Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell your friends what to expect..."
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g., Zoom, Local Park, Friend's House"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1"
              >
                Create Event
              </button>
            </Form>
          </div>
        </div>
      </div>
      
      {/* For any date/time display, use conditional rendering
      {typeof window !== 'undefined' && (
        // Date/time picker components here
      )} */}
    </main>
  );
} 