'use client';

import { useState, useEffect } from 'react';
import { SubmissionDto, ReportDto, StudentDashboardDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockStudentAssignments, mockStudentStats } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GradeEntry {
  id: string;
  title: string;
  course: string;
  grade: number;
}

export default function GradesPage() {
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([]);
  const [stats, setStats] = useState<StudentDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardStats, submissions] = await Promise.all([
          api.get<StudentDashboardDto>('/api/student/dashboard').catch(() => null),
          api.get<SubmissionDto[]>('/api/submissions').catch(() => [] as SubmissionDto[]),
        ]);

        setStats(dashboardStats);

        const gradedSubs = submissions.filter(s => s.status === 'Graded');
        const entries: GradeEntry[] = [];

        for (const sub of gradedSubs) {
          try {
            const report = await api.get<ReportDto>(`/api/submissions/${sub.id}/report`);
            entries.push({
              id: sub.assignmentId,
              title: sub.assignmentTitle,
              course: '',
              grade: report.grade,
            });
          } catch {
            // skip submissions without reports
          }
        }

        setGradeEntries(entries);
      } catch {
        // fallback to mock
        setGradeEntries(
          mockStudentAssignments
            .filter(a => a.grade)
            .map(a => ({ id: a.id, title: a.title, course: a.course, grade: a.grade! }))
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const gradedAssignments = gradeEntries;

  // Prepare data for chart
  const gradeData = gradedAssignments.map(a => ({
    name: a.title.substring(0, 15),
    grade: a.grade || 0,
  }));

  // Calculate grade distribution
  const gradeRanges = {
    'A (90-100)': gradedAssignments.filter(a => (a.grade || 0) >= 90).length,
    'B (80-89)': gradedAssignments.filter(a => (a.grade || 0) >= 80 && (a.grade || 0) < 90).length,
    'C (70-79)': gradedAssignments.filter(a => (a.grade || 0) >= 70 && (a.grade || 0) < 80).length,
    'D (60-69)': gradedAssignments.filter(a => (a.grade || 0) >= 60 && (a.grade || 0) < 70).length,
    'F (<60)': gradedAssignments.filter(a => (a.grade || 0) < 60).length,
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    if (grade >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Grades</h1>
        <p className="text-muted-foreground mt-2">
          Track your academic performance across all assignments.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Overall Average</p>
              <p className="text-4xl font-bold text-primary mt-2">
                {stats?.averageGrade != null ? `${Math.round(stats.averageGrade)}%` : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Excellent Performance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Graded Assignments</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{gradedAssignments.length}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {gradedAssignments.length} graded
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Completion Rate</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {stats ? `${Math.round((stats.submittedCount / (stats.totalAssignments || 1)) * 100)}%` : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">On track for the semester</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Your assignment grades by letter grade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(gradeRanges).map(([range, count]) => (
              <div key={range} className="text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{range}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Chart */}
      {gradeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <Bar dataKey="grade" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Grades List */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>Detailed breakdown of all your graded assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gradedAssignments.length > 0 ? (
              gradedAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Grade</p>
                      <p className="text-lg font-bold text-foreground">{assignment.grade}%</p>
                    </div>
                    <Badge className={getGradeColor(assignment.grade || 0)}>
                      {getGradeLabel(assignment.grade || 0)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No graded assignments yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
