"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Award,
  Loader2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface Answer {
  questionNumber: number;
  questionType: "mcq" | "theory";
  selectedOption?: "a" | "b" | "c" | "d";
  textAnswer?: string;
  isCorrect?: boolean;
  pointsAwarded: number;
  feedback?: string;
}

interface Submission {
  _id: string;
  exam: {
    _id: string;
    title: string;
    course: string;
    department: string;
    totalPoints: number;
    passingScore: number;
  };
  answers: Answer[];
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

const ExamResult = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [examId, setExamId] = useState<string>("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState<string>("");

  // Get student ID from localStorage
  useEffect(() => {
    const studentAuth = localStorage.getItem("studentAuth");
    if (studentAuth) {
      try {
        const student = JSON.parse(studentAuth);
        setStudentId(student._id);
      } catch (error) {
        console.error("Error parsing student auth:", error);
        router.push("/student/login");
      }
    } else {
      router.push("/student/login");
    }
  }, [router]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setExamId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (examId && studentId) {
      fetchResult();
    }
  }, [examId, studentId]);

  const fetchResult = async () => {
    try {
      // Fetch all submissions for this exam
      const response = await fetch(`/api/exams/${examId}/submissions`);
      if (!response.ok) {
        throw new Error("Failed to fetch exam results");
      }
      const data = await response.json();

      console.log("📊 Submissions data:", data);
      console.log("🔍 Looking for student ID:", studentId);

      // Find the latest submission for this student
      // Handle both cases: student as object or student as string ID
      const studentSubmissions = data.data.filter((sub: any) => {
        const subStudentId =
          typeof sub.student === "string" ? sub.student : sub.student?._id;
        console.log("🔍 Comparing:", subStudentId, "with", studentId);
        return subStudentId === studentId;
      });

      console.log("✅ Found submissions:", studentSubmissions.length);

      if (studentSubmissions.length === 0) {
        throw new Error("No submission found");
      }

      // Get the most recent submission
      const latestSubmission = studentSubmissions.sort(
        (a: any, b: any) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )[0];

      console.log("📝 Latest submission:", latestSubmission);
      setSubmission(latestSubmission);
    } catch (err: any) {
      console.error("❌ Error fetching result:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
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

  if (error || !submission) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert className="bg-red-50 text-red-900 border-red-200">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            {error || "Failed to load exam results"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/student/exams")} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  const getGradeColor = () => {
    if (submission.percentageScore >= 90)
      return "text-green-600 dark:text-green-400";
    if (submission.percentageScore >= 80)
      return "text-blue-600 dark:text-blue-400";
    if (submission.percentageScore >= 70)
      return "text-yellow-600 dark:text-yellow-400";
    if (submission.percentageScore >= 60)
      return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGradeLetter = () => {
    if (submission.percentageScore >= 90) return "A";
    if (submission.percentageScore >= 80) return "B";
    if (submission.percentageScore >= 70) return "C";
    if (submission.percentageScore >= 60) return "D";
    return "F";
  };

  const correctAnswers = submission.answers.filter(
    (ans) => ans.isCorrect
  ).length;
  const totalQuestions = submission.answers.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/student/exams")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exams
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exam Results
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {submission.exam.title}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <Alert
          className={`mb-6 ${
            submission.passed
              ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-200"
              : "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-200"
          }`}
        >
          {submission.passed ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <AlertDescription className="text-lg font-semibold">
            {submission.passed
              ? "Congratulations! You passed!"
              : "You did not pass this exam"}
            {submission.status === "submitted" &&
              " (Pending grading for theory questions)"}
          </AlertDescription>
        </Alert>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {submission.totalScore}
                <span className="text-xl text-gray-500 dark:text-gray-400">
                  /{submission.exam.totalPoints}
                </span>
              </div>
              <p className={`text-sm font-semibold mt-2 ${getGradeColor()}`}>
                {submission.percentageScore.toFixed(1)}% • Grade{" "}
                {getGradeLetter()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Correct Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {correctAnswers}
                <span className="text-xl text-gray-500 dark:text-gray-400">
                  /{totalQuestions}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {((correctAnswers / totalQuestions) * 100).toFixed(0)}% correct
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Time Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Clock className="w-6 h-6 text-gray-500" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {submission.timeSpent || 0}
                  <span className="text-xl text-gray-500 dark:text-gray-400 ml-1">
                    min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  submission.status === "graded"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                    : submission.status === "submitted"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {submission.status === "graded" && "Graded"}
                {submission.status === "submitted" && "Pending Review"}
                {submission.status === "in-progress" && "In Progress"}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Attempt #{submission.attemptNumber}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Exam Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Course
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {submission.exam.course}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Department
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {submission.exam.department}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted At
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {submission.submittedAt
                    ? formatDate(submission.submittedAt)
                    : "Not submitted"}
                </p>
              </div>
              {submission.gradedAt && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Graded At
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(submission.gradedAt)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {submission.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                      : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-300">
                        {answer.questionNumber}
                      </span>
                      <div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            answer.questionType === "mcq"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                          }`}
                        >
                          {answer.questionType === "mcq" ? "MCQ" : "Theory"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {answer.pointsAwarded} points
                      </span>
                      {answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </div>

                  {/* MCQ Answer */}
                  {answer.questionType === "mcq" && answer.selectedOption && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your answer:
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white uppercase">
                        Option {answer.selectedOption}
                      </p>
                    </div>
                  )}

                  {/* Theory Answer */}
                  {answer.questionType === "theory" && answer.textAnswer && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Your answer:
                      </p>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                          {answer.textAnswer}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {answer.feedback && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                        Teacher Feedback:
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        {answer.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Overall Score
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {submission.percentageScore.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      submission.passed ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${submission.percentageScore}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Passing Score
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {submission.exam.passingScore} points
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Your Score
                </span>
                <span
                  className={`font-semibold ${
                    submission.passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {submission.totalScore} points
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamResult;
