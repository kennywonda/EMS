"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminTopNav from "../../components/AdminTopNav";
import Sidebar from "../../components/SideBar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [teacherName, setTeacherName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Hydrate teacher info from localStorage if available
    try {
      const teacherData = localStorage.getItem("ems_teacher");
      if (teacherData) {
        const parsed = JSON.parse(teacherData);
        setTeacherName(parsed.name || "Teacher");
      } else {
        // If not logged in as teacher, redirect to teacher login
        router.push("/teacher/login");
      }
      // Optionally get institution name from general user if present
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setInstitutionName(parsedUser.institutionName || "Institution");
      }
    } catch (e) {
      // ignore
    }
  }, [pathname, router]);

  const handleLogoutAction = () => {
    localStorage.removeItem("ems_teacher");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/teacher/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't show sidebar/topnav on login page
  const isLoginPage = pathname === "/teacher/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {!isLoginPage && (
        <>
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userRole="teacher"
          />
          <AdminTopNav
            adminName={teacherName}
            institutionName={institutionName}
            onLogoutAction={handleLogoutAction}
            roleLabel="Teacher"
            showInstitution={!!institutionName}
            onMenuClick={toggleSidebar}
          />
        </>
      )}
      <div className={isLoginPage ? "" : "lg:ml-72"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
