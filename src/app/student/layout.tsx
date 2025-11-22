"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  BookOpen,
  Award,
  User,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentName, setStudentName] = useState("Student");

  // Check authentication on mount
  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/student/login" || pathname === "/student/register") {
      return;
    }

    const studentAuth = localStorage.getItem("studentAuth");
    if (!studentAuth) {
      // Redirect to login if not authenticated
      router.push("/student/login");
    } else {
      try {
        const student = JSON.parse(studentAuth);
        setStudentName(student.name || "Student");
      } catch (error) {
        console.error("Error parsing student auth:", error);
        router.push("/student/login");
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("studentAuth");
    localStorage.removeItem("studentToken");
    router.push("/student/login");
  };

  // Don't show sidebar on login/register pages OR during exam
  const isExamPage = pathname?.includes("/take");
  if (
    pathname === "/student/login" ||
    pathname === "/student/register" ||
    isExamPage
  ) {
    return <>{children}</>;
  }

  const navigation = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/student/dashboard",
    },
    {
      label: "My Exams",
      icon: <FileText className="w-5 h-5" />,
      href: "/student/exams",
    },
    {
      label: "My Courses",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/student/courses",
    },
    {
      label: "Grades",
      icon: <Award className="w-5 h-5" />,
      href: "/student/grades",
    },
    {
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      href: "/student/profile",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Student Portal
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-3 px-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Logged in as
            </p>
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {studentName}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <Link
                href="/student/dashboard"
                className="flex items-center gap-2"
                onClick={() => setSidebarOpen(false)}
              >
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Student
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-3 px-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Logged in as
                </p>
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {studentName}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar for Mobile */}
        <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/student/dashboard" className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Student
              </span>
            </Link>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
