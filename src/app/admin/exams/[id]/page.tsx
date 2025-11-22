"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  FileText,
  Calendar,
  Users,
  Award,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  questionNumber: number;
  questionText: string;
  questionType: "mcq" | "theory";
  points: number;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer?: "a" | "b" | "c" | "d";
}

interface Exam {
  _id: string;
  title: string;
  description?: string;
  course: string;
  department: string;
  duration: number;
  totalPoints: number;
  passingScore: number;
  instructions?: string;
  questions: Question[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  allowedAttempts: number;
  createdBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ExamDetail = () => {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (examId) {
      fetchExam();
    }
  }, [examId]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/exams/${examId}`);
      const data = await response.json();

      if (response.ok) {
        // Handle both old and new API response formats
        const examData = data.data || data.exam;
        setExam(examData);
      } else {
        setError(data.error || "Failed to fetch exam");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Exam deleted successfully");
        router.push("/admin/exams");
      } else {
        alert(data.error || "Failed to delete exam");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>{error || "Exam not found"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/exams")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  const mcqCount = exam.questions.filter(
    (q) => q.questionType === "mcq"
  ).length;
  const theoryCount = exam.questions.filter(
    (q) => q.questionType === "theory"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/admin/exams")}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {exam.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {exam.description || "View exam details and questions"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/admin/exams/${examId}/results`)}
            variant="outline"
            className="text-blue-600"
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            View Results
          </Button>
          <Button
            onClick={() => router.push(`/admin/exams/${examId}/edit`)}
            variant="outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            exam.isActive
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          }`}
        >
          {exam.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Exam Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.duration} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              Pass: {exam.passingScore}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.questions.length}</div>
            <p className="text-xs text-muted-foreground">
              MCQ: {mcqCount} • Theory: {theoryCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attempts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exam.allowedAttempts}</div>
            <p className="text-xs text-muted-foreground">Allowed per student</p>
          </CardContent>
        </Card>
      </div>

      {/* Exam Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Course
              </label>
              <p className="text-base font-medium">{exam.course}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Department
              </label>
              <p className="text-base font-medium">{exam.department}</p>
            </div>
            {exam.startDate && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Start Date
                </label>
                <p className="text-base font-medium">
                  {formatDate(exam.startDate)}
                </p>
              </div>
            )}
            {exam.endDate && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  End Date
                </label>
                <p className="text-base font-medium">
                  {formatDate(exam.endDate)}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Created By
              </label>
              <p className="text-base font-medium">
                {exam.createdBy?.name || "Unknown"}
              </p>
              {exam.createdBy?.email && (
                <p className="text-sm text-gray-500">{exam.createdBy.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Created At
              </label>
              <p className="text-base font-medium">
                {formatDate(exam.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {exam.instructions && (
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {exam.instructions}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({exam.questions.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {exam.questions.map((question, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">
                    {question.questionNumber}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      question.questionType === "mcq"
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                        : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                    }`}
                  >
                    {question.questionType === "mcq"
                      ? "Multiple Choice"
                      : "Theory"}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {question.points} points
                </span>
              </div>

              <p className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
                {question.questionText}
              </p>

              {question.questionType === "mcq" && question.options && (
                <div className="space-y-2">
                  {Object.entries(question.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        question.correctAnswer === key
                          ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {question.correctAnswer === key ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase mr-2">
                          {key}.
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {value}
                        </span>
                        {question.correctAnswer === key && (
                          <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">
                            (Correct Answer)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {question.questionType === "theory" && (
                <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Student will provide a written answer for this question.
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamDetail;
