import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMS - Examination Management System",
  description:
    "Online examination platform for schools and colleges. Conduct secure, efficient exams and tests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} EMS - Examination Management
              System. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
