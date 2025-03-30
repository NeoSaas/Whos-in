import { Link } from "react-router";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
              <div className="flex justify-center mb-6 ">
                <img src="/logo_white_no_background.png" alt="Who's In Logo" className="w-32 h-32 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl" />
              </div>
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
              We believe in building tools that make people's lives easier and more efficient. Whos In? is a side project of a few of us at NeoSaas.
              We're a team of 6 software engineers who are passionate about Computer science and wanted to build something fun, free and maybe even useful.

            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 justify-center items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Check out our other projects and more about us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 flex justify-center items-center flex-col gap-4">
              <a href="https://www.neosaas.net" className="text-blue-500 hover:text-blue-600">www.neosaas.net</a>
              <a href="https://www.neosaas.net/about" className="text-blue-500 hover:text-blue-600"><FaGithub size={24} /></a>
              <a href="https://www.neosaas.net/contact" className="text-blue-500 hover:text-blue-600"><FaLinkedin size={24} /></a>
              <a href="https://www.neosaas.net/blog" className="text-blue-500 hover:text-blue-600"><FaXTwitter size={24} /></a>
              <a href="https://www.neosaas.net/careers" className="text-blue-500 hover:text-blue-600"><FaInstagram size={24} /></a>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-[url('/Muqtasid.jpg')] bg-cover bg-center rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Muqtasid</h3>
                <p className="text-gray-600 dark:text-gray-400">Full Stack Engineer</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl bg-[url('/aaron.jpg')] bg-cover bg-center">
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Aaron</h3>
                <p className="text-gray-600 dark:text-gray-400">Technical Founder</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-[url('/ayaan.jpg')] bg-cover bg-center rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Ayaan</h3>
                <p className="text-gray-600 dark:text-gray-400">Full Stack Engineer</p>
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