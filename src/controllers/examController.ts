import Exam, { IExam, IQuestion } from "../models/Exam";
import ExamSubmission, { IExamSubmission, IAnswer } from "../models/ExamSubmission";
import Student from "../models/Student";
import connectDB from "../lib/mongodb";

// Create a new exam
export const createExam = async (examData: Partial<IExam>) => {
  try {
    await connectDB();

    // Validate that questions array exists and has items
    if (!examData.questions || examData.questions.length === 0) {
      throw new Error("Exam must have at least one question");
    }

    // Calculate total points from all questions
    const totalPoints = examData.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );

    // Validate passing score
    if (examData.passingScore && examData.passingScore > totalPoints) {
      throw new Error("Passing score cannot be greater than total points");
    }

    // Validate each question
    examData.questions.forEach((question: IQuestion, index: number) => {
      if (question.questionType === "mcq") {
        if (!question.options || !question.correctAnswer) {
          throw new Error(
            `Question ${index + 1}: MCQ questions must have options and correct answer`
          );
        }
      }
    });

    const exam = new Exam({
      ...examData,
      totalPoints,
    });

    await exam.save();
    return { success: true, exam };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get all exams
export const getAllExams = async (filters?: {
  course?: string;
  department?: string;
  isActive?: boolean;
}) => {
  try {
    await connectDB();

    const query: any = {};
    if (filters?.course) query.course = filters.course;
    if (filters?.department) query.department = filters.department;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;

    // Don't populate createdBy to avoid User model registration error
    const exams = await Exam.find(query).sort({ createdAt: -1 });

    return { success: true, exams };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get exam by ID (for students - without correct answers)
export const getExamForStudent = async (examId: string) => {
  try {
    await connectDB();

    const exam = await Exam.findById(examId).lean() as IExam | null;
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Remove correct answers from questions (students shouldn't see them)
    const sanitizedQuestions = exam.questions.map((q: any) => {
      const { correctAnswer, ...rest } = q;
      return rest;
    });

    return {
      success: true,
      exam: { ...exam, questions: sanitizedQuestions },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get exam by ID (for admin/teacher - with correct answers)
export const getExamById = async (examId: string) => {
  try {
    await connectDB();

    // Don't populate createdBy to avoid User model registration error
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    return { success: true, exam };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Submit exam answers (auto-grade MCQs, mark theories as pending)
export const submitExam = async (submissionData: {
  examId: string;
  studentId: string;
  answers: IAnswer[];
  timeSpent?: number;
}) => {
  try {
    await connectDB();

    const { examId, studentId, answers, timeSpent } = submissionData;

    // Get exam with full details
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Get student details
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check how many attempts student has made
    const previousAttempts = await ExamSubmission.countDocuments({
      exam: examId,
      student: studentId,
    });

    if (previousAttempts >= exam.allowedAttempts) {
      throw new Error("Maximum number of attempts reached");
    }

    // Auto-grade MCQ questions and prepare answers
    let totalScore = 0;
    let hasTheoryQuestions = false;

    const gradedAnswers = answers.map((answer) => {
      const question = exam.questions.find(
        (q: IQuestion) => q.questionNumber === answer.questionNumber
      );

      if (!question) {
        throw new Error(`Question ${answer.questionNumber} not found in exam`);
      }

      let isCorrect: boolean | undefined = false;
      let pointsAwarded = 0;

      if (question.questionType === "mcq") {
        // Auto-grade MCQ
        isCorrect = answer.selectedOption === question.correctAnswer;
        pointsAwarded = isCorrect ? question.points : 0;
        totalScore += pointsAwarded;
      } else {
        // Theory question - needs manual grading
        hasTheoryQuestions = true;
        isCorrect = undefined; // Will be determined by teacher
      }

      return {
        ...answer,
        questionType: question.questionType,
        isCorrect,
        pointsAwarded,
      };
    });

    // Calculate percentage
    const percentageScore = (totalScore / exam.totalPoints) * 100;

    // Determine if passed (only if no theory questions, otherwise pending)
    const passed = !hasTheoryQuestions && percentageScore >= exam.passingScore;

    // Determine status
    const status = hasTheoryQuestions ? "submitted" : "graded";

    // Create submission
    const submission = new ExamSubmission({
      exam: examId,
      student: studentId,
      studentName: student.name,
      studentId: student.studentId,
      answers: gradedAnswers,
      totalScore,
      percentageScore,
      passed,
      attemptNumber: previousAttempts + 1,
      status,
      startedAt: new Date(Date.now() - (timeSpent || 0) * 60000),
      submittedAt: new Date(),
      gradedAt: hasTheoryQuestions ? undefined : new Date(),
      timeSpent,
    });

    await submission.save();

    return { success: true, submission };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Grade theory questions (for teachers)
export const gradeTheoryQuestions = async (
  submissionId: string,
  gradedAnswers: { questionNumber: number; pointsAwarded: number; feedback?: string }[],
  gradedBy: string
) => {
  try {
    await connectDB();

    const submission = await ExamSubmission.findById(submissionId).populate("exam");
    if (!submission) {
      throw new Error("Submission not found");
    }

    const exam: any = submission.exam;

    // Update theory question grades
    gradedAnswers.forEach((graded) => {
      const answerIndex = submission.answers.findIndex(
        (a: IAnswer) => a.questionNumber === graded.questionNumber
      );

      if (answerIndex !== -1 && submission.answers[answerIndex].questionType === "theory") {
        submission.answers[answerIndex].pointsAwarded = graded.pointsAwarded;
        submission.answers[answerIndex].feedback = graded.feedback;

        // Get max points for this question
        const question = exam.questions.find(
          (q: IQuestion) => q.questionNumber === graded.questionNumber
        );
        if (question) {
          submission.answers[answerIndex].isCorrect =
            graded.pointsAwarded >= question.points * 0.5; // 50% or more is "correct"
        }
      }
    });

    // Recalculate total score
    submission.totalScore = submission.answers.reduce(
      (sum: number, a: IAnswer) => sum + a.pointsAwarded,
      0
    );

    // Recalculate percentage
    submission.percentageScore = (submission.totalScore / exam.totalPoints) * 100;

    // Determine if passed
    submission.passed = submission.percentageScore >= exam.passingScore;

    // Update status
    submission.status = "graded";
    submission.gradedAt = new Date();
    submission.gradedBy = gradedBy as any;

    await submission.save();

    return { success: true, submission };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get student submissions for an exam
export const getExamSubmissions = async (examId: string) => {
  try {
    await connectDB();

    // Don't populate to avoid User model registration errors
    const submissions = await ExamSubmission.find({ exam: examId })
      .sort({ submittedAt: -1 });

    return { success: true, submissions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get student's submission history
export const getStudentSubmissions = async (studentId: string) => {
  try {
    await connectDB();

    const submissions = await ExamSubmission.find({ student: studentId })
      .populate("exam", "title course department totalPoints passingScore")
      .sort({ submittedAt: -1 });

    return { success: true, submissions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete exam
export const deleteExam = async (examId: string) => {
  try {
    await connectDB();

    // Check if there are any submissions
    const submissionsCount = await ExamSubmission.countDocuments({ exam: examId });
    if (submissionsCount > 0) {
      throw new Error(
        "Cannot delete exam with existing submissions. Consider deactivating it instead."
      );
    }

    await Exam.findByIdAndDelete(examId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update exam
export const updateExam = async (examId: string, updates: Partial<IExam>) => {
  try {
    await connectDB();

    // Check if there are any submissions
    const submissionsCount = await ExamSubmission.countDocuments({ exam: examId });
    if (submissionsCount > 0) {
      throw new Error(
        "Cannot edit exam with existing submissions. Create a new version instead."
      );
    }

    // Recalculate total points if questions are updated
    if (updates.questions) {
      const totalPoints = updates.questions.reduce(
        (sum, q) => sum + (q.points || 0),
        0
      );
      updates.totalPoints = totalPoints;
    }

    const exam = await Exam.findByIdAndUpdate(examId, updates, { new: true });
    if (!exam) {
      throw new Error("Exam not found");
    }

    return { success: true, exam };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Grade a submission (for theory questions)
export const gradeSubmission = async (
  submissionId: string,
  grades: Array<{
    questionNumber: number;
    pointsAwarded: number;
    feedback?: string;
  }>
) => {
  try {
    await connectDB();

    const submission = await ExamSubmission.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    const exam = await Exam.findById(submission.exam);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Validate that points awarded don't exceed question points
    for (const grade of grades) {
      const question = exam.questions.find(
        (q: IQuestion) => q.questionNumber === grade.questionNumber
      );
      if (!question) {
        throw new Error(`Question ${grade.questionNumber} not found`);
      }
      if (grade.pointsAwarded > question.points) {
        throw new Error(
          `Points awarded for question ${grade.questionNumber} (${grade.pointsAwarded}) cannot exceed maximum points (${question.points})`
        );
      }
    }

    // Update the answers with grades
    submission.answers = submission.answers.map((answer: IAnswer) => {
      const grade = grades.find(
        (g) => g.questionNumber === answer.questionNumber
      );

      if (grade && answer.questionType === "theory") {
        return {
          ...answer,
          pointsAwarded: grade.pointsAwarded,
          feedback: grade.feedback || answer.feedback,
          isCorrect: undefined, // Theory questions don't have true/false correct
        };
      }

      return answer;
    });

    // Recalculate total score
    const totalScore = submission.answers.reduce(
      (sum: number, ans: IAnswer) => sum + ans.pointsAwarded,
      0
    );

    // Recalculate percentage
    const percentageScore = (totalScore / exam.totalPoints) * 100;

    // Determine if passed
    const passed = percentageScore >= exam.passingScore;

    // Update submission
    submission.totalScore = totalScore;
    submission.percentageScore = percentageScore;
    submission.passed = passed;
    submission.status = "graded";
    submission.gradedAt = new Date();

    await submission.save();

    return { success: true, submission };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get a single submission by ID
export const getSubmissionById = async (submissionId: string) => {
  try {
    await connectDB();

    const submission = await ExamSubmission.findById(submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    // Fetch the exam details separately
    const exam = await Exam.findById(submission.exam);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Create a combined object with submission and exam details
    const submissionWithExam = {
      ...submission.toObject(),
      exam: exam.toObject(),
    };

    return { success: true, submission: submissionWithExam };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
