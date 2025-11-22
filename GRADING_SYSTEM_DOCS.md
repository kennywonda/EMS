# Teacher Grading System - Documentation

## Overview
This grading system allows teachers to manually grade theory questions in student exam submissions while MCQ questions are auto-graded.

## Pages Created

### 1. `/teacher/exams` - Exams List
- **Location**: `src/app/teacher/exams/page.tsx`
- **Purpose**: Shows all active exams with search functionality
- **Features**:
  - Search exams by title, course, or department
  - View exam details (duration, questions, points)
  - "Grade Submissions" button for each exam

### 2. `/teacher/exams/[id]/grade` - Submissions List
- **Location**: `src/app/teacher/exams/[id]/grade/page.tsx`
- **Purpose**: Shows all submissions for a specific exam
- **Features**:
  - View statistics (total, pending, graded)
  - Filter submissions by status (all, submitted, graded)
  - Student information and scores
  - "Has Theory Questions" indicator
  - Pass/Fail status
  - Grade/Review button for each submission

### 3. `/teacher/exams/[id]/submissions/[submissionId]` - Grade Individual Submission
- **Location**: `src/app/teacher/exams/[id]/submissions/[submissionId]/page.tsx`
- **Purpose**: Detailed grading interface for a single submission
- **Features**:
  - **MCQ Questions Section** (Read-only, Auto-graded):
    - Shows student's answer vs correct answer
    - Green border for correct, red for incorrect
    - Points awarded automatically
  - **Theory Questions Section** (Manual Grading):
    - View student's text answer
    - Input points awarded (0 to max points)
    - Add optional feedback for each question
    - Validation prevents exceeding max points
  - **Save Grades**:
    - Recalculates total score
    - Updates pass/fail status
    - Sets submission status to "graded"
    - Records graded timestamp

## API Endpoints Created

### 1. `GET /api/exams/submissions/[submissionId]`
- **Location**: `src/app/api/exams/submissions/[submissionId]/route.ts`
- **Purpose**: Fetch a single submission with exam details
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "student": {...},
      "exam": {...},
      "answers": [...],
      "totalScore": 85,
      "status": "submitted"
    }
  }
  ```

### 2. `PUT /api/exams/submissions/[submissionId]/grade`
- **Location**: `src/app/api/exams/submissions/[submissionId]/grade/route.ts`
- **Purpose**: Save teacher's grades for theory questions
- **Request Body**:
  ```json
  {
    "grades": [
      {
        "questionNumber": 5,
        "pointsAwarded": 8,
        "feedback": "Good explanation but missing key points..."
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "totalScore": 93,
      "percentageScore": 93.0,
      "passed": true,
      "status": "graded",
      "gradedAt": "2025-10-19T..."
    }
  }
  ```

## Controller Functions Added

### `gradeSubmission(submissionId, grades)` 
- **Location**: `src/controllers/examController.ts`
- **Purpose**: Update submission with teacher grades
- **Logic**:
  1. Validate points don't exceed question max
  2. Update theory question answers with points and feedback
  3. Recalculate total score (MCQ + theory)
  4. Recalculate percentage score
  5. Update pass/fail status based on passing score
  6. Set status to "graded"
  7. Record `gradedAt` timestamp

### `getSubmissionById(submissionId)`
- **Location**: `src/controllers/examController.ts`
- **Purpose**: Fetch submission with full exam details
- **Returns**: Submission object with nested exam data

## How to Test

### Step 1: Student Takes Exam
1. Login as a student
2. Go to "Available Exams"
3. Take an exam that has theory questions
4. Submit the exam

### Step 2: Teacher Grades Submission
1. Login as a teacher
2. Click "Grade Exams" on dashboard (or go to `/teacher/exams`)
3. Find the exam and click "Grade Submissions"
4. Filter by "Pending" to see ungraded submissions
5. Click "Grade Now" on a submission
6. **Review MCQ Questions** (Auto-graded, read-only)
7. **Grade Theory Questions**:
   - Read student's answer
   - Enter points (0 to max)
   - Add feedback (optional)
8. Click "Save Grades"

### Step 3: Student Views Updated Results
1. Student logs back in
2. Goes to exam results page
3. Now sees:
   - Updated total score
   - Theory question points
   - Teacher feedback
   - Updated pass/fail status

## Key Features

### Auto-Grading (MCQ)
- MCQ questions are automatically graded during submission
- Correct answer comparison happens server-side
- Points awarded immediately

### Manual Grading (Theory)
- Theory questions require teacher review
- Status remains "submitted" until graded
- Teacher can award partial credit
- Optional feedback helps students learn

### Score Recalculation
- Total score = MCQ points + Theory points
- Percentage = (Total Score / Total Points) × 100
- Pass/Fail = Percentage >= Passing Score

### Status Workflow
1. **in-progress**: Student started but hasn't submitted
2. **submitted**: Submitted but has theory questions needing grading
3. **graded**: All questions graded (MCQ auto + theory manual)

## UI Color Coding

### Submission Status
- 🟢 **Green**: Graded
- 🟡 **Yellow**: Pending Review (Submitted)
- 🔵 **Blue**: In Progress

### Questions
- 🟦 **Blue Badge**: MCQ Question
- 🟪 **Purple Badge**: Theory Question
- 🟩 **Green Border**: Correct Answer
- 🟥 **Red Border**: Incorrect Answer

## Integration Points

### Teacher Dashboard
- Added "Grade Exams" button linking to `/teacher/exams`

### Student Results Page
- Already displays teacher feedback
- Already shows theory question grades
- Works seamlessly with grading system

## Database Changes
No schema changes needed! The existing `ExamSubmission` model already supports:
- `answers[].pointsAwarded`
- `answers[].feedback`
- `status` field
- `gradedAt` timestamp

## Notes
- Teachers can re-grade submissions (Grade button becomes "Review")
- Points validation prevents giving more than max points
- Feedback is optional but recommended
- Auto-redirect after saving grades (2 seconds)
- Extensive console logging for debugging
