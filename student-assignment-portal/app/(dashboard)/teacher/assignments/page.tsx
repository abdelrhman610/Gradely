'use client';

import { useState, useEffect } from 'react';
import { AssignmentDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockTeacherAssignments } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users } from 'lucide-react';
import Link from 'next/link';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.get<AssignmentDto[]>('/api/teacher/assignments');
        setAssignments(data);
      } catch {
        // fallback to mock
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-muted-foreground">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your course assignments.
          </p>
        </div>
        <Link href="/teacher/assignments/create">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{assignment.description}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Due</p>
                  <p className="text-sm font-medium text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Max Grade: {assignment.maxGrade}</p>
                <Link href={`/teacher/assignments/${assignment.id}`}>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    View Submissions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assignments.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No assignments yet.</p>
            <Link href="/teacher/assignments/create">
              <Button className="bg-primary hover:bg-primary/90">
                Create Your First Assignment
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
