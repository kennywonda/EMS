"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  FileText,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const StudentDashboard = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Back, Student!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's an overview of your academic progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Exams</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Due this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Exams this semester
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/student/exams")}
            >
              <FileText className="w-4 h-4 mr-2" />
              View Available Exams
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/student/courses")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Courses
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/student/grades")}
            >
              <Award className="w-4 h-4 mr-2" />
              Check Grades
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Mathematics Final
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due in 2 days
                  </p>
                </div>
                <Button size="sm" onClick={() => router.push("/student/exams")}>
                  Start
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Physics Midterm
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due in 5 days
                  </p>
                </div>
                <Button size="sm" onClick={() => router.push("/student/exams")}>
                  Start
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Chemistry Quiz
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due in 1 week
                  </p>
                </div>
                <Button size="sm" onClick={() => router.push("/student/exams")}>
                  Start
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b dark:border-gray-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Completed Computer Science Exam
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Score: 92% • 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b dark:border-gray-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  New exam available: Biology Midterm
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Yesterday
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Enrolled in Advanced Mathematics
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  3 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
