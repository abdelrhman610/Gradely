'use client';

import { useState, useEffect } from 'react';
import { StatsDto, TeacherSubmissionDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockTeacherAssignments, mockTeacherStudents } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Edit2 } from 'lucide-react';

export default function TeacherGradesPage() {
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [submissions, setSubmissions] = useState<TeacherSubmissionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, assignmentsData] = await Promise.all([
          api.get<StatsDto>('/api/teacher/stats').catch(() => null),
          api.get<{ id: string; title: string }[]>('/api/teacher/assignments').catch(() => []),
        ]);
        setStats(statsData);

        // fetch submissions for each assignment
        const allSubmissions: TeacherSubmissionDto[] = [];
        for (const a of assignmentsData) {
          try {
            const subs = await api.get<TeacherSubmissionDto[]>(`/api/teacher/assignments/${a.id}/submissions`);
            allSubmissions.push(...subs);
          } catch {
            // skip
          }
        }
        setSubmissions(allSubmissions);
      } catch {
        // fallback to mock
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = stats?.perAssignment.map(a => ({
    name: a.title.substring(0, 12),
    avgScore: a.averagePercent ?? 0,
  })) || mockTeacherAssignments.map(assignment => ({
    name: assignment.title.substring(0, 12),
    avgScore: assignment.submissions.length > 0
      ? Math.round(assignment.submissions.reduce((sum, s) => sum + (s.aiScore || 0), 0) / assignment.submissions.length)
      : 0,
  }));

  const displayStats = stats || {
    totalAssignments: mockTeacherAssignments.length,
    totalSubmissions: 0,
    gradedCount: 0,
    pendingCount: 0,
    overallAveragePercent: null,
    perAssignment: [],
    gradeDistribution: { below60: 0, from60To69: 0, from70To79: 0, from80To89: 0, from90To100: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-muted-foreground">Loading grades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Grade Management</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage student grades across all assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Submissions</p>
              <p className="text-4xl font-bold text-primary mt-2">{displayStats.totalSubmissions}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Graded</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{displayStats.gradedCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Average Grade</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {displayStats.overallAveragePercent != null ? `${Math.round(displayStats.overallAveragePercent)}%` : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Average Scores by Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <Bar dataKey="avgScore" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Grade Approvals</CardTitle>
          <CardDescription>Submissions awaiting your review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissions.filter(s => !s.grade).map(submission => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{submission.assignmentTitle}</p>
                  <p className="text-sm text-muted-foreground">{submission.studentName}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </div>
            ))}

            {submissions.filter(s => !s.grade).length === 0 && (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-muted-foreground">All submissions are reviewed!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
