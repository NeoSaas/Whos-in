import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getEvents } from "../../services/eventservice";

export function meta() {
  const siteUrl = "https://www.whos-in.com";
  const title = "Public Events | Who's In?";
  const description = "Discover and join public events created by the Who's In? community. Find events near you that interest you.";
  const ogImage = `https://www.whos-in.com/og-public.png`;
  
  return [
    { title },
    { name: "description", content: description },
    
    // OpenGraph tags
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${siteUrl}/public` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "Who's In?" },
    
    // Twitter Card tags
    { name: "twitter:card", content: ogImage },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    
    // Additional SEO tags
    { name: "keywords", content: "public events, community events, find events, join events, event listing" },
    { name: "robots", content: "index, follow" },
  ];
}

export default function PublicEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 6; // Changed to 6 to make it divisible by 2

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getEvents();
        // Filter for public events only and sort by createdAt
        const publicEvents = allEvents
          .filter((event: any) => !event.private)
          .sort((a: any, b: any) => {
            // Handle Firestore timestamp objects
            const getTimestamp = (event: any) => {
              const createdAt = event.createdAt;
              if (!createdAt) return 0;

              // If it's a Firestore timestamp
              if (createdAt.seconds) {
                return createdAt.seconds * 1000 + Math.floor(createdAt.nanoseconds / 1000000);
              }
              // If it's an ISO string
              return new Date(createdAt).getTime();
            };

            return getTimestamp(b) - getTimestamp(a); // Sort descending (newest first)
          });

        setTotalEvents(publicEvents.length);

        // Calculate pagination
        const startIndex = (currentPage - 1) * eventsPerPage;
        const endIndex = startIndex + eventsPerPage;
        const paginatedEvents = publicEvents.slice(startIndex, endIndex);

        setEvents(paginatedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [currentPage]);

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 pt-24">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
              Public Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join these community events - no invitation needed!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            {events.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">No public events available at the moment.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-3xl">{event.emoji || "🎉"}</span>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{event.name}</h3>
                              <div className="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-400">
                                <span>📅 {event.date}</span>
                                <span>🕒 {event.time}</span>
                                <span>📍 {event.place}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    event.locationType === 'online'
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                        : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                                }`}>
                                    {event.locationType === 'online' ? 'Online' : 'Real Life'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {event.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{event.description}</p>
                        )}
                        <div className="mt-auto">
                          <Link
                            to={`/event/${event.id}`}
                            className="w-full inline-block text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-left space-x-4 flex-col">
                    <div className="text-gray-600 dark:text-gray-400 mb-2">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Total events: {totalEvents}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 