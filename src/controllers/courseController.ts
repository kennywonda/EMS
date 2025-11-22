import Course, { ICourse } from "../models/Course";
import Teacher from "../models/Teacher";
import Student from "../models/Student";
import connectDB from "../lib/mongodb";

// Create a new course
export const createCourse = async (courseData: Partial<ICourse>) => {
  try {
    await connectDB();

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: courseData.code });
    if (existingCourse) {
      throw new Error("Course code already exists");
    }

    // Validate teacher if provided
    if (courseData.teacher) {
      const teacher = await Teacher.findById(courseData.teacher);
      if (!teacher) {
        throw new Error("Teacher not found");
      }
    }

    const course = new Course(courseData);
    await course.save();

    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get all courses
export const getAllCourses = async (filters?: {
  department?: string;
  semester?: string;
  isActive?: boolean;
  teacher?: string;
}) => {
  try {
    await connectDB();

    const query: any = {};
    if (filters?.department) query.department = filters.department;
    if (filters?.semester) query.semester = filters.semester;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;
    if (filters?.teacher) query.teacher = filters.teacher;

    const courses = await Course.find(query)
      .populate("teacher", "name email phone")
      .sort({ createdAt: -1 });

    return { success: true, courses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get course by ID
export const getCourseById = async (courseId: string) => {
  try {
    await connectDB();

    const course = await Course.findById(courseId)
      .populate("teacher", "name email phone department")
      .populate("students", "name email studentId course");

    if (!course) {
      throw new Error("Course not found");
    }

    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get course by code
export const getCourseByCode = async (code: string) => {
  try {
    await connectDB();

    const course = await Course.findOne({ code: code.toUpperCase() })
      .populate("teacher", "name email phone")
      .populate("students", "name email studentId");

    if (!course) {
      throw new Error("Course not found");
    }

    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update course
export const updateCourse = async (courseId: string, updates: Partial<ICourse>) => {
  try {
    await connectDB();

    // If updating course code, check for duplicates
    if (updates.code) {
      const existingCourse = await Course.findOne({
        code: updates.code,
        _id: { $ne: courseId },
      });
      if (existingCourse) {
        throw new Error("Course code already exists");
      }
    }

    // Validate teacher if provided
    if (updates.teacher) {
      const teacher = await Teacher.findById(updates.teacher);
      if (!teacher) {
        throw new Error("Teacher not found");
      }
    }

    const course = await Course.findByIdAndUpdate(courseId, updates, {
      new: true,
      runValidators: true,
    })
      .populate("teacher", "name email phone")
      .populate("students", "name email studentId");

    if (!course) {
      throw new Error("Course not found");
    }

    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete course
export const deleteCourse = async (courseId: string) => {
  try {
    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Check if course has enrolled students
    if (course.students.length > 0) {
      throw new Error(
        "Cannot delete course with enrolled students. Remove all students first."
      );
    }

    await Course.findByIdAndDelete(courseId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Enroll student in course
export const enrollStudent = async (courseId: string, studentId: string) => {
  try {
    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check if course is full
    if (course.students.length >= course.capacity) {
      throw new Error("Course is full");
    }

    // Check if student is already enrolled
    if (course.students.includes(studentId as any)) {
      throw new Error("Student is already enrolled in this course");
    }

    // Add student to course
    course.students.push(studentId as any);
    await course.save();

    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Remove student from course
export const removeStudent = async (courseId: string, studentId: string) => {
  try {
    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Check if student is enrolled
    if (!course.students.includes(studentId as any)) {
      throw new Error("Student is not enrolled in this course");
    }

    // Remove student from course
    course.students = course.students.filter(
      (id: any) => id.toString() !== studentId
    );
    await course.save();

    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get courses by teacher
export const getCoursesByTeacher = async (teacherId: string) => {
  try {
    await connectDB();

    const courses = await Course.find({ teacher: teacherId })
      .populate("students", "name email studentId")
      .sort({ semester: -1 });

    return { success: true, courses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get courses by student (where student is enrolled)
export const getCoursesByStudent = async (studentId: string) => {
  try {
    await connectDB();

    const courses = await Course.find({ students: studentId })
      .populate("teacher", "name email phone")
      .sort({ semester: -1 });

    return { success: true, courses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get course statistics
export const getCourseStats = async () => {
  try {
    await connectDB();

    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ isActive: true });
    
    const courses = await Course.find();
    const totalEnrollments = courses.reduce(
      (sum, course) => sum + course.students.length,
      0
    );
    const averageEnrollment =
      totalCourses > 0 ? totalEnrollments / totalCourses : 0;

    const departments = await Course.distinct("department");

    return {
      success: true,
      stats: {
        totalCourses,
        activeCourses,
        totalEnrollments,
        averageEnrollment: Math.round(averageEnrollment),
        departments: departments.length,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
