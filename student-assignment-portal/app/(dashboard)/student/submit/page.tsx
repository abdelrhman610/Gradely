'use client';

import { useState, useEffect } from 'react';
import { AssignmentDto, SubmissionDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockStudentAssignments } from '@/lib/mock-data';
import { SubmissionForm } from '@/components/assignments/submission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function SubmitAssignmentPage() {
  const [pendingAssignments, setPendingAssignments] = useState<{ id: string; title: string; course: string; description: string; dueDate: string }[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<typeof pendingAssignments[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [assignmentsData, submissionsData] = await Promise.all([
          api.get<AssignmentDto[]>('/api/assignments'),
          api.get<SubmissionDto[]>('/api/submissions').catch(() => [] as SubmissionDto[]),
        ]);

        const submittedIds = new Set(submissionsData.map(s => s.assignmentId));
        const pending = assignmentsData
          .filter(a => !submittedIds.has(a.id))
          .map(a => ({
            id: a.id,
            title: a.title,
            course: '',
            description: a.description || '',
            dueDate: a.dueDate,
          }));

        setPendingAssignments(pending);
        if (pending.length > 0) setSelectedAssignment(pending[0]);
      } catch {
        const fallback = mockStudentAssignments.filter(a => a.status === 'pending');
        const mapped = fallback.map(a => ({
          id: a.id,
          title: a.title,
          course: a.course,
          description: a.description,
          dueDate: a.dueDate,
        }));
        setPendingAssignments(mapped);
        if (mapped.length > 0) setSelectedAssignment(mapped[0]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (pendingAssignments.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Submit Assignment</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            No pending assignments to submit.
          </p>
        </div>

        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">All caught up!</p>
                <p className="text-sm text-green-700 mt-1">
                  You have submitted all available assignments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/student/assignments">
          <Button className="bg-primary hover:bg-primary/90">
            View All Assignments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Submit Assignment</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          You have {pendingAssignments.length} pending assignment{pendingAssignments.length > 1 ? 's' : ''} to submit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Assignment List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Assignments</CardTitle>
              <CardDescription>{pendingAssignments.length} to submit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingAssignments.map((assignment) => (
                  <button
                    key={assignment.id}
                    onClick={() => setSelectedAssignment(assignment)}
                    className={`w-full text-left p-3 rounded-lg transition border-2 ${
                      selectedAssignment?.id === assignment.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground line-clamp-2">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{assignment.course}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-orange-600" />
                      <span className="text-xs text-orange-600 font-medium">
                        {assignment.dueDate}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Submission Area */}
        <div className="md:col-span-3 space-y-4 sm:space-y-6">
          {selectedAssignment && (
            <>
              {/* Assignment Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedAssignment.title}</CardTitle>
                  <CardDescription>{selectedAssignment.course}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedAssignment.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-medium text-foreground mt-1">{selectedAssignment.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Course</p>
                      <p className="font-medium text-foreground mt-1">{selectedAssignment.course}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Form */}
              <SubmissionForm
                assignmentId={selectedAssignment.id}
                onSubmit={() => {
                  // After successful submission, redirect to assignments
                  setTimeout(() => {
                    window.location.href = '/student/assignments';
                  }, 3000);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
