import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  password: string;
  email: string;
  phone: string;
  subject?: string;
  department?: string;
  employeeId: string;
  address?: string;
  joinedAt?: Date;
}

const TeacherSchema: Schema<ITeacher> = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    subject: { type: String },
    department: { type: String },
    employeeId: { type: String, required: true, unique: true },
    address: { type: String },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Teacher: Model<ITeacher> = mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;
