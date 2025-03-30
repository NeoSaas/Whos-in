import { Link } from "react-router";
import type { Route } from "./+types/landing";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Who's In - Fun Event Planning" },
        { name: "description", content: "The simplest way to plan events with friends" },
    ];
}

export default function Landing() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 pt-24">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
                    <div className="animate-bounce-slow">
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 flex flex-row items-center justify-center">
                        Who's In? 🎉
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl text-gray-700 dark:text-gray-300">
                        No login. No hassle. Just quick, fun event planning with friends!
                    </p>

                    {/* Simplified Action */}
                    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                        <Link to="/create" className="block w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 mb-4">
                            Create Event in Seconds!
                        </Link>
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

                {/* Public Events Section - Redesigned */}
                <section className="py-16 my-16 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-indigo-500"></div>
                        <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-pink-500"></div>
                        <div className="absolute bottom-10 left-1/3 w-48 h-48 rounded-full bg-purple-500"></div>
                    </div>
                    
                    <div className="relative z-10 container mx-auto px-4">
                        {/* Header with left alignment */}
                        <div className="max-w-xl mb-16">
                            <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
                                HAPPENING SOON
                            </span>
                            <h2 className="font-display text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Public Events
                            </h2>
                            <div className="w-20 h-1 bg-pink-500 mb-6"></div>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Join these community events - no invitation needed!
                            </p>
                        </div>
                        
                        {/* Timeline-style event listing */}
                        <div className="border-l-4 border-indigo-200 dark:border-indigo-800 pl-8 ml-4 md:ml-12 space-y-16">
                            {/* Event 1 */}
                            <div className="relative">
                                <div className="absolute -left-[42px] w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border-4 border-indigo-200 dark:border-indigo-800">
                                    <span className="text-2xl">🎮</span>
                                </div>
                                
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 ml-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gaming Night</h3>
                                        <div className="mt-2 flex flex-col md:flex-row gap-4 text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <span className="mr-2 text-indigo-500">📅</span> Friday at 8:00 PM
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2 text-indigo-500">📍</span> Online - Discord
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                                            12 attending
                                        </div>
                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm transition-all">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Event 2 */}
                            <div className="relative">
                                <div className="absolute -left-[42px] w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border-4 border-indigo-200 dark:border-indigo-800">
                                    <span className="text-2xl">🎭</span>
                                </div>
                                
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 ml-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Movie Screening</h3>
                                        <div className="mt-2 flex flex-col md:flex-row gap-4 text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <span className="mr-2 text-indigo-500">📅</span> Saturday at 7:30 PM
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2 text-indigo-500">📍</span> Central Park
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                                            24 attending
                                        </div>
                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm transition-all">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Event 3 */}
                            <div className="relative">
                                <div className="absolute -left-[42px] w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border-4 border-indigo-200 dark:border-indigo-800">
                                    <span className="text-2xl">🍕</span>
                                </div>
                                
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 ml-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Pizza Meetup</h3>
                                        <div className="mt-2 flex flex-col md:flex-row gap-4 text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <span className="mr-2 text-indigo-500">📅</span> Sunday at 1:00 PM
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2 text-indigo-500">📍</span> Downtown Plaza
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                                            8 attending
                                        </div>
                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm transition-all">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-16 text-center">
                            <Link to="/events" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-lg group">
                                See all public events 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
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
                            <Link to="/create">Start Now — No Sign Up!</Link>
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 text-center text-gray-600 dark:text-gray-400">
                    <p>Made @ NeoSaas by Muq, Aaron, and Ayaan</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</a>
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