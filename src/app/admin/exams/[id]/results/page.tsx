"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Eye,
  FileText,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Calendar,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Submission {
  _id: string;
  studentName: string;
  studentId: string;
  totalScore: number;
  percentageScore: number;
  passed: boolean;
  attemptNumber: number;
  status: "in-progress" | "submitted" | "graded";
  submittedAt: string;
  timeSpent?: number;
}

interface Exam {
  _id: string;
  title: string;
  course: string;
  department: string;
  totalPoints: number;
  passingScore: number;
}

const ExamResults = () => {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (examId) {
      fetchExamAndSubmissions();
    }
  }, [examId]);

  const fetchExamAndSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch exam details
      const examResponse = await fetch(`/api/exams/${examId}`);
      const examData = await examResponse.json();

      if (!examResponse.ok) {
        throw new Error(examData.error || "Failed to fetch exam");
      }

      // Handle both old and new API response formats
      const exam = examData.data || examData.exam;
      setExam(exam);

      // Fetch submissions
      const submissionsResponse = await fetch(
        `/api/exams/${examId}/submissions`
      );
      const submissionsData = await submissionsResponse.json();

      if (submissionsResponse.ok) {
        // Handle both old and new API response formats
        const submissions =
          submissionsData.data || submissionsData.submissions || [];
        setSubmissions(submissions);
      } else {
        throw new Error(submissionsData.error || "Failed to fetch submissions");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submissionId: string) => {
    router.push(`/admin/exams/${examId}/submissions/${submissionId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const gradedSubmissions = submissions.filter((s) => s.status === "graded");
  const averageScore =
    gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((sum, s) => sum + s.percentageScore, 0) /
        gradedSubmissions.length
      : 0;
  const passedCount = gradedSubmissions.filter((s) => s.passed).length;
  const passRate =
    gradedSubmissions.length > 0
      ? (passedCount / gradedSubmissions.length) * 100
      : 0;
  const pendingGrading = submissions.filter(
    (s) => s.status === "submitted"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
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
            {exam.course} • {exam.department}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Graded: {gradedSubmissions.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Out of {exam.totalPoints} points
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {passedCount} of {gradedSubmissions.length} passed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Grading
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGrading}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No submissions yet for this exam
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Attempt</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {submission.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {submission.studentId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          #{submission.attemptNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div
                            className={`text-sm font-medium ${
                              submission.passed
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {submission.totalScore} / {exam.totalPoints}
                          </div>
                          <div className="text-xs text-gray-500">
                            {submission.percentageScore.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {submission.status === "graded" ? (
                            submission.passed ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium">
                                  Passed
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-medium">
                                  Failed
                                </span>
                              </>
                            )
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-yellow-600" />
                              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 font-medium">
                                Pending
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(submission.submittedAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {submission.timeSpent
                            ? `${submission.timeSpent} min`
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSubmission(submission._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamResults;
