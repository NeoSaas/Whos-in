import type { Route } from "./+types/landing";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Who's In - Fun Event Planning" },
    { name: "description", content: "The simplest way to plan events with friends" },
  ];
}

export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
          <div className="animate-bounce-slow">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6">
              Who's In? 🎉
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl text-gray-700 dark:text-gray-300">
            No login. No hassle. Just quick, fun event planning with friends!
          </p>
          
          {/* Simplified Action */}
          <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 mb-4">
              Create Event in Seconds!
            </button>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No account needed! 100% anonymous.</p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Ridiculously Simple 👌
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-2xl font-bold mb-6">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example Events Section */}
        <section className="py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Popular Events
          </h2>
          <p className="text-center text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Jump right in with these ready-to-go templates!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleEvents.map((event, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-800 group"
              >
                <div className="h-48 rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold text-6xl transform group-hover:scale-105 transition-transform">
                  {event.emoji}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">{event.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{event.description}</p>
                <button className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium transition-all">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-12 shadow-xl">
            <div className="animate-pulse-slow mb-6">
              <span className="text-6xl">🚀</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">Ready for spontaneous fun?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Create an event, share the link, see who's in. That's it!
            </p>
            <button className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1">
              Start Now — No Sign Up!
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-gray-600 dark:text-gray-400">
          <p>Made with ❤️ for simplicity</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Help</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a>
          </div>
        </footer>
      </div>
    </main>
  );
}

// Step data
const steps = [
  {
    title: "Create Event",
    description: "Choose a name, date, and what you're planning to do. No login required!"
  },
  {
    title: "Share the Link",
    description: "Send the unique link to your friends through any messaging app."
  },
  {
    title: "See Who's In",
    description: "Watch RSVPs roll in real-time. No accounts, no fuss, no tracking."
  }
];

// Sample events
const sampleEvents = [
  {
    emoji: "🎮",
    title: "Game Night",
    description: "Casual online gaming session with friends"
  },
  {
    emoji: "🍕",
    title: "Pizza Party",
    description: "Order from different places & compare"
  },
  {
    emoji: "🏞️",
    title: "Weekend Hike",
    description: "Easy trail with amazing views"
  },
  {
    emoji: "🎬",
    title: "Movie Marathon",
    description: "Vote on films & watch together"
  },
  {
    emoji: "🎤",
    title: "Karaoke Night",
    description: "Embarrass yourselves together"
  },
  {
    emoji: "🍹",
    title: "Virtual Happy Hour",
    description: "BYO drinks & good vibes"
  }
]; 