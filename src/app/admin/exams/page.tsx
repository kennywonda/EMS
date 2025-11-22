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
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  ClipboardCheck,
  Loader2,
  FileText,
  Calendar,
  Users,
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
  questions: any[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  allowedAttempts: number;
  createdBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const Exams = () => {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchExams();
  }, []);

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
          exam.department.toLowerCase().includes(query) ||
          exam.description?.toLowerCase().includes(query)
      );
      setFilteredExams(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, exams]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/exams");
      const data = await response.json();

      if (response.ok) {
        // Handle both old and new API response formats
        const examsData = data.data || data.exams || [];
        setExams(examsData);
        setFilteredExams(examsData);
      } else {
        setError(data.error || "Failed to fetch exams");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const handleView = (examId: string) => {
    router.push(`/admin/exams/${examId}`);
  };

  const handleViewResults = (examId: string) => {
    router.push(`/admin/exams/${examId}/results`);
  };

  const handleEdit = (examId: string) => {
    router.push(`/admin/exams/${examId}/edit`);
  };

  const handleDelete = async (examId: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Exam deleted successfully");
        fetchExams();
      } else {
        alert(data.error || "Failed to delete exam");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const toggleExamStatus = async (examId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchExams();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update exam status");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const activeExams = exams.filter((e) => e.isActive).length;
  const totalQuestions = exams.reduce((sum, e) => sum + e.questions.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Examinations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all exams and view student results
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/exams/new")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Exam
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeExams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(exams.map((e) => e.department)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title, course, department, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Exams Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : currentExams.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? "No exams found matching your search"
                  : "No exams found. Create your first exam to get started."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Details</TableHead>
                      <TableHead>Course/Dept</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentExams.map((exam) => (
                      <TableRow key={exam._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {exam.title}
                            </div>
                            {exam.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {exam.description}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Created: {formatDate(exam.createdAt)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {exam.course}
                            </div>
                            <div className="text-xs text-gray-500">
                              {exam.department}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{exam.duration} min</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {exam.questions.length}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {exam.totalPoints} pts
                            </div>
                            <div className="text-xs text-gray-500">
                              Pass: {exam.passingScore}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() =>
                              toggleExamStatus(exam._id, exam.isActive)
                            }
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              exam.isActive
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {exam.isActive ? "Active" : "Inactive"}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(exam._id)}
                              title="Preview Exam (View Questions & Answers)"
                              className="text-purple-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewResults(exam._id)}
                              title="View Student Results & Submissions"
                              className="text-blue-600"
                            >
                              <ClipboardCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(exam._id)}
                              title="Edit Exam"
                              className="text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(exam._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Exam"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredExams.length)} of{" "}
                    {filteredExams.length} exams
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2">...</span>
                            )}
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Exams;
