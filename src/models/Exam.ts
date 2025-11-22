import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  questionNumber: number;
  questionText: string;
  questionType: "mcq" | "theory"; // MCQ or Theory
  points: number; // Points for this question
  // MCQ specific fields
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer?: "a" | "b" | "c" | "d"; // Only for MCQ
}

export interface IExam extends Document {
  title: string;
  description?: string;
  course: string;
  department: string;
  duration: number; // in minutes
  totalPoints: number;
  passingScore: number;
  instructions?: string;
  questions: IQuestion[];
  isActive: boolean; // Whether students can take this exam
  startDate?: Date; // When exam becomes available
  endDate?: Date; // When exam closes
  allowedAttempts: number; // Number of times a student can take the exam
  createdBy: mongoose.Types.ObjectId; // Reference to admin/teacher who created it
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionNumber: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  questionType: {
    type: String,
    enum: ["mcq", "theory"],
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
  },
  // MCQ specific fields - only required if questionType is 'mcq'
  options: {
    type: {
      a: { type: String, trim: true },
      b: { type: String, trim: true },
      c: { type: String, trim: true },
      d: { type: String, trim: true },
    },
    required: function (this: IQuestion) {
      return this.questionType === "mcq";
    },
  },
  correctAnswer: {
    type: String,
    enum: ["a", "b", "c", "d"],
    required: function (this: IQuestion) {
      return this.questionType === "mcq";
    },
  },
});

const ExamSchema = new Schema<IExam>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // At least 1 minute
    },
    totalPoints: {
      type: Number,
      required: true,
      min: 0,
    },
    passingScore: {
      type: Number,
      required: true,
      min: 0,
    },
    instructions: {
      type: String,
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
      validate: {
        validator: function (questions: IQuestion[]) {
          return questions.length > 0;
        },
        message: "Exam must have at least one question",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    allowedAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
ExamSchema.index({ course: 1, department: 1 });
ExamSchema.index({ isActive: 1 });

export default mongoose.models.Exam ||
  mongoose.model<IExam>("Exam", ExamSchema);
