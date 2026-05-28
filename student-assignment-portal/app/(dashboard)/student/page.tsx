'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StudentDashboardDto, AssignmentDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockStudentAssignments, mockUpcomingDeadlines, mockNotifications } from '@/lib/mock-data';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, Clock, TrendingUp, Bell, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentDashboardDto | null>(null);
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, assignmentsData] = await Promise.all([
          api.get<StudentDashboardDto>('/api/student/dashboard'),
          api.get<AssignmentDto[]>('/api/assignments'),
        ]);
        setStats(statsData);
        setAssignments(assignmentsData);
      } catch {
        // fallback to mock data
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const displayAssignments = assignments.length > 0
    ? assignments.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description || '',
        course: '',
        dueDate: a.dueDate,
        status: 'pending' as const,
      }))
    : mockStudentAssignments;

  const displayStats = stats || {
    totalAssignments: mockStudentAssignments.length,
    submittedCount: mockStudentAssignments.filter(a => a.status !== 'pending').length,
    pendingCount: mockStudentAssignments.filter(a => a.status === 'pending').length,
    averageGrade: mockStudentAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / mockStudentAssignments.filter(a => a.grade).length || null,
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 text-balance">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Here's an overview of your academic progress for this semester.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatsCard
          icon={FileText}
          label="Total Assignments"
          value={displayStats.totalAssignments}
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Submitted"
          value={displayStats.submittedCount}
          trend={{
            value: displayStats.totalAssignments > 0
              ? Math.round((displayStats.submittedCount / displayStats.totalAssignments) * 100)
              : 0,
            isPositive: true,
            label: 'completion rate',
          }}
          iconColor="text-green-600"
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={displayStats.pendingCount}
          trend={{
            value: displayStats.pendingCount,
            isPositive: false,
            label: 'due soon',
          }}
          iconColor="text-orange-600"
        />
        <StatsCard
          icon={TrendingUp}
          label="Average Grade"
          value={displayStats.averageGrade != null ? `${Math.round(displayStats.averageGrade)}%` : 'N/A'}
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Assignments</CardTitle>
                <CardDescription>Your latest submissions and grades</CardDescription>
              </div>
              <Link href="/student/assignments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayAssignments.slice(0, 4).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                      {assignment.course && (
                        <p className="text-sm text-muted-foreground">{assignment.course}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusLabel(assignment.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/student/assignments" className="block mt-4">
                <Button variant="ghost" className="w-full" size="sm">
                  View All Assignments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockUpcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-3 bg-secondary/50 rounded-lg border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                        deadline.daysUntilDue <= 2 ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground">{deadline.title}</h4>
                      <p className="text-xs text-muted-foreground">{deadline.course}</p>
                      <p className="text-xs text-orange-600 font-medium mt-1">
                        {deadline.daysUntilDue} day{deadline.daysUntilDue !== 1 ? 's' : ''} left
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNotifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read
                      ? 'bg-background border-border'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-foreground' : 'text-blue-900'
                      }`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs mt-1 ${
                        notification.read ? 'text-muted-foreground' : 'text-blue-700'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
