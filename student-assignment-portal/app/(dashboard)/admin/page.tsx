'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AdminStatsDto, UserDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockAdminStats, mockAdminUsers } from '@/lib/mock-data';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, TrendingUp, ActivitySquare, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState<AdminStatsDto | null>(null);
  const [adminUsers, setAdminUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, usersData] = await Promise.all([
          api.get<AdminStatsDto>('/api/admin/stats'),
          api.get<UserDto[]>('/api/admin/users'),
        ]);
        setAdminStats(statsData);
        setAdminUsers(usersData);
      } catch {
        // fallback to mock
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayStats = adminStats || mockAdminStats;
  const displayUsers = adminUsers.length > 0
    ? adminUsers.map(u => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role.toLowerCase(),
        joinDate: new Date(u.createdAt).toLocaleDateString(),
        status: u.isVerified ? 'active' : 'pending',
      }))
    : mockAdminUsers;

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
          Platform Management 📊
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Overview of platform statistics and user management.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
        <StatsCard
          icon={Users}
          label="Total Students"
          value={displayStats.totalStudents}
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={Users}
          label="Total Teachers"
          value={displayStats.totalTeachers}
          iconColor="text-green-600"
        />
        <StatsCard
          icon={FileText}
          label="Total Assignments"
          value={displayStats.totalAssignments}
          iconColor="text-purple-600"
        />
        <StatsCard
          icon={TrendingUp}
          label="Graded Submissions"
          value={displayStats.gradedSubmissions}
          iconColor="text-orange-600"
        />
        <StatsCard
          icon={ActivitySquare}
          label="Avg Grade"
          value={displayStats.overallAverageGrade != null ? displayStats.overallAverageGrade.toFixed(1) : 'N/A'}
          iconColor="text-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base sm:text-lg">User Management</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Recent users on the platform</CardDescription>
              </div>
              <Link href="/admin/users">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Manage Users
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-foreground">Name</th>
                      <th className="hidden sm:table-cell px-4 py-3 text-left font-semibold text-foreground">Email</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-foreground">Role</th>
                      <th className="hidden md:table-cell px-4 py-3 text-left font-semibold text-foreground">Status</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.slice(0, 5).map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-foreground font-medium truncate">{u.name}</td>
                        <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground truncate">{u.email}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <Badge className={`${getRoleColor(u.role)} text-xs`}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3">
                          <Badge className={`text-xs ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button className="p-1 hover:bg-secondary rounded transition">
                              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            </button>
                            <button className="p-1 hover:bg-secondary rounded transition">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Link href="/admin/users" className="block mt-4">
                <Button variant="ghost" className="w-full" size="sm">
                  View All Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs sm:text-sm text-blue-900 font-medium">Active Users</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                  {displayStats.totalStudents + displayStats.totalTeachers}
                </p>
              </div>

              <div className="p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs sm:text-sm text-green-900 font-medium">Total Assignments</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                  {displayStats.totalAssignments}
                </p>
              </div>

              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs sm:text-sm text-purple-900 font-medium">Pending Submissions</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                  {displayStats.pendingSubmissions}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Management Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/assignments" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Assignments
                </Button>
              </Link>
              <Link href="/admin/reports" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
