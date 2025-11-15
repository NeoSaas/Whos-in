import { Link } from "react-router";
import { useState, useEffect } from "react";
import type { Route as ImportedRoute } from "./+types/votePage";
import { useParams } from "react-router";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import type { MetaFunction } from "react-router";
import { SocialShareImage } from "../components/SocialShareImage";
import { getFunctions, httpsCallable } from "firebase/functions";
import CryptoJS from 'crypto-js';

const CLIENT_SECRET = "B&fB=ayO+?l9jM<";

export namespace Route {
  export type MetaArgs = Parameters<MetaFunction>[0];
  export type LoaderData = {
    event?: {
      title: string;
      date: string;
      time?: string;
    };
  };
}

export function meta({ params, data }: Route.MetaArgs & { data: Route.LoaderData }) {
  const { eventId } = params;
  if (!data || !data.event) {
    return [
      { title: "Event RSVP - Who's In?" },
      { name: "description", content: "Let everyone know if you're in for this event!" },
    ];
  }
  
  const { event } = data;
  const eventUrl = `https://www.whos-in.com/event/${eventId}`;
  const ogImageUrl = `https://www.whos-in.com/og-image.png`;
  
  return [
    { title: `${event.title} | Who's In?` },
    { name: "description", content: `RSVP to ${event.title} on ${event.date}${event.time ? ` at ${event.time}` : ''}. Join us!` },
    
    // OpenGraph tags
    { property: "og:url", content: eventUrl },
    { property: "og:type", content: "website" },
    { property: "og:title", content: `${event.title} | Who's In?` },
    { property: "og:description", content: `RSVP to ${event.title} on ${event.date}${event.time ? ` at ${event.time}` : ''}. Join us!` },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    
    // Twitter Card tags
    { name: "twitter:card", content: ogImageUrl },
    { name: "twitter:title", content: `${event.title} | Who's In?` },
    { name: "twitter:description", content: `RSVP to ${event.title} on ${event.date}${event.time ? ` at ${event.time}` : ''}. Join us!` },
    { name: "twitter:image", content: ogImageUrl },
  ];
}

const env = import.meta.env;

// Function to generate or retrieve user ID
const getOrCreateUserId = async (): Promise<string> => {
  // Check local storage first
  let userId = localStorage.getItem('attendeeId');

  if (!userId) {
    // Generate a new user ID
    userId = crypto.randomUUID();

    // Store in local storage
    localStorage.setItem('attendeeId', userId);

    // Create a user document in Firestore
    const userRef = doc(db, "attendees", userId);
    await setDoc(userRef, {
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  }

  return userId;
};

interface Attendee {
  userId: string;
  name: string;
  status: string;
}

// Get Firebase Functions instance
const functions = getFunctions();

export default function VotePage() {
  const { eventId } = useParams();
  const [name, setName] = useState("");
  const [formResponse, setFormResponse] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // Default to 1 hour in seconds
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Fetch event data if we have an eventId
  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) {
        // If no eventId, use demo event data
        setEvent({
          id: "demo123",
          title: "Friday Game Night",
          emoji: "🎮",
          date: "Friday, March 31",
          time: "8:00 PM",
          location: "Online - Discord",
          locationType: "online",
          description: "Join us for a night of gaming and fun! We'll be playing various party games and chatting.",
          host: "Alex",
          attendees: [
            { name: "Taylor", status: "in", },
            { name: "Jordan", status: "in" },
            { name: "Casey", status: "maybe" },
            { name: "Riley", status: "out" },
            { name: "Anonymous user", status: "in" }
          ]
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch event data from Firestore
        const eventRef = doc(db, "events", eventId);
        const eventSnapshot = await getDoc(eventRef);

        if (eventSnapshot.exists()) {
          // Transform Firestore data to match our expected format
          const eventData = eventSnapshot.data();
          
          // Handle Firestore Timestamp object
          const createdAtTime = eventData.createdAt ? 
            // If it's a Firestore timestamp
            (eventData.createdAt.seconds ? 
              // If it's a Firestore timestamp
              (eventData.createdAt.seconds * 1000 + Math.floor(eventData.createdAt.nanoseconds / 1000000)) :
              // If it's an ISO string (from your current code)
              new Date(eventData.createdAt).getTime()) :
            // If it's an ISO string (from your current code)
            new Date(eventData.createdAt).getTime();
          
          const currentTime = Date.now();
          const elapsedTimeInSeconds = Math.floor((currentTime - createdAtTime) / 1000);
          const oneHourInSeconds = 60 * 60;
          const remainingSeconds = Math.max(0, oneHourInSeconds - elapsedTimeInSeconds);
          
          setTimeRemaining(remainingSeconds);
          
          // Set expired flag if more than an hour has passed
          if (remainingSeconds <= 0) {
            setIsExpired(true);
          }

          // Format the date and time
          const dateStr = new Date(eventData.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          });
          
          setCreatorId(eventData.creatorId);
          setEvent({
            id: eventId,
            title: eventData.name,
            emoji: eventData.emoji || "🎉",
            date: dateStr,
            time: eventData.time, // Use the time string directly
            location: eventData.place,
            locationType: eventData.locationType,
            description: eventData.description,
            attendees: eventData.attendees || [],
            createdAt: eventData.createdAt
          });
          setAttendees(eventData.attendees || []);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsExpired(true);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time remaining as hh:mm:ss
  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResponse = (status: string) => {
    if (isSubmitting || isExpired) return; // Prevent submissions if expired
    setFormResponse(status);
    setShowNameInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const displayName = name.trim() ? name : "Anonymous user";

    try {
      const userId = await getOrCreateUserId();
      if (userId && creatorId && userId === creatorId) {
        alert("You cannot RSVP to your own event.");
        setIsSubmitting(false);
        return;
      }

      if (eventId) {
        // Generate timestamp ONCE and use it throughout
        const timestamp = Date.now();

        const rsvpData = {
          eventId,
          displayName,
          status: formResponse
        };

        // Create signature using the same timestamp that will be sent
        const dataToSign = {
          eventData: rsvpData,
          timestamp,
          userId
        };
        
        // Generate signature using the stringified data
        const signature = CryptoJS.HmacSHA256(
          JSON.stringify(dataToSign),
          CLIENT_SECRET
        ).toString();
        

        // Use the same data structure for the request
        const response = await fetch('https://updateattendees-hcroxm72oa-uc.a.run.app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventData: rsvpData,
            signature,
            timestamp, // Use the same timestamp
            userId
          })
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to update RSVP');
        }

        // Success handling
        setShowNameInput(false);
        const eventRef = doc(db, "events", eventId);
        const eventSnapshot = await getDoc(eventRef);
        if (eventSnapshot.exists()) {
          setAttendees(eventSnapshot.data().attendees || []);
        }
      }
    } catch (err) {
      console.error("Error updating RSVP:", err);
      alert("Failed to update RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate the invite link based on window location and event ID
  const generateInviteLink = () => {
    if (typeof window === 'undefined') {
      // Server-side rendering safe version
      return `/event/${event?.id || 'demo123'}`;
    }
    // Client-side version with full URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/event/${event?.id || 'demo123'}`;
  };

  // Handle copying the invite link
  const handleCopyLink = () => {
    const link = generateInviteLink();
    navigator.clipboard.writeText(link)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => {
          setLinkCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };

  // Modify the countdown timer display to show expired message when needed
  const renderCountdown = () => {
    return (
      <div className="text-center mb-6">
        {isExpired ? (
          <>
            <p className="text-sm text-red-500 dark:text-red-400 mb-1">This link has expired</p>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              00:00:00
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">This link will expire in:</p>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              {formatTimeRemaining()}
            </p>
          </>
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading event...</p>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
          <div className="text-5xl mb-4">😥</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">{error}</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">The event you're looking for couldn't be found or has expired.</p>
          <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium">
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950">
      <nav className="flex flex-row justify-between items-center">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
          <Link to="/" className="font-bold text-2xl flex flex-row items-center font-display justify-center">
            <img src="/logo_white_no_background.png" alt="Who's In Logo" className="w-32 h-32 mr-2" />
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Event Details Card */}
        <section className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex items-center justify-center h-24 w-24 mx-auto rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-5xl font-bold mb-6">
            {event.emoji}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
            {event.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <span className="mr-2">📅</span> {event.date}
            </div>
            <div className="flex items-center">
              <span className="mr-2">⏰</span> {event.time}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📍</span>
              <span className="text-gray-700 dark:text-gray-300">{event.location}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                event.locationType === 'online'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
              }`}>
                {event.locationType === 'online' ? 'Online' : 'Real Life'}
              </span>
            </div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {event.description}
          </p>

          {/* Countdown Timer */}
          {renderCountdown()}

          {/* RSVP Buttons */}
          {!showNameInput ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleResponse("in")}
                disabled={isSubmitting || isExpired}
                className={`px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                  isSubmitting || isExpired ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                I'm In! 👍
              </button>
              <button
                onClick={() => handleResponse("maybe")}
                disabled={isSubmitting || isExpired}
                className={`px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                  isSubmitting || isExpired ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Maybe 🤔
              </button>
              <button
                onClick={() => handleResponse("out")}
                disabled={isSubmitting || isExpired}
                className={`px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                  isSubmitting || isExpired ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Can't Make It 👎
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (optional)"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
              <div className="flex flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNameInput(false);
                    setFormResponse(null);
                    setIsSubmitting(false);
                  }}
                  disabled={isSubmitting}
                  className={`w-full px-8 py-4 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-lg transition-all hover:shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Attendees Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Who's In?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Going */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400 flex items-center">
                <span className="mr-2">👍</span> Going
              </h3>
              <ul className="space-y-4">
                {attendees
                  .filter((a: any) => a.status === "in")
                  .map((attendee: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-gray-800 dark:text-gray-200">{attendee.name}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Maybe */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-400 flex items-center">
                <span className="mr-2">🤔</span> Maybe
              </h3>
              <ul className="space-y-4">
                {attendees
                  .filter((a: any) => a.status === "maybe")
                  .map((attendee: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-gray-800 dark:text-gray-200">{attendee.name}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Not Going */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400 flex items-center">
                <span className="mr-2">👎</span> Can't Make It
              </h3>
              <ul className="space-y-4">
                {attendees
                  .filter((a: any) => a.status === "out")
                  .map((attendee: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-gray-800 dark:text-gray-200">{attendee.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="text-center mb-12">
            <button
              onClick={handleCopyLink}
              className="px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium text-lg transition-all hover:shadow-lg border border-indigo-200 dark:border-indigo-800"
            >
              <span className="flex items-center justify-center gap-2">
                <span>📋</span> Copy Invite Link
              </span>
            </button>
          </div>

          {event && (
            <div className="text-center mb-12 w-full flex justify-center items-center">
              <SocialShareImage
                eventId={eventId || event.id}
                eventTitle={event.title}
                eventEmoji={event.emoji}
                eventDate={event.date}
                eventTime={event.time}
              />
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 dark:text-gray-400">
        <p>Made @ NeoSaas by Muq, Aaron, and Ayaan</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Help</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a>
        </div>
      </footer>

      {linkCopied && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          transition: 'opacity 0.5s',
          opacity: 1,
        }}>
          Link copied!
        </div>
      )}
    </main>
  );
}