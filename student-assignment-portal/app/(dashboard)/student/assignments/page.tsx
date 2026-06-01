'use client';

import { useState, useEffect } from 'react';
import { AssignmentDto, SubmissionDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockStudentAssignments } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';
import Link from 'next/link';

interface CombinedAssignment {
  id: string;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: unknown;
  submittedDate?: string;
}

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<CombinedAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [assignmentsData, submissionsData] = await Promise.all([
          api.get<AssignmentDto[]>('/api/assignments'),
          api.get<SubmissionDto[]>('/api/submissions').catch(() => [] as SubmissionDto[]),
        ]);

        const submissionMap = new Map(submissionsData.map(s => [s.assignmentId, s]));

        const combined: CombinedAssignment[] = assignmentsData.map(a => {
          const sub = submissionMap.get(a.id);
          const isSubmitted = !!sub;
          const isGraded = sub?.status === 'Graded';
          return {
            id: a.id,
            title: a.title,
            description: a.description || '',
            course: '',
            dueDate: a.dueDate,
            status: isGraded ? 'graded' : isSubmitted ? 'submitted' : 'pending',
            submittedDate: sub?.submittedAt,
          };
        });

        setAssignments(combined);
      } catch {
        setAssignments(mockStudentAssignments.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          course: a.course,
          dueDate: a.dueDate,
          status: a.status,
          grade: a.grade,
          submittedDate: a.submittedDate,
        })));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || assignment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
        <p className="text-muted-foreground mt-2">
          View all your assignments and track their status.
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === null ? 'default' : 'outline'}
                onClick={() => setFilterStatus(null)}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'submitted' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('submitted')}
                size="sm"
              >
                Submitted
              </Button>
              <Button
                variant={filterStatus === 'graded' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('graded')}
                size="sm"
              >
                Graded
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
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
                        <p className="text-sm text-muted-foreground mt-1">{assignment.course}</p>
                        <p className="text-xs text-muted-foreground mt-2">{assignment.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusLabel(assignment.status)}
                    </Badge>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Due</p>
                      <p className="text-sm font-medium text-foreground">{assignment.dueDate}</p>
                    </div>

                    {assignment.grade != null && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className="text-lg font-bold text-green-600">{assignment.grade}%</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div>
                    {assignment.submittedDate && (
                      <p className="text-xs text-muted-foreground">
                        Submitted: {assignment.submittedDate}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/student/assignments/${assignment.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                    {assignment.status === 'graded' && (
                      <Link href={`/student/feedback?assignment=${assignment.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          View Feedback
                        </Button>
                      </Link>
                    )}
                    {assignment.status === 'pending' && (
                      <Link href={`/student/assignments/${assignment.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Submit
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No assignments match your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
