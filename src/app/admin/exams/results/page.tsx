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
  Eye,
  FileText,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Award,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExamResult {
  examId: string;
  examTitle: string;
  course: string;
  department: string;
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
  totalPoints: number;
}

const AllExamResults = () => {
  const router = useRouter();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    // Filter results based on search query
    if (searchQuery.trim() === "") {
      setFilteredResults(results);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = results.filter(
        (result) =>
          result.examTitle.toLowerCase().includes(query) ||
          result.course.toLowerCase().includes(query) ||
          result.department.toLowerCase().includes(query)
      );
      setFilteredResults(filtered);
    }
  }, [searchQuery, results]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all exams
      const examsResponse = await fetch("/api/exams");
      const examsData = await examsResponse.json();

      if (!examsResponse.ok) {
        throw new Error(examsData.error || "Failed to fetch exams");
      }

      // For each exam, fetch submissions and calculate stats
      const resultsPromises = examsData.exams.map(async (exam: any) => {
        try {
          const submissionsResponse = await fetch(
            `/api/exams/${exam._id}/submissions`
          );
          const submissionsData = await submissionsResponse.json();

          if (submissionsResponse.ok) {
            const submissions = submissionsData.submissions || [];
            const gradedSubmissions = submissions.filter(
              (s: any) => s.status === "graded"
            );

            const totalSubmissions = gradedSubmissions.length;
            const averageScore =
              totalSubmissions > 0
                ? gradedSubmissions.reduce(
                    (sum: number, s: any) => sum + s.percentageScore,
                    0
                  ) / totalSubmissions
                : 0;
            const passedCount = gradedSubmissions.filter(
              (s: any) => s.passed
            ).length;
            const passRate =
              totalSubmissions > 0 ? (passedCount / totalSubmissions) * 100 : 0;

            return {
              examId: exam._id,
              examTitle: exam.title,
              course: exam.course,
              department: exam.department,
              totalSubmissions,
              averageScore,
              passRate,
              totalPoints: exam.totalPoints,
            };
          }
          return null;
        } catch (err) {
          console.error(
            `Error fetching submissions for exam ${exam._id}:`,
            err
          );
          return null;
        }
      });

      const resultsData = await Promise.all(resultsPromises);
      const validResults = resultsData.filter(
        (r) => r !== null
      ) as ExamResult[];

      setResults(validResults);
      setFilteredResults(validResults);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleViewExamResults = (examId: string) => {
    router.push(`/admin/exams/${examId}/results`);
  };

  const totalSubmissions = results.reduce(
    (sum, r) => sum + r.totalSubmissions,
    0
  );
  const overallAverageScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.averageScore, 0) / results.length
      : 0;
  const overallPassRate =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.passRate, 0) / results.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Exam Results Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View results and statistics for all exams
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallAverageScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallPassRate.toFixed(1)}%
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
              placeholder="Search by exam title, course, or department..."
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

      {/* Results Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? "No results found matching your search"
                  : "No exam results available yet"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Details</TableHead>
                    <TableHead>Course/Dept</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.examId}>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {result.examTitle}
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Points: {result.totalPoints}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {result.course}
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.department}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {result.totalSubmissions}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-gray-400" />
                          <span
                            className={`text-sm font-medium ${
                              result.averageScore >= 70
                                ? "text-green-600"
                                : result.averageScore >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.averageScore.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {result.passRate >= 70 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : result.passRate >= 50 ? (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              result.passRate >= 70
                                ? "text-green-600"
                                : result.passRate >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.passRate.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewExamResults(result.examId)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
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

export default AllExamResults;
