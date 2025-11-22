"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Shield,
  Users,
  BarChart,
  Clock,
  Menu,
  X,
  ArrowRight,
  Award,
  FileCheck,
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/EMS.png"
                alt="EMS Logo"
                width={45}
                height={45}
                className="drop-shadow-md"
                priority
              />
              <span className="text-xl font-bold text-gray-900">
                EMS Portal
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Features
              </Link>
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-semibold shadow-md text-sm"
              >
                Admin
              </Link>
              <Link
                href="/teacher/login"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition font-semibold shadow-md text-sm"
              >
                Teacher
              </Link>
              <Link
                href="/student/login"
                className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition font-semibold shadow-md text-sm"
              >
                Student
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-3">
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/admin"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  href="/teacher/login"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Teacher Login
                </Link>
                <Link
                  href="/student/login"
                  className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Student Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Shield className="w-4 h-4" />
                Secure & Reliable
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Modern Examination
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Management System
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Streamline your exam processes with our comprehensive platform.
                Create, manage, and grade exams efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/student/register"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all font-semibold text-lg group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full hover:shadow-lg transition-all font-semibold text-lg border-2 border-gray-200"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    100+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    50+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Exams Created
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    99%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main classroom image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/images/class.png"
                    alt="Modern Examination Hall"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-900">
                        Active Exams
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary student image - floating card */}
                <div className="absolute -bottom-6 -right-6 w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Image
                    src="/images/school.png"
                    alt="Student Taking Exam"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10"></div>
              <div className="absolute bottom-10 left-10 w-56 h-56 bg-indigo-200 rounded-full blur-3xl opacity-30 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage examinations efficiently
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Easy Exam Creation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Create exams with MCQ and theory questions in minutes. Set
                duration and grading criteria easily.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Student Management
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Manage student accounts, track performance, and monitor exam
                attempts with analytics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track exam performance with detailed analytics. View scores and
                identify areas for improvement.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Secure Platform
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enterprise-grade security with encrypted data storage and secure
                authentication.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Automated Grading
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                MCQ questions graded automatically. Teachers grade theory
                questions with feedback.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Certificate Generation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Award digital certificates to students who pass exams with
                customizable templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join institutions using EMS to streamline their examination
            processes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/student/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full hover:shadow-2xl transition-all font-semibold text-lg group"
            >
              Register as Student
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-full hover:bg-blue-900 transition-all font-semibold text-lg border-2 border-blue-400"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/EMS.png"
                  alt="EMS Logo"
                  width={40}
                  height={40}
                  className="invert"
                />
                <span className="text-xl font-bold text-white">EMS Portal</span>
              </div>
              <p className="text-sm text-gray-400">
                Modern examination management system for educational
                institutions.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Users</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/student/login"
                    className="hover:text-white transition"
                  >
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/teacher/login"
                    className="hover:text-white transition"
                  >
                    Teacher Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student/register"
                    className="hover:text-white transition"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@ems-portal.com</li>
                <li>Built with Next.js</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 EMS Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
