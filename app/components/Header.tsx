import { Link } from "react-router";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/landing" className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <span className="font-display text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Who's In
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              to="/landing" 
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/create" 
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Create Event
            </Link>
            <Link 
              to="/events" 
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              My Events
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 