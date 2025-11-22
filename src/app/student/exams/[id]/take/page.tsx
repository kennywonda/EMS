"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Send,
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
  allowedAttempts: number;
}

interface Answer {
  questionNumber: number;
  questionType: "mcq" | "theory";
  selectedOption?: "a" | "b" | "c" | "d";
  textAnswer?: string;
}

const TakeExam = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [examId, setExamId] = useState<string>("");
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
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
      fetchExam();
    }
  }, [examId, studentId]);

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0 && !success) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, success]);

  useEffect(() => {
    // Prevent accidental navigation away during exam
    if (!success && exam) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your exam progress will be lost.";
        return e.returnValue;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [success, exam]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch exam");
      }
      const data = await response.json();

      console.log("📝 Exam data received:", data);
      console.log("📝 Questions:", data.data.questions);

      // Check if exam is active
      if (!data.data.isActive) {
        setError("This exam is not currently available");
        return;
      }

      setExam(data.data);

      // Initialize answers array
      const initialAnswers: Answer[] = data.data.questions.map(
        (q: Question) => {
          console.log("📋 Question:", {
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            questionType: q.questionType,
            points: q.points,
          });
          return {
            questionNumber: q.questionNumber,
            questionType: q.questionType,
            selectedOption: undefined,
            textAnswer: "",
          };
        }
      );
      setAnswers(initialAnswers);

      // Set timer
      setTimeRemaining(data.data.duration * 60); // Convert minutes to seconds
      setStartTime(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMCQAnswer = (
    questionNumber: number,
    option: "a" | "b" | "c" | "d"
  ) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.questionNumber === questionNumber
          ? { ...ans, selectedOption: option }
          : ans
      )
    );
  };

  const handleTheoryAnswer = (questionNumber: number, text: string) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.questionNumber === questionNumber
          ? { ...ans, textAnswer: text }
          : ans
      )
    );
  };

  const handleAutoSubmit = async () => {
    if (submitting || success) return;
    setError("Time's up! Your exam has been automatically submitted.");
    await handleSubmit(true);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting || success) return;

    setSubmitting(true);
    setError("");

    try {
      // Calculate time spent
      const timeSpent = startTime
        ? Math.floor((new Date().getTime() - startTime.getTime()) / 60000)
        : exam?.duration || 0;

      const submissionData = {
        examId: examId,
        studentId: studentId,
        answers: answers.filter((ans) => {
          // Include answer if it has either selectedOption or textAnswer
          return ans.selectedOption || ans.textAnswer;
        }),
        timeSpent: timeSpent,
      };

      const response = await fetch("/api/exams/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit exam");
      }

      setSuccess(true);
      setShowSubmitConfirm(false);

      // Redirect to results after a short delay
      setTimeout(() => {
        router.push(`/student/exams/${examId}/result`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    return answers.filter((ans) => ans.selectedOption || ans.textAnswer).length;
  };

  const isQuestionAnswered = (questionNumber: number) => {
    const answer = answers.find((ans) => ans.questionNumber === questionNumber);
    return !!(answer?.selectedOption || answer?.textAnswer);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert className="bg-red-50 text-red-900 border-red-200">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/student/exams")} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  if (!exam) return null;

  const currentQ = exam.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Exam Mode Warning Banner */}
      <div className="bg-orange-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>
            EXAM MODE: Do not leave this page or your progress will be lost
          </span>
        </div>
      </div>

      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {exam.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {exam.course} • {exam.department}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Progress */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getAnsweredCount()} / {exam.questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Exam submitted successfully! Redirecting to results...
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <Alert className="bg-red-50 text-red-900 border-red-200">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Question */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQ.questionNumber} of{" "}
                    {exam.questions.length}
                  </CardTitle>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {currentQ.points}{" "}
                    {currentQ.points === 1 ? "point" : "points"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      currentQ.questionType === "mcq"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                    }`}
                  >
                    {currentQ.questionType === "mcq"
                      ? "Multiple Choice"
                      : "Theory"}
                  </span>
                  {isQuestionAnswered(currentQ.questionNumber) && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                      Answered
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Question Text */}
                <div className="mb-6">
                  <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                    {currentQ.questionText}
                  </p>
                </div>

                {/* MCQ Options */}
                {currentQ.questionType === "mcq" && currentQ.options && (
                  <div className="space-y-3">
                    {Object.entries(currentQ.options)
                      .filter(
                        ([key]) =>
                          key !== "_id" && ["a", "b", "c", "d"].includes(key)
                      )
                      .map(([key, value]) => {
                        const option = key as "a" | "b" | "c" | "d";
                        const answer = answers.find(
                          (ans) =>
                            ans.questionNumber === currentQ.questionNumber
                        );
                        const isSelected = answer?.selectedOption === option;

                        return (
                          <button
                            key={option}
                            onClick={() =>
                              handleMCQAnswer(currentQ.questionNumber, option)
                            }
                            disabled={success || submitting}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            } ${
                              success || submitting
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-3 h-3 bg-white rounded-full" />
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                  {option}.
                                </span>{" "}
                                <span className="text-gray-900 dark:text-white">
                                  {value}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}

                {/* Theory Answer */}
                {currentQ.questionType === "theory" && (
                  <div>
                    <textarea
                      value={
                        answers.find(
                          (ans) =>
                            ans.questionNumber === currentQ.questionNumber
                        )?.textAnswer || ""
                      }
                      onChange={(e) =>
                        handleTheoryAnswer(
                          currentQ.questionNumber,
                          e.target.value
                        )
                      }
                      disabled={success || submitting}
                      placeholder="Type your answer here..."
                      rows={10}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Provide a detailed answer to receive full points
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentQuestion((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentQuestion === 0 || success || submitting}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Question {currentQuestion + 1} of {exam.questions.length}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentQuestion((prev) =>
                        Math.min(exam.questions.length - 1, prev + 1)
                      )
                    }
                    disabled={
                      currentQuestion === exam.questions.length - 1 ||
                      success ||
                      submitting
                    }
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((q, index) => (
                    <button
                      key={q.questionNumber}
                      onClick={() => setCurrentQuestion(index)}
                      disabled={success || submitting}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        currentQuestion === index
                          ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2"
                          : isQuestionAnswered(q.questionNumber)
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200"
                      } ${
                        success || submitting
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {q.questionNumber}
                    </button>
                  ))}
                </div>

                {/* Exam Info */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                      Total Points
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {exam.totalPoints}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                      Passing Score
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {exam.passingScore}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getAnsweredCount()} / {exam.questions.length} answered
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            (getAnsweredCount() / exam.questions.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {!showSubmitConfirm ? (
                  <Button
                    onClick={() => setShowSubmitConfirm(true)}
                    disabled={success || submitting}
                    className="w-full mt-6"
                    variant="default"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Exam
                  </Button>
                ) : (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
                      Are you sure you want to submit?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSubmit(false)}
                        disabled={submitting}
                        size="sm"
                        className="flex-1"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Yes, Submit"
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowSubmitConfirm(false)}
                        disabled={submitting}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
