import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getEvents } from "../../services/eventservice";

export function meta() {
  return [
    { title: "Public Events - Who's In?" },
    { name: "description", content: "Browse and join public events" },
  ];
}

export default function PublicEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getEvents();
        // Filter for public events only
        const publicEvents = allEvents.filter((event: any) => !event.private);
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
        <div className="max-w-4xl mx-auto">
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
                <div className="space-y-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{event.emoji || "🎉"}</span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{event.name}</h3>
                            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                              <span>📅 {event.date}</span>
                              <span>🕒 {event.time}</span>
                              <span>📍 {event.place}</span>
                            </div>
                          </div>
                        </div>
                        <Link 
                          to={`/event/${event.id}`}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                          Join
                        </Link>
                      </div>
                      {event.description && (
                        <p className="mt-4 text-gray-600 dark:text-gray-400">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="text-gray-600 dark:text-gray-400">
                    Showing {events.length} events out of {totalEvents} total
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