import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 to-white font-sans">
      {/* Hero Section */}
      <header className="w-full flex flex-col items-center justify-center py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-200 to-indigo-900 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/EMS.png"
            alt="EMS logo"
            width={90}
            height={90}
            className="dark:invert drop-shadow-lg"
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Welcome to EMS Portal
          </h1>
        </div>
        <p className="max-w-2xl text-lg sm:text-xl text-blue-100 mb-8 text-center">
          The modern Examination Management System for institutions. Secure,
          fast, and easy to use.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <a
            href="/admin"
            className="bg-white text-blue-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-200 transition border border-blue-300 text-lg"
          >
            Admin Portal
          </a>
          <Link
            href="/about"
            className="bg-blue-900 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-950 transition border border-blue-300 text-lg"
          >
            Learn More
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center border-t-4 border-red-500">
          <Image
            src="/file.svg"
            alt="Feature 1"
            width={40}
            height={40}
            className="mb-4"
          />
          <h2 className="text-xl font-bold mb-2 text-blue-900">
            Easy Exam Setup
          </h2>
          <p className="text-gray-600">
            Create, schedule, and manage exams with just a few clicks. No
            paperwork, no hassle.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center border-t-4 border-red-300">
          <Image
            src="/window.svg"
            alt="Feature 2"
            width={40}
            height={40}
            className="mb-4"
          />
          <h2 className="text-xl font-bold mb-2 text-indigo-900">
            Real-Time Analytics
          </h2>
          <p className="text-gray-600">
            Track student performance and exam trends instantly with beautiful
            charts and reports.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center border-t-4 border-yellow-500">
          <Image
            src="/globe.svg"
            alt="Feature 3"
            width={40}
            height={40}
            className="mb-4"
          />
          <h2 className="text-xl font-bold mb-2 text-purple-900">
            Secure & Accessible
          </h2>
          <p className="text-gray-600">
            Your data is protected and accessible anywhere, anytime. Built with
            Next.js and MongoDB.
          </p>
        </div>
      </main>
    </div>
  );
}
