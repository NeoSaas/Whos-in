import { Link } from "react-router";

export function Header() {
  return (
    <nav className="flex flex-row justify-between items-center absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
        <Link to="/" className="font-bold text-2xl flex flex-row items-center font-display justify-center"><img src="/logo_white_no_background.png" alt="Who's In Logo" className="w-32 h-32 mr-2 " /></Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">Home</Link>
          <Link to="/create" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">Create Event</Link>
          <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">Public Events</Link>
          <Link to="/events" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">My Events</Link>
          <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">About</Link>
        </div>
      </div>
    </nav>
  );
} 