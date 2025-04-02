import { useState, useEffect } from "react";
import { Link } from "react-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { getOrCreateUserId } from "../../services/eventservice";
import type { Route } from "./+types/events";

export function meta({}: Route.MetaArgs) {
  const siteUrl = "https://whosin.app";
  const title = "My Events | Who's In?";
  const description = "View and manage all your created events. Track RSVPs, event details, and share your events with friends.";
  const ogImage = `${siteUrl}/og-myevents.png`;
  
  return [
    { title },
    { name: "description", content: description },
    
    // OpenGraph tags
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${siteUrl}/events` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "Who's In?" },
    
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    
    // Additional SEO tags
    { name: "keywords", content: "manage events, my events, event dashboard, event tracker" },
    { name: "robots", content: "noindex, follow" }, // Don't index personal pages
  ];
}

// Interface for event data
interface UserEvent {
  id: string;
  title: string;
  emoji: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: any[];
  createdAt: string;
  private: boolean;
}

export default function MyEvents() {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the user ID from local storage or create a new one
    const getUserId = async () => {
      try {
        const id = await getOrCreateUserId();
        setUserId(id);
        fetchUserEvents(id);
      } catch (err) {
        console.error("Error getting user ID:", err);
        setError("Failed to authenticate user");
        setLoading(false);
      }
    };

    getUserId();
  }, []);

  const fetchUserEvents = async (uid: string) => {
    try {
      setLoading(true);
      
      const eventsQuery = query(
        collection(db, "events"),
        where("creatorId", "==", uid)
      );
      
      const querySnapshot = await getDocs(eventsQuery);
      
      const userEvents: UserEvent[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Format the date
        let dateStr: string;
        try {
          dateStr = new Date(data.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch (e) {
          dateStr = data.date || "Date TBD";
        }
        
        // Handle the createdAt timestamp
        const createdAt = data.createdAt?.seconds ? 
          new Date(data.createdAt.seconds * 1000 + Math.floor(data.createdAt.nanoseconds / 1000000)) :
          new Date(data.createdAt);
        
        userEvents.push({
          id: doc.id,
          title: data.name,
          emoji: data.emoji || "🎉",
          date: dateStr,
          time: data.time,
          location: data.place,
          description: data.description,
          attendees: data.attendees || [],
          createdAt: createdAt.toISOString(), // Store as ISO string for consistency
          private: data.private
        });
      });
      
      // Sort events by created date (newest first)
      userEvents.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setEvents(userEvents);
    } catch (err) {
      console.error("Error fetching user events:", err);
      setError("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };
  
  // Update the isEventLinkValid function to handle Firestore timestamps
  const isEventLinkValid = (createdAt: string) => {
    try {
      const createdTime = new Date(createdAt).getTime();
      const currentTime = Date.now();
      const oneHourInMs = 60 * 60 * 1000;
      return (currentTime - createdTime) < oneHourInMs;
    } catch (e) {
      return false;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 pt-24">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">Loading your events...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 pt-24">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <div className="text-5xl mb-4">😥</div>
            <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">{error}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">We couldn't load your events. Please try again later.</p>
            <Link to="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium">
              Go back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 pt-24">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
            My Events
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            View and manage your created events
          </p>
        </div>

        {events.length === 0 ? (
          // Empty state - centered card
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md w-full">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🎈</div>
                <p className="text-lg mb-4">You haven't created any events yet.</p>
                <Link 
                  to="/create" 
                  className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium transition-all hover:shadow-lg transform hover:-translate-y-1"
                >
                  Create Your First Event
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Grid with max 3 per row
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link 
                key={event.id}
                to={`/event/${event.id}`}
                className="block bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg transform transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative">
                  {!isEventLinkValid(event.createdAt) && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                        Expired
                      </div>
                    </div>
                  )}
                  <div className="h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-4xl">{event.emoji}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {event.title}
                    </h2>
                    {event.private ? (
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                        Private
                      </span>
                    ) : (
                      <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                        Public
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="mr-2">📅</span> {event.date}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏰</span> {event.time}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📍</span> {event.location}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                      {event.attendees.filter(a => a.status === 'in').length} going
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                      View details →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 