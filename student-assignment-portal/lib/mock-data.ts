import { StudentUser, TeacherUser, AdminUser, StudentAssignment, TeacherAssignment, Submission, Notification, Message, Deadline } from './types';

// Mock Student User
export const mockStudentUser: StudentUser = {
  id: 'student-1',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@school.edu',
  role: 'student',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  createdAt: '2024-01-15',
};

// Mock Teacher User
export const mockTeacherUser: TeacherUser = {
  id: 'teacher-1',
  name: 'Dr. Michael Johnson',
  email: 'm.johnson@school.edu',
  role: 'teacher',
  department: 'Computer Science',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  createdAt: '2023-08-01',
};

// Mock Admin User
export const mockAdminUser: AdminUser = {
  id: 'admin-1',
  name: 'Admin Panel',
  email: 'admin@school.edu',
  role: 'admin',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  createdAt: '2023-01-01',
};

// Mock Student Assignments
export const mockStudentAssignments: StudentAssignment[] = [
  {
    id: 'assign-1',
    title: 'assignment 1',
    description: 'Write a comprehensive essay on machine learning fundamentals',
    course: 'English 101',
    dueDate: '2024-10-26 11:59 PM',
    createdBy: 'teacher-1',
    createdByName: 'Dr. Michael Johnson',
    status: 'submitted',
    submittedDate: '2024-10-24 10:30 AM',
    feedback: {
      score: 92,
      comments: 'Excellent work on this assignment! Your analysis was thorough and well-structured.',
      suggestions: [
        'Consider adding more recent studies',
        'Expand the conclusion section',
      ],
      strengths: [
        'Clear writing style',
        'Well-researched content',
        'Strong argumentation',
      ],
      areasForImprovement: [
        'Add more diverse sources',
        'Provide more examples',
      ],
      generatedAt: '2024-10-24 11:00 AM',
      type: 'ai',
    },
  },
  {
    id: 'assign-2',
    title: 'assignment 2',
    description: 'Analyze historical events and their impact',
    course: 'English 101',
    dueDate: '2024-10-20 11:59 PM',
    createdBy: 'teacher-1',
    createdByName: 'Dr. Michael Johnson',
    status: 'graded',
    submittedDate: '2024-10-19 02:15 PM',
    grade: 92,
    feedback: {
      score: 92,
      comments: 'Outstanding analysis! Your insights were particularly valuable.',
      suggestions: [],
      strengths: ['Comprehensive research', 'Clear connections', 'Original perspective'],
      areasForImprovement: [],
      generatedAt: '2024-10-20 09:30 AM',
      type: 'ai',
    },
  },
  {
    id: 'assign-3',
    title: 'assignment',
    description: 'Research paper on cloud computing',
    course: 'English 105',
    dueDate: '2024-10-18 5:00 PM',
    createdBy: 'teacher-1',
    createdByName: 'Dr. Michael Johnson',
    status: 'submitted',
  },
  {
    id: 'assign-4',
    title: 'assignment 4',
    description: 'Group project on renewable energy',
    course: 'English 105',
    dueDate: '2024-10-15 11:59 PM',
    createdBy: 'teacher-1',
    createdByName: 'Dr. Michael Johnson',
    status: 'graded',
    grade: 98,
    feedback: {
      score: 98,
      comments: 'Perfect presentation! Great team coordination.',
      suggestions: [],
      strengths: ['Excellent teamwork', 'Professional presentation', 'Well-researched'],
      areasForImprovement: [],
      generatedAt: '2024-10-16 10:00 AM',
      type: 'ai',
    },
  },
  {
    id: 'assign-5',
    title: 'assignment 5',
    description: 'Coding challenge: Data structures',
    course: 'Computer Science 101',
    dueDate: '2024-11-01 11:59 PM',
    createdBy: 'teacher-1',
    createdByName: 'Dr. Michael Johnson',
    status: 'pending',
  },
];

// Mock Student Stats
export const mockStudentStats = {
  totalAssignments: 42,
  submitted: 38,
  pending: 4,
  averageGrade: 94,
  completionRate: 90,
  thisWeekCount: 3,
  lastMonthGrowth: 2.5,
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    type: 'grade',
    title: 'AI Feedback',
    message: 'AI Feedback is ready for your Industrial Revolution Essay submission.',
    read: false,
    createdAt: '2024-10-24 12:30 PM',
    actionUrl: '/student/feedback',
  },
  {
    id: 'notif-2',
    userId: 'student-1',
    type: 'assignment',
    title: 'New Assignment',
    message: 'A new assignment has been posted in English 102.',
    read: true,
    createdAt: '2024-10-23 09:00 AM',
  },
  {
    id: 'notif-3',
    userId: 'student-1',
    type: 'message',
    title: 'Message from Dr. Johnson',
    message: 'Your assignment submission was excellent. Great work!',
    read: true,
    createdAt: '2024-10-22 02:30 PM',
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    from: 'Dr. Michael Johnson',
    fromId: 'teacher-1',
    to: 'Sarah Jenkins',
    toId: 'student-1',
    subject: 'Great submission!',
    content: 'Your assignment was excellent. The analysis was thorough and well-researched.',
    createdAt: '2024-10-24 11:00 AM',
    read: true,
    type: 'feedback-notification',
  },
  {
    id: 'msg-2',
    from: 'Dr. Michael Johnson',
    fromId: 'teacher-1',
    to: 'Sarah Jenkins',
    toId: 'student-1',
    subject: 'Question about assignment 5',
    content: 'Can you clarify your approach to the data structures problem?',
    createdAt: '2024-10-23 03:45 PM',
    read: false,
    type: 'message',
  },
];

// Mock Upcoming Deadlines
export const mockUpcomingDeadlines: Deadline[] = [
  {
    id: 'deadline-1',
    assignmentId: 'assign-1',
    title: 'assignment 1',
    course: 'English 101',
    dueDate: '2024-10-26 11:59 PM',
    daysUntilDue: 1,
  },
  {
    id: 'deadline-2',
    assignmentId: 'assign-5',
    title: 'Group Project Proposal',
    course: 'English 102',
    dueDate: '2024-10-29 05:00 PM',
    daysUntilDue: 4,
  },
  {
    id: 'deadline-3',
    assignmentId: 'assign-6',
    title: 'Linear Algebra Problem Set',
    course: 'English 103',
    dueDate: '2024-11-02 11:59 PM',
    daysUntilDue: 8,
  },
];

// Mock Teacher Assignments
export const mockTeacherAssignments: TeacherAssignment[] = [
  {
    id: 'teach-assign-1',
    title: 'Essay: Impact of AI',
    description: 'Write an essay on the societal impact of artificial intelligence',
    course: 'Computer Science 101',
    dueDate: '2024-11-10 11:59 PM',
    createdBy: 'teacher-1',
    createdByName: 'Dr. Michael Johnson',
    submissions: [
      {
        id: 'sub-1',
        studentId: 'student-1',
        studentName: 'Sarah Jenkins',
        studentEmail: 'sarah.jenkins@school.edu',
        assignmentId: 'teach-assign-1',
        submittedDate: '2024-11-08 10:30 AM',
        content: 'AI is transforming society in unprecedented ways...',
        aiScore: 88,
        aiFeedback: 'Well-written essay with good structure. Consider adding more recent examples.',
        status: 'submitted',
      },
      {
        id: 'sub-2',
        studentId: 'student-2',
        studentName: 'John Smith',
        studentEmail: 'john.smith@school.edu',
        assignmentId: 'teach-assign-1',
        submittedDate: '2024-11-07 03:15 PM',
        content: 'The emergence of AI technologies...',
        aiScore: 92,
        aiFeedback: 'Excellent analysis and comprehensive coverage.',
        teacherScore: 92,
        status: 'approved',
      },
    ],
  },
];

// Mock Teacher Stats
export const mockTeacherStats = {
  assignmentsCreated: 28,
  studentsManaging: 145,
  pendingSubmissions: 23,
  totalSubmissions: 320,
};

// Mock Students for Teacher
export const mockTeacherStudents = [
  {
    id: 'student-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@school.edu',
    grade: 94,
  },
  {
    id: 'student-2',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    grade: 87,
  },
  {
    id: 'student-3',
    name: 'Emma Davis',
    email: 'emma.davis@school.edu',
    grade: 91,
  },
  {
    id: 'student-4',
    name: 'Michael Chen',
    email: 'michael.chen@school.edu',
    grade: 85,
  },
  {
    id: 'student-5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@school.edu',
    grade: 96,
  },
];

// Mock Admin Stats
export const mockAdminStats = {
  totalStudents: 2450,
  totalTeachers: 125,
  totalAssignments: 5620,
  completionRate: 87,
  averageGradeAcrossPlatform: 86.5,
};

// Mock Admin Users
export const mockAdminUsers = [
  {
    id: 'student-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@school.edu',
    role: 'student' as const,
    joinDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'student-2',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: 'student' as const,
    joinDate: '2024-02-10',
    status: 'active',
  },
  {
    id: 'teacher-1',
    name: 'Dr. Michael Johnson',
    email: 'm.johnson@school.edu',
    role: 'teacher' as const,
    joinDate: '2023-08-01',
    status: 'active',
  },
  {
    id: 'teacher-2',
    name: 'Prof. Emily Brown',
    email: 'e.brown@school.edu',
    role: 'teacher' as const,
    joinDate: '2023-08-15',
    status: 'active',
  },
];
