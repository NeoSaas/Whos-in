import type { Route } from "./+types/events";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Events - Who's In" },
    { name: "description", content: "View and manage your events" },
  ];
}

export default function Events() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
              My Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your upcoming events
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">No events yet. Create your first event!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 