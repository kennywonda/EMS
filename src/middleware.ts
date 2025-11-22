import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define protected routes
  const isAdminPath = path.startsWith('/admin') && path !== '/admin' // Allow /admin login page
  const isTeacherPath = path.startsWith('/teacher') && !path.startsWith('/teacher/login')
  const isStudentPath = path.startsWith('/student') && !path.startsWith('/student/login') && !path.startsWith('/student/register')

  // Check for auth tokens in cookies or headers
  const adminToken = request.cookies.get('admin_token')?.value
  const teacherToken = request.cookies.get('teacher_token')?.value
  const studentToken = request.cookies.get('student_token')?.value

  // Redirect to login if accessing protected routes without auth
  if (isAdminPath && !adminToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (isTeacherPath && !teacherToken) {
    return NextResponse.redirect(new URL('/teacher/login', request.url))
  }

  if (isStudentPath && !studentToken) {
    return NextResponse.redirect(new URL('/student/login', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
