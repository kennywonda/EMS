"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  Loader2,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Exam {
  _id: string;
  title: string;
  description?: string;
  course: string;
  department: string;
  duration: number;
  totalPoints: number;
  passingScore: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  allowedAttempts: number;
  createdAt: string;
  instructions?: string;
}

const StudentExams = () => {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    // Countdown timer
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0 && selectedExam) {
      // Countdown finished, navigate to exam
      router.push(`/student/exams/${selectedExam._id}/take`);
    }
  }, [showCountdown, countdown, selectedExam, router]);

  useEffect(() => {
    // Filter exams based on search query
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
    setCurrentPage(1);
  }, [searchQuery, exams]);

  const fetchExams = async () => {
    try {
      const response = await fetch("/api/exams");
      if (!response.ok) {
        throw new Error("Failed to fetch exams");
      }
      const data = await response.json();
      // Filter only active exams for students
      const activeExams = data.data.filter((exam: Exam) => exam.isActive);
      setExams(activeExams);
      setFilteredExams(activeExams);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isExamAvailable = (exam: Exam) => {
    const now = new Date();

    if (exam.startDate && new Date(exam.startDate) > now) {
      return { available: false, reason: "Not started yet" };
    }

    if (exam.endDate && new Date(exam.endDate) < now) {
      return { available: false, reason: "Exam has ended" };
    }

    return { available: true, reason: "" };
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStartExam = async (exam: Exam) => {
    try {
      // Fetch full exam details including instructions
      const response = await fetch(`/api/exams/${exam._id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedExam(data.data);
      } else {
        setSelectedExam(exam);
      }
    } catch (error) {
      console.error("Error fetching exam details:", error);
      setSelectedExam(exam);
    }
    setCountdown(10);
    setShowCountdown(true);
  };

  const handleCancelCountdown = () => {
    setShowCountdown(false);
    setCountdown(10);
    setSelectedExam(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Available Exams
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          View and take your assigned exams
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="mb-6 bg-red-50 text-red-900 border-red-200">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Exams
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredExams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredExams.reduce((sum, exam) => sum + exam.totalPoints, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(filteredExams.map((exam) => exam.department)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by title, course, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Exams Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Details</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Passing Score</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No exams found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((exam) => {
                  const availability = isExamAvailable(exam);
                  return (
                    <TableRow key={exam._id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {exam.title}
                          </p>
                          {exam.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {exam.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {exam.department}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {exam.course}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{exam.duration} min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold">
                          {exam.totalPoints}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {exam.passingScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        {availability.available ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {availability.reason}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleStartExam(exam)}
                          disabled={!availability.available}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Exam
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredExams.length)} of{" "}
            {filteredExams.length} exams
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Countdown Modal */}
      {showCountdown && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Exam Starting Soon
              </CardTitle>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {selectedExam.title}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Countdown Circle */}
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
                        {countdown}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        seconds
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6">
                  Get Ready!
                </p>
              </div>

              {/* Exam Details */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedExam.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Points
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedExam.totalPoints}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Passing Score
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedExam.passingScore}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Course
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedExam.course}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Instructions
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-3">
                  {selectedExam.instructions && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
                      <p className="font-medium mb-1">Exam Instructions:</p>
                      <p className="whitespace-pre-wrap">
                        {selectedExam.instructions}
                      </p>
                    </div>
                  )}
                  {selectedExam.description && (
                    <p className="italic">{selectedExam.description}</p>
                  )}
                  <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
                    <p className="font-medium mb-2">General Guidelines:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Read each question carefully before answering</li>
                      <li>
                        You have {selectedExam.duration} minutes to complete the
                        exam
                      </li>
                      <li>
                        You can navigate between questions using the navigation
                        buttons
                      </li>
                      <li>
                        Make sure to submit your answers before time runs out
                      </li>
                      <li>Once submitted, you cannot change your answers</li>
                      {selectedExam.allowedAttempts === 1 && (
                        <li className="font-semibold text-orange-700 dark:text-orange-300">
                          ⚠️ You only have ONE attempt for this exam
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancelCountdown}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentExams;
