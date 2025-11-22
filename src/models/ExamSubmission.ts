import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer {
  questionNumber: number;
  questionType: "mcq" | "theory";
  // For MCQ questions
  selectedOption?: "a" | "b" | "c" | "d";
  // For theory questions
  textAnswer?: string;
  // Grading
  isCorrect?: boolean; // Auto-graded for MCQ, manual for theory
  pointsAwarded: number;
  feedback?: string; // Optional feedback from teacher
}

export interface IExamSubmission extends Document {
  exam: mongoose.Types.ObjectId; // Reference to Exam
  student: mongoose.Types.ObjectId; // Reference to Student
  studentName: string; // Denormalized for easy access
  studentId: string; // Student ID number
  answers: IAnswer[];
  totalScore: number;
  percentageScore: number;
  passed: boolean;
  attemptNumber: number; // Which attempt this is (1, 2, 3, etc.)
  status: "in-progress" | "submitted" | "graded"; // Submission status
  startedAt: Date; // When student started the exam
  submittedAt?: Date; // When student submitted the exam
  gradedAt?: Date; // When teacher finished grading
  gradedBy?: mongoose.Types.ObjectId; // Reference to teacher who graded
  timeSpent?: number; // Time spent in minutes
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  questionNumber: {
    type: Number,
    required: true,
  },
  questionType: {
    type: String,
    enum: ["mcq", "theory"],
    required: true,
  },
  selectedOption: {
    type: String,
    enum: ["a", "b", "c", "d"],
    required: function (this: IAnswer) {
      return this.questionType === "mcq";
    },
  },
  textAnswer: {
    type: String,
    trim: true,
    required: function (this: IAnswer) {
      return this.questionType === "theory";
    },
  },
  isCorrect: {
    type: Boolean,
  },
  pointsAwarded: {
    type: Number,
    default: 0,
    min: 0,
  },
  feedback: {
    type: String,
    trim: true,
  },
});

const ExamSubmissionSchema = new Schema<IExamSubmission>(
  {
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    answers: {
      type: [AnswerSchema],
      required: true,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    percentageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["in-progress", "submitted", "graded"],
      default: "in-progress",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    timeSpent: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
ExamSubmissionSchema.index({ exam: 1, student: 1 });
ExamSubmissionSchema.index({ student: 1 });
ExamSubmissionSchema.index({ status: 1 });

// Compound index to prevent duplicate submissions for same attempt
ExamSubmissionSchema.index({ exam: 1, student: 1, attemptNumber: 1 }, { unique: true });

export default mongoose.models.ExamSubmission ||
  mongoose.model<IExamSubmission>("ExamSubmission", ExamSubmissionSchema);
