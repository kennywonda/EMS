"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  XCircle,
} from "lucide-react";

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
  student: any;
  exam: {
    _id: string;
    title: string;
    course: string;
    department: string;
    totalPoints: number;
    passingScore: number;
    questions: Question[];
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

const GradeSubmission = ({
  params,
}: {
  params: Promise<{ id: string; submissionId: string }>;
}) => {
  const router = useRouter();
  const [examId, setExamId] = useState<string>("");
  const [submissionId, setSubmissionId] = useState<string>("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [gradingData, setGradingData] = useState<
    {
      questionNumber: number;
      pointsAwarded: number;
      feedback: string;
    }[]
  >([]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setExamId(resolvedParams.id);
      setSubmissionId(resolvedParams.submissionId);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/exams/submissions/${submissionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch submission");
      }
      const data = await response.json();
      setSubmission(data.data);

      // Initialize grading data for theory questions
      const theoryAnswers = data.data.answers.filter(
        (ans: Answer) => ans.questionType === "theory"
      );
      setGradingData(
        theoryAnswers.map((ans: Answer) => ({
          questionNumber: ans.questionNumber,
          pointsAwarded: ans.pointsAwarded || 0,
          feedback: ans.feedback || "",
        }))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (
    questionNumber: number,
    field: "pointsAwarded" | "feedback",
    value: number | string
  ) => {
    setGradingData((prev) => {
      const existing = prev.find((g) => g.questionNumber === questionNumber);
      if (existing) {
        return prev.map((g) =>
          g.questionNumber === questionNumber ? { ...g, [field]: value } : g
        );
      } else {
        return [
          ...prev,
          {
            questionNumber,
            pointsAwarded: field === "pointsAwarded" ? (value as number) : 0,
            feedback: field === "feedback" ? (value as string) : "",
          },
        ];
      }
    });
  };

  const getGradingForQuestion = (questionNumber: number) => {
    return gradingData.find((g) => g.questionNumber === questionNumber);
  };

  const handleSaveGrades = async () => {
    if (!submission) return;

    try {
      setSaving(true);
      setError("");

      // Validate points
      for (const grade of gradingData) {
        const question = submission.exam.questions.find(
          (q) => q.questionNumber === grade.questionNumber
        );
        if (question && grade.pointsAwarded > question.points) {
          throw new Error(
            `Points awarded for question ${grade.questionNumber} cannot exceed ${question.points}`
          );
        }
      }

      const response = await fetch(
        `/api/exams/submissions/${submissionId}/grade`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grades: gradingData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save grades");
      }

      setSuccess(true);

      // Refresh submission data
      await fetchSubmission();

      // Redirect back after a short delay
      setTimeout(() => {
        router.push(`/teacher/exams/${examId}/grade`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getStudentName = () => {
    if (!submission) return "Unknown";
    if (typeof submission.student === "string") return "Unknown Student";
    return submission.student.name || "Unknown Student";
  };

  const getStudentId = () => {
    if (!submission) return "";
    if (typeof submission.student === "string") return submission.student;
    return submission.student.studentId || submission.student._id;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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

  if (error && !submission) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert className="bg-red-50 text-red-900 border-red-200">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push(`/teacher/exams/${examId}/grade`)}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Submissions
        </Button>
      </div>
    );
  }

  if (!submission) return null;

  const theoryQuestions = submission.answers.filter(
    (ans) => ans.questionType === "theory"
  );
  const mcqQuestions = submission.answers.filter(
    (ans) => ans.questionType === "mcq"
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/teacher/exams/${examId}/grade`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Grade Submission
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {submission.exam.title}
          </p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Student: {getStudentName()} ({getStudentId()})
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <Alert className="mb-6 bg-green-50 text-green-900 border-green-200">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Grades saved successfully! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submission Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submission Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Score
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {submission.totalScore} / {submission.exam.totalPoints}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {submission.percentageScore.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted At
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(submission.submittedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    submission.status === "graded"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {submission.status === "graded" ? "Graded" : "Pending"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MCQ Questions Review */}
        {mcqQuestions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Multiple Choice Questions (Auto-Graded)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mcqQuestions.map((answer, index) => {
                  const question = submission.exam.questions.find(
                    (q) => q.questionNumber === answer.questionNumber
                  );
                  if (!question) return null;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        answer.isCorrect
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-300">
                            {answer.questionNumber}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {question.questionText}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {answer.pointsAwarded} / {question.points} pts
                          </span>
                          {answer.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                      <div className="ml-11">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Student answer:{" "}
                          <span className="font-semibold uppercase">
                            Option {answer.selectedOption}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Correct answer:{" "}
                          <span className="font-semibold uppercase">
                            Option {question.correctAnswer}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Theory Questions Grading */}
        {theoryQuestions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Theory Questions (Requires Manual Grading)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {theoryQuestions.map((answer, index) => {
                  const question = submission.exam.questions.find(
                    (q) => q.questionNumber === answer.questionNumber
                  );
                  if (!question) return null;

                  const grading = getGradingForQuestion(answer.questionNumber);

                  return (
                    <div
                      key={index}
                      className="p-6 rounded-lg border-2 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center font-semibold text-purple-700 dark:text-purple-300">
                            {answer.questionNumber}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {question.questionText}
                            </p>
                            <span className="text-sm text-purple-700 dark:text-purple-300 font-semibold">
                              Max Points: {question.points}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Student's Answer */}
                      <div className="ml-11 mb-4">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Student's Answer:
                        </Label>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 mt-2">
                          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                            {answer.textAnswer || "No answer provided"}
                          </p>
                        </div>
                      </div>

                      {/* Grading Section */}
                      <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor={`points-${answer.questionNumber}`}
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Points Awarded
                          </Label>
                          <Input
                            id={`points-${answer.questionNumber}`}
                            type="number"
                            min="0"
                            max={question.points}
                            value={grading?.pointsAwarded || 0}
                            onChange={(e) =>
                              handleGradeChange(
                                answer.questionNumber,
                                "pointsAwarded",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            disabled={saving || success}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Maximum: {question.points} points
                          </p>
                        </div>
                      </div>

                      <div className="ml-11 mt-4">
                        <Label
                          htmlFor={`feedback-${answer.questionNumber}`}
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Feedback (Optional)
                        </Label>
                        <textarea
                          id={`feedback-${answer.questionNumber}`}
                          value={grading?.feedback || ""}
                          onChange={(e) =>
                            handleGradeChange(
                              answer.questionNumber,
                              "feedback",
                              e.target.value
                            )
                          }
                          disabled={saving || success}
                          placeholder="Provide feedback to help the student understand..."
                          rows={3}
                          className="w-full mt-2 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/teacher/exams/${examId}/grade`)}
            disabled={saving || success}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveGrades}
            disabled={saving || success}
            className="min-w-[150px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Grades
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmission;
