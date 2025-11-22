"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  FileEdit,
  Filter,
} from "lucide-react";

interface Submission {
  _id: string;
  student:
    | {
        _id: string;
        name: string;
        email: string;
        studentId: string;
      }
    | string;
  exam: string;
  answers: any[];
  totalScore: number;
  percentageScore: number;
  passed: boolean;
  attemptNumber: number;
  status: "in-progress" | "submitted" | "graded";
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
  timeSpent?: number;
}

interface Exam {
  _id: string;
  title: string;
  course: string;
  department: string;
  totalPoints: number;
  passingScore: number;
  questions: any[];
}

const GradeExam = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [examId, setExamId] = useState<string>("");
  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "submitted" | "graded">("all");

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setExamId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (examId) {
      fetchData();
    }
  }, [examId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch exam details
      const examResponse = await fetch(`/api/exams/${examId}`);
      if (!examResponse.ok) {
        throw new Error("Failed to fetch exam details");
      }
      const examData = await examResponse.json();
      setExam(examData.data);

      // Fetch submissions
      const submissionsResponse = await fetch(
        `/api/exams/${examId}/submissions`
      );
      if (!submissionsResponse.ok) {
        throw new Error("Failed to fetch submissions");
      }
      const submissionsData = await submissionsResponse.json();
      setSubmissions(submissionsData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSubmissions = () => {
    if (filter === "all") return submissions;
    return submissions.filter((sub) => sub.status === filter);
  };

  const getStudentName = (submission: Submission) => {
    if (typeof submission.student === "string") {
      return "Unknown Student";
    }
    return submission.student.name;
  };

  const getStudentId = (submission: Submission) => {
    if (typeof submission.student === "string") {
      return submission.student;
    }
    return submission.student.studentId || submission.student._id;
  };

  const hasTheoryQuestions = (submission: Submission) => {
    return submission.answers.some((ans) => ans.questionType === "theory");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert className="bg-red-50 text-red-900 border-red-200">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error || "Failed to load exam"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/teacher/exams")} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  const filteredSubmissions = getFilteredSubmissions();
  const submittedCount = submissions.filter(
    (s) => s.status === "submitted"
  ).length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/teacher/exams")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exams
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Submissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{exam.title}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {exam.course} • {exam.department}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {submissions.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending Grading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {submittedCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Graded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {gradedCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({submissions.length})
          </Button>
          <Button
            variant={filter === "submitted" ? "default" : "outline"}
            onClick={() => setFilter("submitted")}
            size="sm"
          >
            Pending ({submittedCount})
          </Button>
          <Button
            variant={filter === "graded" ? "default" : "outline"}
            onClick={() => setFilter("graded")}
            size="sm"
          >
            Graded ({gradedCount})
          </Button>
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <FileEdit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No submissions found</p>
                <p className="text-sm">
                  {filter === "all"
                    ? "No students have submitted this exam yet"
                    : `No ${filter} submissions`}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card
                key={submission._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {getStudentName(submission)}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Student ID: {getStudentId(submission)}
                          </p>
                          <div className="flex gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">
                                Submitted: {formatDate(submission.submittedAt)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-300">
                                Attempt #{submission.attemptNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {submission.totalScore}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              /{exam.totalPoints}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {submission.percentageScore.toFixed(1)}%
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                              submission.status === "graded"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {submission.status === "graded" ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Graded
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                          {hasTheoryQuestions(submission) && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-semibold">
                              Has Theory Questions
                            </span>
                          )}
                          {submission.passed ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              ✓ Passed
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 font-semibold">
                              ✗ Failed
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() =>
                            router.push(
                              `/teacher/exams/${examId}/submissions/${submission._id}`
                            )
                          }
                          size="sm"
                        >
                          <FileEdit className="w-4 h-4 mr-2" />
                          {submission.status === "graded"
                            ? "Review"
                            : "Grade Now"}
                        </Button>
                      </div>
                    </div>
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

export default GradeExam;
