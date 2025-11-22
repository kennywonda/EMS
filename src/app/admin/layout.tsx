"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminTopNav from "@/components/AdminTopNav";
import Sidebar from "@/components/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Hydrate admin info from localStorage if available
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        setAdminName(parsed.name || "Admin");
        setInstitutionName(parsed.institutionName || "Institution");
      }
    } catch (e) {
      // ignore
    }
  }, [pathname]);

  const handleLogoutAction = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't show sidebar/topnav on login page
  const isLoginPage = pathname === "/admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {!isLoginPage && (
        <>
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userRole="admin"
          />
          <AdminTopNav
            adminName={adminName}
            institutionName={institutionName}
            onLogoutAction={handleLogoutAction}
            roleLabel="Administrator"
            showInstitution={true}
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
