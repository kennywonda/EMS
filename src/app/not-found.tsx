"use client";

import Link from "next/link";
import {
  Home,
  Compass,
  ShieldAlert,
  ArrowLeft,
  Search,
  Ghost,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-xl rounded-3xl p-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Ghost className="h-10 w-10 text-indigo-600" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Page not found
          </h1>
        </div>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. It may have been moved,
          deleted, or never existed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border bg-green-600 text-white hover:bg-green-200 transition px-5 py-3 font-semibold shadow"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700 transition px-5 py-3 font-semibold shadow"
          >
            <Compass className="h-5 w-5" />
            About EMS
          </Link>
          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-600 text-white hover:bg-purple-700 transition px-5 py-3 font-semibold shadow"
          >
            <ShieldAlert className="h-5 w-5" />
            Admin Portal
          </Link>
        </div>

        <div className="mt-10 text-gray-500 text-sm flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Double-check the URL or use the navigation above.</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>You can also go back to the previous page.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
