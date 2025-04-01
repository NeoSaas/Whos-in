import { Link } from "react-router";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="flex flex-row justify-between items-center absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center relative">
        <a href="/" className="font-bold text-2xl flex flex-row items-center font-display justify-center z-20">
          <img src="/logo_white_no_background.png" alt="Who's In Logo" className="w-32 h-32 mr-2" />
        </a>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-20 flex flex-col justify-center items-center gap-1.5 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-8 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-8 h-0.5 bg-gray-600 dark:bg-gray-400 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-8 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/create" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">Create Event</Link>
          <Link to="/public" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">Public Events</Link>
          <Link to="/events" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">My Events</Link>
          <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-2xl">About</Link>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <div 
          className={`absolute top-25 right-4 bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out z-30 md:hidden ${
            isMenuOpen 
              ? 'transform scale-100 opacity-100' 
              : 'transform scale-95 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col w-60">
            <Link 
              to="/create" 
              className="px-6 py-4 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xl font-medium border-b border-gray-100 dark:border-gray-700"
              onClick={closeMenu}
            >
              Create Event
            </Link>
            <Link 
              to="/public" 
              className="px-6 py-4 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xl font-medium border-b border-gray-100 dark:border-gray-700"
              onClick={closeMenu}
            >
              Public Events
            </Link>
            <Link 
              to="/events" 
              className="px-6 py-4 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xl font-medium border-b border-gray-100 dark:border-gray-700"
              onClick={closeMenu}
            >
              My Events
            </Link>
            <Link 
              to="/about" 
              className="px-6 py-4 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xl font-medium"
              onClick={closeMenu}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 