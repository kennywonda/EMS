"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileText,
  Settings,
  Calendar,
  BarChart3,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  userRole?: "admin" | "teacher";
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  userRole = "admin",
}: SidebarProps) => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Define menu items based on user role
  const adminMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      label: "Teachers",
      icon: <Users className="h-5 w-5" />,
      children: [
        {
          label: "All Teachers",
          icon: <GraduationCap className="h-4 w-4" />,
          href: "/admin/teachers",
        },
        {
          label: "Add Teacher",
          icon: <GraduationCap className="h-4 w-4" />,
          href: "/admin/teachers/new",
        },
      ],
    },
    {
      label: "Students",
      icon: <GraduationCap className="h-5 w-5" />,
      children: [
        {
          label: "All Students",
          icon: <GraduationCap className="h-4 w-4" />,
          href: "/admin/students",
        },
        {
          label: "Add Student",
          icon: <GraduationCap className="h-4 w-4" />,
          href: "/admin/students/new",
        },
      ],
    },
    {
      label: "Examinations",
      icon: <ClipboardCheck className="h-5 w-5" />,
      children: [
        {
          label: "All Exams",
          icon: <FileText className="h-4 w-4" />,
          href: "/admin/exams",
        },
        {
          label: "Create Exam",
          icon: <FileText className="h-4 w-4" />,
          href: "/admin/exams/new",
        },
        {
          label: "Results",
          icon: <BarChart3 className="h-4 w-4" />,
          href: "/admin/exams/results",
        },
      ],
    },
    {
      label: "Courses",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/admin/courses",
    },
    {
      label: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      href: "/admin/schedule",
    },
    {
      label: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/reports",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ];

  const teacherMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/teacher/dashboard",
    },
    {
      label: "My Classes",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/teacher/classes",
    },
    {
      label: "Students",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/teacher/students",
    },
    {
      label: "Examinations",
      icon: <ClipboardCheck className="h-5 w-5" />,
      children: [
        {
          label: "My Exams",
          icon: <FileText className="h-4 w-4" />,
          href: "/teacher/exams",
        },
        {
          label: "Create Exam",
          icon: <FileText className="h-4 w-4" />,
          href: "/teacher/exams/new",
        },
        {
          label: "Grade Exams",
          icon: <BarChart3 className="h-4 w-4" />,
          href: "/teacher/exams/grade",
        },
      ],
    },
    {
      label: "Assignments",
      icon: <FileText className="h-5 w-5" />,
      href: "/teacher/assignments",
    },
    {
      label: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      href: "/teacher/schedule",
    },
    {
      label: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/teacher/reports",
    },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : teacherMenuItems;

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const isActive = (href: string) => pathname === href;

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.includes(item.label);
    const active = item.href ? isActive(item.href) : false;

    if (hasChildren) {
      return (
        <div key={item.label} className="mb-1">
          <button
            onClick={() => toggleGroup(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200",
              "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800",
              "font-medium text-sm"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || "#"}
        onClick={handleLinkClick}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 mb-1",
          "text-sm font-medium",
          active
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800",
          level > 0 && "text-xs"
        )}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50 transition-transform duration-300 ease-in-out",
          "w-72 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <Link
            href={
              userRole === "admin" ? "/admin/dashboard" : "/teacher/dashboard"
            }
            className="relative w-[110px] h-[24px] flex items-center"
          >
            <Image
              width={110}
              height={24}
              src="/EMS.png"
              alt="EMS Logo"
              priority
              className="block dark:hidden transition-all duration-300"
            />
            <Image
              width={110}
              height={24}
              src="/EMS-black.png"
              alt="EMS Logo Dark"
              priority
              className="hidden dark:block transition-all duration-300"
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            EMS v1.0 • {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
