// User Types
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  department?: string;
  createdAt: string;
}

export interface StudentUser extends User {
  role: 'student';
}

export interface TeacherUser extends User {
  role: 'teacher';
  department: string;
}

export interface AdminUser extends User {
  role: 'admin';
}

// Assignment Types
export type AssignmentStatus = 'pending' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  createdBy: string;
  createdByName: string;
  rubric?: RubricItem[];
}

export interface StudentAssignment extends Assignment {
  status: AssignmentStatus;
  submittedDate?: string;
  grade?: number;
  feedback?: Feedback;
}

export interface TeacherAssignment extends Assignment {
  submissions: Submission[];
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignmentId: string;
  submittedDate: string;
  content: string;
  fileUrl?: string;
  aiScore?: number;
  aiFeedback?: string;
  teacherScore?: number;
  teacherFeedback?: string;
  status: 'submitted' | 'reviewed' | 'approved';
}

export interface RubricItem {
  criteria: string;
  points: number;
  description?: string;
}

export interface Feedback {
  score: number;
  comments: string;
  suggestions: string[];
  strengths: string[];
  areasForImprovement: string[];
  generatedAt: string;
  type: 'ai' | 'teacher';
}

// Stats Types
export interface StudentStats {
  totalAssignments: number;
  submitted: number;
  pending: number;
  averageGrade: number;
  completionRate: number;
  thisWeekCount?: number;
  lastMonthGrowth?: number;
}

export interface TeacherStats {
  assignmentsCreated: number;
  studentsManaging: number;
  pendingSubmissions: number;
  totalSubmissions: number;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalAssignments: number;
  completionRate: number;
  averageGradeAcrossPlatform: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'assignment' | 'grade' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Message Types
export interface Message {
  id: string;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  subject: string;
  content: string;
  createdAt: string;
  read: boolean;
  type: 'message' | 'feedback-notification';
}

// Deadline Types
export interface Deadline {
  id: string;
  assignmentId: string;
  title: string;
  course: string;
  dueDate: string;
  daysUntilDue: number;
}

// Backend API Response DTOs

export interface AuthResponseDto {
  token: string;
  expiresAt: string;
  email: string;
  fullName: string;
  role: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AssignmentDto {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  maxGrade: number;
  createdAt: string;
}

export interface SubmissionDto {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  originalFileName: string;
  status: string;
  submittedAt: string;
}

export interface ReportDto {
  grade: number;
  feedback: string;
  mistakes: MistakeDto[];
  createdAt: string;
}

export interface MistakeDto {
  type: string;
  description: string;
  line: number;
}

export interface StudentDashboardDto {
  totalAssignments: number;
  submittedCount: number;
  pendingCount: number;
  averageGrade: number | null;
}

export interface TeacherSubmissionDto {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  originalFileName: string;
  status: string;
  submittedAt: string;
  grade: number | null;
}

export interface StatsDto {
  totalAssignments: number;
  totalSubmissions: number;
  gradedCount: number;
  pendingCount: number;
  overallAveragePercent: number | null;
  perAssignment: AssignmentStatsDto[];
  gradeDistribution: GradeDistributionDto;
}

export interface AssignmentStatsDto {
  assignmentId: string;
  title: string;
  maxGrade: number;
  submissionCount: number;
  gradedCount: number;
  averagePercent: number | null;
}

export interface GradeDistributionDto {
  below60: number;
  from60To69: number;
  from70To79: number;
  from80To89: number;
  from90To100: number;
}

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AdminStatsDto {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  verifiedTeachers: number;
  totalAssignments: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
  overallAverageGrade: number | null;
}
