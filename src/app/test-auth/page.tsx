"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  UserPlus,
} from "lucide-react";

export default function TestAuthPage() {
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);

  const [resetLoading, setResetLoading] = useState(false);
  const [resetResult, setResetResult] = useState<any>(null);

  const [registerForm, setRegisterForm] = useState({
    name: "Test Student",
    email: "test@student.com",
    studentId: "STU001",
    phone: "1234567890",
    password: "password123",
    department: "Computer Science",
    course: "CS101",
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerResult, setRegisterResult] = useState<any>(null);

  const [loginForm, setLoginForm] = useState({
    email: "test@student.com",
    password: "password123",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginResult, setLoginResult] = useState<any>(null);

  const handleCheck = async () => {
    setCheckLoading(true);
    setCheckResult(null);

    try {
      const response = await fetch("/api/students/check");
      const data = await response.json();

      if (response.ok) {
        setCheckResult({ success: true, data });
      } else {
        setCheckResult({ success: false, error: data.error });
      }
    } catch (error: any) {
      setCheckResult({ success: false, error: error.message });
    } finally {
      setCheckLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to delete ALL students?")) {
      return;
    }

    setResetLoading(true);
    setResetResult(null);

    try {
      const response = await fetch("/api/students/reset", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setResetResult({ success: true, data });
      } else {
        setResetResult({ success: false, error: data.error });
      }
    } catch (error: any) {
      setResetResult({ success: false, error: error.message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterLoading(true);
    setRegisterResult(null);

    try {
      const response = await fetch("/api/auth/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterResult({ success: true, data });
        // Update login form with registration details
        setLoginForm({
          email: registerForm.email,
          password: registerForm.password,
        });
      } else {
        setRegisterResult({ success: false, error: data.error });
      }
    } catch (error: any) {
      setRegisterResult({ success: false, error: error.message });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoginLoading(true);
    setLoginResult(null);

    try {
      const response = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginResult({ success: true, data });
      } else {
        setLoginResult({ success: false, error: data.error });
      }
    } catch (error: any) {
      setLoginResult({ success: false, error: error.message });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Student Authentication Test
        </h1>

        {/* Step 0: Check Database */}
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/10">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-200">
              Step 0: Check Database (Debug)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Check what students are currently in the database and their
              isActive status
            </p>

            <Button onClick={handleCheck} disabled={checkLoading}>
              {checkLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Database"
              )}
            </Button>

            {checkResult && (
              <Alert
                className={
                  checkResult.success
                    ? "bg-purple-100 border-purple-300"
                    : "bg-red-50 border-red-200"
                }
              >
                {checkResult.success ? (
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription>
                  {checkResult.success ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-purple-900">
                        📊 Found {checkResult.data.count} students in database
                      </p>
                      {checkResult.data.students.map(
                        (student: any, index: number) => (
                          <div
                            key={index}
                            className="text-sm text-purple-800 border-l-2 border-purple-400 pl-2 mt-2"
                          >
                            <p>
                              <strong>Email:</strong> {student.email}
                            </p>
                            <p>
                              <strong>Name:</strong> {student.name}
                            </p>
                            <p>
                              <strong>isActive:</strong>{" "}
                              {String(student.isActive)} (type:{" "}
                              {student.isActiveType})
                            </p>
                            <p className="text-xs">
                              <strong>Created:</strong>{" "}
                              {new Date(student.createdAt).toLocaleString()}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-red-900">
                      ❌ Error: {checkResult.error}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 1: Reset Database */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-200">
              Step 1: Reset Database (Delete All Students)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              ⚠️ This will delete ALL students from the database. Do this first
              to remove students with plain text passwords.
            </p>

            <Button
              onClick={handleReset}
              disabled={resetLoading}
              variant="destructive"
            >
              {resetLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Students
                </>
              )}
            </Button>

            {resetResult && (
              <Alert
                className={
                  resetResult.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }
              >
                {resetResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription>
                  {resetResult.success ? (
                    <p className="text-green-900">
                      ✅ Deleted {resetResult.data.deletedCount} students
                    </p>
                  ) : (
                    <p className="text-red-900">
                      ❌ Error: {resetResult.error}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Register New Student */}
        <Card>
          <CardHeader>
            <CardTitle>
              Step 2: Register New Student (With Proper Hashing)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a new student account with properly hashed password
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input
                  value={registerForm.studentId}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      studentId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={registerForm.department}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      department: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button onClick={handleRegister} disabled={registerLoading}>
              {registerLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register Student
                </>
              )}
            </Button>

            {registerResult && (
              <Alert
                className={
                  registerResult.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }
              >
                {registerResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription>
                  {registerResult.success ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-green-900">
                        ✅ Student Registered Successfully!
                      </p>
                      <p className="text-sm text-green-800">
                        Name: {registerResult.data.student.name}
                      </p>
                      <p className="text-sm text-green-800">
                        Email: {registerResult.data.student.email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-900">
                      ❌ Error: {registerResult.error}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Test Login */}
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Test Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test if the registered student can login successfully
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
              </div>
            </div>

            <Button onClick={handleTestLogin} disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Login"
              )}
            </Button>

            {loginResult && (
              <Alert
                className={
                  loginResult.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }
              >
                {loginResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription>
                  {loginResult.success ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-green-900">
                        ✅ Login Successful!
                      </p>
                      <p className="text-sm text-green-800">
                        Student: {loginResult.data.student.name}
                      </p>
                      <p className="text-sm text-green-800">
                        Email: {loginResult.data.student.email}
                      </p>
                      <p className="text-xs text-green-700">
                        Token: {loginResult.data.token.substring(0, 30)}...
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-900">
                      ❌ Error: {loginResult.error}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Instructions:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
              <li>
                Click "Delete All Students" to remove old students with plain
                text passwords
              </li>
              <li>
                Click "Register Student" to create a new student with properly
                hashed password
              </li>
              <li>
                Check that registration shows "✅ Student Registered
                Successfully!"
              </li>
              <li>Click "Test Login" to verify login works</li>
              <li>
                If successful, try logging in at /student/login with the same
                credentials
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Check Console */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              Check Server Terminal:
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Check your terminal (where Next.js is running) for detailed logs
              about password hashing:
            </p>
            <ul className="list-disc list-inside text-xs text-yellow-700 dark:text-yellow-400 mt-2 space-y-1">
              <li>🔐 [REGISTER] Hashing password...</li>
              <li>✅ [REGISTER] Password hashed: $2a$10$...</li>
              <li>✅ [REGISTER] Student created: [id]</li>
              <li>🔐 [LOGIN] Comparing password...</li>
              <li>🔐 [LOGIN] Password valid: true</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
