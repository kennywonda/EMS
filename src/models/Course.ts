import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  code: string; // Unique course code (e.g., CS101)
  description?: string;
  department: string;
  credits: number;
  semester: string; // e.g., "Fall 2025", "Spring 2026"
  teacher?: mongoose.Types.ObjectId; // Reference to Teacher
  students: mongoose.Types.ObjectId[]; // Array of Student references
  capacity: number; // Maximum number of students
  isActive: boolean;
  schedule?: string; // e.g., "Mon/Wed 10:00-11:30"
  room?: string; // e.g., "Building A, Room 101"
  syllabus?: string; // Course syllabus/outline
  prerequisites?: string[]; // Array of prerequisite course codes
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    schedule: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    syllabus: {
      type: String,
      trim: true,
    },
    prerequisites: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
CourseSchema.index({ code: 1 });
CourseSchema.index({ department: 1 });
CourseSchema.index({ teacher: 1 });
CourseSchema.index({ semester: 1 });
CourseSchema.index({ isActive: 1 });

// Virtual for enrollment count
CourseSchema.virtual("enrollmentCount").get(function () {
  return this.students.length;
});

// Virtual for available seats
CourseSchema.virtual("availableSeats").get(function () {
  return this.capacity - this.students.length;
});

// Virtual for is full
CourseSchema.virtual("isFull").get(function () {
  return this.students.length >= this.capacity;
});

// Ensure virtuals are included in JSON
CourseSchema.set("toJSON", { virtuals: true });
CourseSchema.set("toObject", { virtuals: true });

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
