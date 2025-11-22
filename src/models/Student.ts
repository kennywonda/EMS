import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IStudent extends Document {
  name: string;
  email: string;
  studentId: string;
  phone: string;
  password: string;
  course?: string;
  department?: string;
  yearOfStudy?: number;
  address?: string;
  dateOfBirth?: Date;
  enrolledAt?: Date;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const StudentSchema: Schema<IStudent> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    course: { type: String },
    department: { type: String },
    yearOfStudy: { type: Number, min: 1, max: 10 },
    address: { type: String },
    dateOfBirth: { type: Date },
    enrolledAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// TEMPORARILY DISABLED: Hash password before saving
// StudentSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error: any) {
//     next(error);
//   }
// });

// Method to compare passwords
StudentSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    console.log("🔐 [MODEL] comparePassword called");
    console.log("🔐 [MODEL] Candidate password:", candidatePassword);
    console.log("🔐 [MODEL] Stored hash:", this.password.substring(0, 20) + "...");
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log("🔐 [MODEL] Comparison result:", result);
    return result;
  } catch (error) {
    console.error("❌ [MODEL] Error in comparePassword:", error);
    return false;
  }
};

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;
