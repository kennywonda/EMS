"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  Circle,
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

const CreateExam = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Exam basic info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [duration, setDuration] = useState("");
  const [passingScore, setPassingScore] = useState("");
  const [instructions, setInstructions] = useState("");
  const [allowedAttempts, setAllowedAttempts] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionNumber: 1,
      questionText: "",
      questionType: "mcq",
      points: 1,
      options: { a: "", b: "", c: "", d: "" },
      correctAnswer: "a",
    },
  ]);

  // Get user ID from localStorage (you'll need to set this during login)
  const getUserId = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id;
      }
    }
    return "temp-user-id"; // Fallback
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      questionNumber: questions.length + 1,
      questionText: "",
      questionType: "mcq",
      points: 1,
      options: { a: "", b: "", c: "", d: "" },
      correctAnswer: "a",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      alert("Exam must have at least one question");
      return;
    }
    const updated = questions.filter((_, i) => i !== index);
    // Renumber questions
    const renumbered = updated.map((q, i) => ({ ...q, questionNumber: i + 1 }));
    setQuestions(renumbered);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    if (field.startsWith("option_")) {
      const optionKey = field.split("_")[1] as "a" | "b" | "c" | "d";
      updated[index].options = {
        ...updated[index].options!,
        [optionKey]: value,
      };
    } else {
      (updated[index] as any)[field] = value;
    }
    setQuestions(updated);
  };

  const toggleQuestionType = (index: number) => {
    const updated = [...questions];
    if (updated[index].questionType === "mcq") {
      updated[index].questionType = "theory";
      delete updated[index].options;
      delete updated[index].correctAnswer;
    } else {
      updated[index].questionType = "mcq";
      updated[index].options = { a: "", b: "", c: "", d: "" };
      updated[index].correctAnswer = "a";
    }
    setQuestions(updated);
  };

  const calculateTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!title || !course || !department || !duration || !passingScore) {
        throw new Error("Please fill in all required fields");
      }

      const totalPoints = calculateTotalPoints();
      if (parseFloat(passingScore) > totalPoints) {
        throw new Error("Passing score cannot be greater than total points");
      }

      // Validate questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText.trim()) {
          throw new Error(`Question ${i + 1}: Question text is required`);
        }
        if (q.questionType === "mcq") {
          if (
            !q.options?.a ||
            !q.options?.b ||
            !q.options?.c ||
            !q.options?.d
          ) {
            throw new Error(
              `Question ${i + 1}: All options are required for MCQ`
            );
          }
        }
      }

      const examData = {
        title,
        description,
        course,
        department,
        duration: parseInt(duration),
        passingScore: parseFloat(passingScore),
        instructions,
        allowedAttempts: parseInt(allowedAttempts),
        isActive,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        questions,
        createdBy: getUserId(),
      };

      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Exam created successfully!");
        setTimeout(() => {
          router.push("/admin/exams");
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to create exam");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
            Create New Exam
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in the exam details and add questions
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="questions">
              Questions ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">
                      Exam Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Computer Science Mid-term Exam"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="course">
                      Course <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="course"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g., Computer Science 101"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 60"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the exam"
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">Instructions (Optional)</Label>
                  <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Instructions for students taking this exam"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Total Points</Label>
                    <div className="text-2xl font-bold text-blue-600">
                      {calculateTotalPoints()}
                    </div>
                    <p className="text-xs text-gray-500">
                      Calculated from all questions
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="passingScore">
                      Passing Score <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="passingScore"
                      type="number"
                      min="0"
                      step="0.1"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      placeholder="e.g., 50"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum score to pass
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      Question {question.questionNumber}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleQuestionType(index)}
                      >
                        {question.questionType === "mcq" ? "MCQ" : "Theory"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>
                        Question Text <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(index, "questionText", e.target.value)
                        }
                        placeholder="Enter your question here"
                        className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                        required
                      />
                    </div>

                    <div className="w-32">
                      <Label>
                        Points <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={question.points}
                        onChange={(e) =>
                          updateQuestion(
                            index,
                            "points",
                            parseFloat(e.target.value)
                          )
                        }
                        required
                      />
                    </div>

                    {question.questionType === "mcq" && question.options && (
                      <div className="space-y-3">
                        <Label>
                          Options <span className="text-red-500">*</span>
                        </Label>
                        {(["a", "b", "c", "d"] as const).map((optionKey) => (
                          <div
                            key={optionKey}
                            className="flex items-center gap-3"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(
                                  index,
                                  "correctAnswer",
                                  optionKey
                                )
                              }
                              className="flex-shrink-0"
                            >
                              {question.correctAnswer === optionKey ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                            <span className="font-medium uppercase w-6">
                              {optionKey}.
                            </span>
                            <Input
                              value={question.options?.[optionKey] || ""}
                              onChange={(e) =>
                                updateQuestion(
                                  index,
                                  `option_${optionKey}`,
                                  e.target.value
                                )
                              }
                              placeholder={`Option ${optionKey.toUpperCase()}`}
                              required
                            />
                          </div>
                        ))}
                        <p className="text-xs text-gray-500">
                          Click the circle to mark the correct answer
                        </p>
                      </div>
                    )}

                    {question.questionType === "theory" && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          <strong>Theory Question:</strong> Students will
                          provide a written answer. This question will require
                          manual grading.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="allowedAttempts">
                      Allowed Attempts <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="allowedAttempts"
                      type="number"
                      min="1"
                      value={allowedAttempts}
                      onChange={(e) => setAllowedAttempts(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of times a student can take this exam
                    </p>
                  </div>
                  <div>
                    <Label>Exam Status</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="isActive" className="cursor-pointer">
                        Active (students can take this exam)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date (Optional)</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/exams")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Exam
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
