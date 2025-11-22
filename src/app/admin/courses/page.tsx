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
  BookOpen,
  Loader2,
  Users,
  GraduationCap,
  Building,
  Award,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Course {
  _id: string;
  name: string;
  code: string;
  description?: string;
  department: string;
  credits: number;
  semester: string;
  teacher?: {
    _id: string;
    name: string;
    email: string;
  };
  students: any[];
  capacity: number;
  isActive: boolean;
  schedule?: string;
  room?: string;
  createdAt: string;
}

const Courses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search query
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.department.toLowerCase().includes(query) ||
          course.semester.toLowerCase().includes(query) ||
          course.teacher?.name.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/courses");
      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses);
        setFilteredCourses(data.courses);
      } else {
        setError(data.error || "Failed to fetch courses");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handleView = (courseId: string) => {
    router.push(`/admin/courses/${courseId}`);
  };

  const handleEdit = (courseId: string) => {
    router.push(`/admin/courses/${courseId}/edit`);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Course deleted successfully");
        fetchCourses();
      } else {
        alert(data.error || "Failed to delete course");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const toggleCourseStatus = async (
    courseId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchCourses();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update course status");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const activeCourses = courses.filter((c) => c.isActive).length;
  const totalEnrollments = courses.reduce(
    (sum, c) => sum + c.students.length,
    0
  );
  const departments = new Set(courses.map((c) => c.department)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all academic courses
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/courses/new")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments}</div>
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
              placeholder="Search by name, code, department, semester, or teacher..."
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

      {/* Courses Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : currentCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? "No courses found matching your search"
                  : "No courses found. Add your first course to get started."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Details</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCourses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {course.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {course.code} • {course.semester}
                            </div>
                            {course.schedule && (
                              <div className="text-xs text-gray-400">
                                {course.schedule}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{course.department}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {course.teacher ? (
                            <div>
                              <div className="text-sm font-medium">
                                {course.teacher.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {course.teacher.email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Not assigned
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">
                                {course.students.length} / {course.capacity}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  course.students.length >= course.capacity
                                    ? "bg-red-600"
                                    : course.students.length >=
                                      course.capacity * 0.8
                                    ? "bg-yellow-600"
                                    : "bg-green-600"
                                }`}
                                style={{
                                  width: `${
                                    (course.students.length / course.capacity) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{course.credits}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() =>
                              toggleCourseStatus(course._id, course.isActive)
                            }
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              course.isActive
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {course.isActive ? "Active" : "Inactive"}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(course._id)}
                              title="View Course Details"
                              className="text-purple-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(course._id)}
                              title="Edit Course"
                              className="text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(course._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Course"
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
                    {Math.min(endIndex, filteredCourses.length)} of{" "}
                    {filteredCourses.length} courses
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

export default Courses;
