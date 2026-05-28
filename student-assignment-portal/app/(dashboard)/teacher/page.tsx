'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StatsDto, AssignmentDto, TeacherSubmissionDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockTeacherStats, mockTeacherAssignments, mockTeacherStudents } from '@/lib/mock-data';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Users, Clock, CheckCircle2, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, assignmentsData] = await Promise.all([
          api.get<StatsDto>('/api/teacher/stats'),
          api.get<AssignmentDto[]>('/api/teacher/assignments'),
        ]);
        setStats(statsData);
        setAssignments(assignmentsData);
      } catch {
        // fallback to mock
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayStats = stats || mockTeacherStats;
  const displayAssignments = assignments.length > 0
    ? assignments.map(a => ({
        id: a.id,
        title: a.title,
        course: '',
        submissions: [] as TeacherSubmissionDto[],
        dueDate: a.dueDate,
      }))
    : mockTeacherAssignments;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
          Welcome back, {user?.name?.split(' ')[1] || user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Manage your assignments and review student submissions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatsCard
          icon={FileText}
          label="Assignments Created"
          value={displayStats.totalAssignments}
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={Users}
          label="Total Students"
          value={mockTeacherStudents.length}
          iconColor="text-green-600"
        />
        <StatsCard
          icon={Clock}
          label="Pending Submissions"
          value={displayStats.pendingCount}
          trend={{
            value: displayStats.pendingCount,
            isPositive: false,
            label: 'need review',
          }}
          iconColor="text-orange-600"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Total Submissions"
          value={displayStats.totalSubmissions}
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Assignments</CardTitle>
                <CardDescription>Active assignments and student submissions</CardDescription>
              </div>
              <Link href="/teacher/assignments/create">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 sm:p-4 border border-border rounded-lg hover:bg-secondary/50 transition"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground">{assignment.title}</h4>
                        {assignment.course && <p className="text-xs sm:text-sm text-muted-foreground">{assignment.course}</p>}
                      </div>
                      <Link href={`/teacher/assignments/${assignment.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Submissions</p>
                        <p className="text-base sm:text-lg font-bold text-foreground">
                          {'submissions' in assignment ? (assignment as unknown as { submissions: unknown[] }).submissions.length : 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pending Review</p>
                        <p className="text-base sm:text-lg font-bold text-orange-600">
                          {'submissions' in assignment
                            ? (assignment as unknown as { submissions: { status: string }[] }).submissions.filter(s => s.status === 'submitted').length
                            : 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Approved</p>
                        <p className="text-base sm:text-lg font-bold text-green-600">
                          {'submissions' in assignment
                            ? (assignment as unknown as { submissions: { status: string }[] }).submissions.filter(s => s.status === 'approved').length
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/teacher/assignments" className="block mt-4">
                <Button variant="ghost" className="w-full" size="sm">
                  View All Assignments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-base sm:text-lg">My Students</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Top performers this semester</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {mockTeacherStudents.slice(0, 5).map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 sm:p-3 rounded-lg border border-border hover:bg-secondary/50 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-foreground truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm text-foreground">{student.grade}%</p>
                      {student.grade >= 90 && (
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                          Excellent
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/teacher/students" className="block mt-4">
                <Button variant="ghost" className="w-full" size="sm">
                  View All Students
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/teacher/assignments/create" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Assignment
                </Button>
              </Link>
              <Link href="/teacher/students" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View All Students
                </Button>
              </Link>
              <Link href="/teacher/grades" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Grades
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
