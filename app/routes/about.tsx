import { Link } from "react-router";

export function meta() {
  return [
    { title: "About Us - Who's In?" },
    { name: "description", content: "Learn about the team behind Who's In?" },
  ];
}

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 pt-24">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
              About Us
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Meet the team behind Who's In?
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <img src="/logo_white_no_background.png" alt="Who's In Logo" className="w-32 h-32 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Who's In?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                A simple, elegant solution for event planning and RSVPs.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              About NeoSaas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              NeoSaas is a tech startup focused on creating innovative solutions for modern businesses. 
              We believe in building tools that make people's lives easier and more efficient.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  M
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Muqtasid</h3>
                <p className="text-gray-600 dark:text-gray-400">Software Engineer</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  A
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Aaron</h3>
                <p className="text-gray-600 dark:text-gray-400">Software Engineer</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  A
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Ayaan</h3>
                <p className="text-gray-600 dark:text-gray-400">Software Engineer</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/" 
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 