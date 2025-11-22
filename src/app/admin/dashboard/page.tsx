"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  LogOut,
  Settings,
  Bell,
  Search,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminTopNav from "@/components/AdminTopNav";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [adminName, setAdminName] = useState("");
  const [institutionName, setInstitutionName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    console.log("🔷 [DASHBOARD] Checking authentication...");
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      console.log(
        "❌ [DASHBOARD] No authentication found, redirecting to login"
      );
      router.push("/admin");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log("✅ [DASHBOARD] User authenticated:", parsedUser);
      setUser(parsedUser);
      setAdminName(parsedUser.name || "Admin");
      setInstitutionName(parsedUser.institutionName || "Institution");
      setIsLoading(false);
    } catch (error) {
      console.error("❌ [DASHBOARD] Error parsing user data:", error);
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    console.log("🔷 [DASHBOARD] Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin");
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Loading Dashboard...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  // Sample data for charts
  const examTrendsData = [
    { month: "Jan", exams: 12, students: 450 },
    { month: "Feb", exams: 120, students: 520 },
    { month: "Mar", exams: 18, students: 600 },
    { month: "Apr", exams: 58, students: 680 },
    { month: "May", exams: 72, students: 750 },
    { month: "Jun", exams: 22, students: 720 },
  ];

  const performanceData = [
    { grade: "A", students: 120, color: "#10b981" },
    { grade: "B", students: 200, color: "#3b82f6" },
    { grade: "C", students: 150, color: "#f59e0b" },
    { grade: "D", students: 80, color: "#ef4444" },
    { grade: "F", students: 30, color: "#dc2626" },
  ];

  const upcomingExams = [
    {
      id: 1,
      title: "Mathematics Final",
      date: "Oct 20, 2025",
      students: 150,
      status: "Scheduled",
    },
    {
      id: 2,
      title: "Physics Midterm",
      date: "Oct 22, 2025",
      students: 120,
      status: "Scheduled",
    },
    {
      id: 3,
      title: "Chemistry Quiz",
      date: "Oct 25, 2025",
      students: 180,
      status: "Scheduled",
    },
    {
      id: 4,
      title: "Biology Test",
      date: "Oct 28, 2025",
      students: 140,
      status: "Scheduled",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New exam created",
      user: "Prof. Smith",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "50 students enrolled",
      user: "Admin",
      time: "3 hours ago",
    },
    {
      id: 3,
      action: "Results published",
      user: "Prof. Johnson",
      time: "5 hours ago",
    },
    {
      id: 4,
      action: "Question bank updated",
      user: "Prof. Williams",
      time: "1 day ago",
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">
              Total Students
            </CardTitle>
            <Users className="h-5 w-5 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,847</div>
            <p className="text-xs text-blue-100 mt-2">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-100">
              Active Exams
            </CardTitle>
            <FileText className="h-5 w-5 text-green-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48</div>
            <p className="text-xs text-green-100 mt-2">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">
              Pending Reviews
            </CardTitle>
            <Clock className="h-5 w-5 text-purple-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
            <p className="text-xs text-purple-100 mt-2">
              <AlertCircle className="inline h-3 w-3 mr-1" />
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">
              Completed
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-orange-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-xs text-orange-100 mt-2">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Exam Trends Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Exam & Student Trends</span>
            </CardTitle>
            <CardDescription>
              Monthly overview of exams and student participation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={examTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="exams"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Exams"
                  dot={{ fill: "#3b82f6", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Students"
                  dot={{ fill: "#10b981", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span>Performance Distribution</span>
            </CardTitle>
            <CardDescription>
              Student grade distribution across all exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="grade" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="students" name="Students" radius={[8, 8, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span>Upcoming Exams</span>
            </CardTitle>
            <CardDescription>
              Scheduled examinations for the next week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {exam.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exam.students} students enrolled
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {exam.date}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {exam.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              View All Exams
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-5">
        <Button
          className="h-20 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
          onClick={() => router.push("/admin/teachers/new")}
        >
          <FileText className="mr-2 h-5 w-5" />
          Manage Teacher
        </Button>
        <Button className="h-20 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
          <Users className="mr-2 h-5 w-5" />
          Manage Students
        </Button>
        <Button className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
          <FileText className="mr-2 h-5 w-5" />
          Create New Exam
        </Button>
        <Button className="h-20 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold">
          <Award className="mr-2 h-5 w-5" />
          View Results
        </Button>
        <Button className="h-20 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold">
          <Calendar className="mr-2 h-5 w-5" />
          Schedule Exam
        </Button>
      </div>
    </div>
  );
}
