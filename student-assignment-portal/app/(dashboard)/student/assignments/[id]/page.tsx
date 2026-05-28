'use client';

import { useState, useEffect } from 'react';
import { AssignmentDto, SubmissionDto, ReportDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockStudentAssignments } from '@/lib/mock-data';
import { SubmissionForm } from '@/components/assignments/submission-form';
import { FeedbackDisplay } from '@/components/assignments/feedback-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface DetailData {
  id: string;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  createdByName: string;
  status: 'pending' | 'submitted' | 'graded';
  submittedDate?: string;
  grade?: number;
  feedback?: {
    score: number;
    comments: string;
    suggestions: string[];
    strengths: string[];
    areasForImprovement: string[];
    generatedAt: string;
    type: 'ai' | 'teacher';
  };
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const assignment = await api.get<AssignmentDto>(`/api/assignments/${id}`);
        const submissions = await api.get<SubmissionDto[]>('/api/submissions').catch(() => [] as SubmissionDto[]);
        const sub = submissions.find(s => s.assignmentId === id);

        let report: ReportDto | null = null;
        if (sub && sub.status === 'Graded') {
          try {
            report = await api.get<ReportDto>(`/api/submissions/${sub.id}/report`);
          } catch {
            // no report yet
          }
        }

        const detail: DetailData = {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description || '',
          course: '',
          dueDate: assignment.dueDate,
          createdByName: '',
          status: report ? 'graded' : sub ? 'submitted' : 'pending',
          submittedDate: sub?.submittedAt,
          grade: report?.grade,
        };

        if (report) {
          detail.feedback = {
            score: report.grade,
            comments: report.feedback,
            suggestions: report.mistakes.map(m => `${m.type}: ${m.description}`),
            strengths: [],
            areasForImprovement: [],
            generatedAt: report.createdAt,
            type: 'ai',
          };
        }

        setData(detail);
      } catch {
        const fallback = mockStudentAssignments.find(a => a.id === id);
        if (fallback) {
          setData({
            id: fallback.id,
            title: fallback.title,
            description: fallback.description,
            course: fallback.course,
            dueDate: fallback.dueDate,
            createdByName: fallback.createdByName,
            status: fallback.status,
            submittedDate: fallback.submittedDate,
            grade: fallback.grade,
            feedback: fallback.feedback,
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading assignment...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 space-y-6">
        <Link href="/student/assignments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Assignment not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="p-6 space-y-6">
      <Link href="/student/assignments">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>
      </Link>

      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{data.title}</h1>
            {data.course && <p className="text-muted-foreground mt-1">{data.course}</p>}
          </div>
          <Badge className={getStatusColor(data.status)}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Due Date</p>
              </div>
              <p className="font-semibold text-foreground">{new Date(data.dueDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {data.createdByName && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
                <p className="font-semibold text-foreground">{data.createdByName}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {data.submittedDate && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-semibold text-foreground">{new Date(data.submittedDate).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{data.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {data.status === 'graded' && data.feedback && (
            <FeedbackDisplay
              feedback={data.feedback}
              assignmentTitle={data.title}
            />
          )}

          {(data.status === 'pending' || data.status === 'submitted') && (
            <SubmissionForm assignmentId={data.id} />
          )}
        </div>

        <div className="space-y-6">
          {data.grade != null && (
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-lg">Your Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-green-600">{data.grade}%</p>
                    <p className="text-sm text-green-700 mt-2">Excellent Performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Status</p>
                <Badge className={getStatusColor(data.status)}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </Badge>
              </div>

              {data.status === 'pending' && (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-900 font-medium">⏰ Not Yet Submitted</p>
                  <p className="text-xs text-orange-700 mt-1">
                    Submit your work using the form on the left.
                  </p>
                </div>
              )}

              {data.status === 'submitted' && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium">✓ Submitted</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Your submission is being reviewed. AI grading will be completed soon.
                  </p>
                </div>
              )}

              {data.status === 'graded' && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-900 font-medium">✓ Graded</p>
                  <p className="text-xs text-green-700 mt-1">
                    Your assignment has been graded. View feedback above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
