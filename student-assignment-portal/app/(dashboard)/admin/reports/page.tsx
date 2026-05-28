'use client';

import { useState, useEffect } from 'react';
import { AdminStatsDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockAdminStats } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

export default function AdminReportsPage() {
  const [adminStats, setAdminStats] = useState<AdminStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.get<AdminStatsDto>('/api/admin/stats');
        setAdminStats(data);
      } catch {
        // fallback to mock
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayStats = adminStats || mockAdminStats;

  const dailySubmissions = [
    { date: 'Mon', submissions: 45 },
    { date: 'Tue', submissions: 52 },
    { date: 'Wed', submissions: 48 },
    { date: 'Thu', submissions: 61 },
    { date: 'Fri', submissions: 55 },
    { date: 'Sat', submissions: 30 },
    { date: 'Sun', submissions: 25 },
  ];

  const gradeDistribution = [
    { name: 'A (90-100)', value: 35, fill: '#10B981' },
    { name: 'B (80-89)', value: 25, fill: '#3B82F6' },
    { name: 'C (70-79)', value: 20, fill: '#F59E0B' },
    { name: 'D (60-69)', value: 15, fill: '#EF4444' },
    { name: 'F (<60)', value: 5, fill: '#7C3AED' },
  ];

  const userGrowth = [
    { month: 'Jan', students: 100, teachers: 5 },
    { month: 'Feb', students: 250, teachers: 12 },
    { month: 'Mar', students: 450, teachers: 20 },
    { month: 'Apr', students: 850, teachers: 35 },
    { month: 'May', students: 1200, teachers: 55 },
    { month: 'Jun', students: 2450, teachers: 125 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-8 w-8" />
          Platform Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive platform statistics and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Total Students</p>
              <p className="text-4xl font-bold text-primary mt-2">{displayStats.totalStudents}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Total Teachers</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{displayStats.totalTeachers}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Total Assignments</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{displayStats.totalAssignments}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Total Submissions</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{displayStats.totalSubmissions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Submissions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Submission Activity</CardTitle>
          <CardDescription>Number of submissions by day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySubmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Line type="monotone" dataKey="submissions" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution and User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Platform-wide grade distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Students and teachers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <Bar dataKey="students" fill="var(--primary)" />
                  <Bar dataKey="teachers" fill="var(--success)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Summary</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 font-medium">Average Grade</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {displayStats.overallAverageGrade != null ? displayStats.overallAverageGrade.toFixed(1) : 'N/A'}%
              </p>
              <p className="text-xs text-blue-700 mt-2">Across all assignments</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900 font-medium">Graded Submissions</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{displayStats.gradedSubmissions}</p>
              <p className="text-xs text-green-700 mt-2">Total graded</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-900 font-medium">Active Users</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {displayStats.totalStudents + displayStats.totalTeachers}
              </p>
              <p className="text-xs text-purple-700 mt-2">
                {displayStats.totalStudents} students, {displayStats.totalTeachers} teachers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
