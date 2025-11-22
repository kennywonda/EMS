"use client";

import {
  Award,
  Bell,
  GraduationCap,
  LogOut,
  Search,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminTopNav({
  adminName,
  institutionName,
  onLogoutAction,
  roleLabel = "Administrator",
  showInstitution = true,
  onMenuClick,
}: {
  adminName: string;
  institutionName: string;
  onLogoutAction: () => void;
  roleLabel?: string;
  showInstitution?: boolean;
  onMenuClick?: () => void;
}) {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                EMS Dashboard
              </h1>
              {showInstitution && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {institutionName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {adminName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {roleLabel}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {adminName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogoutAction}>
              <LogOut className="h-5 w-5 text-red-600" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
