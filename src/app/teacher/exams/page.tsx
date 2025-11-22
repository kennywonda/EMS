"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Loader2,
  AlertCircle,
  FileEdit,
  Clock,
  Users,
  ClipboardCheck,
} from "lucide-react";

interface Exam {
  _id: string;
  title: string;
  description?: string;
  course: string;
  department: string;
  duration: number;
  totalPoints: number;
  passingScore: number;
  questions: any[];
  isActive: boolean;
  createdAt: string;
}

const TeacherExams = () => {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExams(exams);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = exams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.course.toLowerCase().includes(query) ||
          exam.department.toLowerCase().includes(query)
      );
      setFilteredExams(filtered);
    }
  }, [searchQuery, exams]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/exams");
      const data = await response.json();

      if (response.ok) {
        // Filter only active exams for teachers
        const activeExams = data.data.filter((exam: Exam) => exam.isActive);
        setExams(activeExams);
        setFilteredExams(activeExams);
      } else {
        setError(data.error || "Failed to fetch exams");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Exams
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            View and grade student submissions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search exams by title, course, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Exams List */}
        {filteredExams.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No exams found</p>
                <p className="text-sm">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "No active exams available"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredExams.map((exam) => (
              <Card
                key={exam._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {exam.title}
                      </CardTitle>
                      {exam.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {exam.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <ClipboardCheck className="w-4 h-4" />
                          <span>
                            {exam.course} • {exam.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{exam.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{exam.questions.length} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {exam.totalPoints}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total Points
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        Pass: {exam.passingScore}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {formatDate(exam.createdAt)}
                    </div>
                    <Button
                      onClick={() =>
                        router.push(`/teacher/exams/${exam._id}/grade`)
                      }
                    >
                      <FileEdit className="w-4 h-4 mr-2" />
                      Grade Submissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherExams;
