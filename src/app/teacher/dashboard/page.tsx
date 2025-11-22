"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("ems_teacher");
    if (stored) {
      setTeacher(JSON.parse(stored));
    } else {
      router.replace("/teacher/login");
    }
  }, [router]);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-lg space-y-4">
        <h1 className="text-3xl font-bold mb-2">Welcome, {teacher.name}!</h1>
        <div className="text-gray-700 dark:text-gray-200">
          Email: {teacher.email}
        </div>
        <div className="text-gray-700 dark:text-gray-200">
          Phone: {teacher.phone}
        </div>
        <div className="text-gray-700 dark:text-gray-200">
          Employee ID: {teacher.employeeId}
        </div>
        {teacher.subject && (
          <div className="text-gray-700 dark:text-gray-200">
            Subject: {teacher.subject}
          </div>
        )}
        {teacher.department && (
          <div className="text-gray-700 dark:text-gray-200">
            Department: {teacher.department}
          </div>
        )}
        {teacher.address && (
          <div className="text-gray-700 dark:text-gray-200">
            Address: {teacher.address}
          </div>
        )}
        <div className="mt-6 pt-6 border-t space-y-2">
          <Button
            onClick={() => router.push("/teacher/exams")}
            className="w-full"
          >
            Grade Exams
          </Button>
        </div>
        <Button
          onClick={() => {
            localStorage.removeItem("ems_teacher");
            router.replace("/teacher/login");
          }}
          variant="destructive"
          className="mt-4 w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
