'use client';

import { useState, useEffect } from 'react';
import { SubmissionDto, ReportDto } from '@/lib/types';
import { api } from '@/lib/api-client';
import { mockStudentAssignments } from '@/lib/mock-data';
import { FeedbackDisplay } from '@/components/assignments/feedback-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface FeedbackItem {
  id: string;
  title: string;
  course: string;
  feedback: {
    score: number;
    comments: string;
    suggestions: string[];
    strengths: string[];
    areasForImprovement: string[];
    generatedAt: string;
    type: 'ai' | 'teacher';
  };
}

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const assignmentIdParam = searchParams.get('assignment');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const submissions = await api.get<SubmissionDto[]>('/api/submissions').catch(() => [] as SubmissionDto[]);
        const gradedSubs = submissions.filter(s => s.status === 'Graded');
        const items: FeedbackItem[] = [];

        for (const sub of gradedSubs) {
          try {
            const report = await api.get<ReportDto>(`/api/submissions/${sub.id}/report`);
            items.push({
              id: sub.assignmentId,
              title: sub.assignmentTitle,
              course: '',
              feedback: {
                score: report.grade,
                comments: report.feedback,
                suggestions: report.mistakes.map(m => `${m.type}: ${m.description}`),
                strengths: [],
                areasForImprovement: [],
                generatedAt: report.createdAt,
                type: 'ai',
              },
            });
          } catch {
            // skip 
          }
        }

        setFeedbackItems(items);
        if (items.length > 0) {
          const initialId = assignmentIdParam && items.find(i => i.id === assignmentIdParam)
            ? assignmentIdParam
            : items[0].id;
          setSelectedId(initialId);
        }
      } catch {
        const fallback = mockStudentAssignments.filter(a => a.feedback && a.status === 'graded');
        const items = fallback.map(a => ({
          id: a.id,
          title: a.title,
          course: a.course,
          feedback: a.feedback!,
        }));
        setFeedbackItems(items);
        if (items.length > 0) {
          setSelectedId(assignmentIdParam && items.find(i => i.id === assignmentIdParam) ? assignmentIdParam : items[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [assignmentIdParam]);

  const currentAssignment = feedbackItems.find(a => a.id === selectedId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-muted-foreground">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Zap className="h-8 w-8 text-primary" />
          AI Feedback & Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Review AI-generated feedback and suggestions for your submitted assignments.
        </p>
      </div>

      {feedbackItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No feedback available yet.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Submit your assignments to receive AI-generated feedback!
            </p>
            <Link href="/student/assignments">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Assignments
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Assignment List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Feedback</CardTitle>
                <CardDescription>{feedbackItems.length} assignments graded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feedbackItems.map((assignment) => (
                    <button
                      key={assignment.id}
                      onClick={() => setSelectedId(assignment.id)}
                      className={`w-full text-left p-3 rounded-lg transition border-2 ${
                        selectedId === assignment.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <p className="font-medium text-sm text-foreground line-clamp-2">
                        {assignment.title}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{assignment.course}</span>
                        {assignment.feedback && (
                          <span className={`text-sm font-bold ${
                            assignment.feedback.score >= 90 ? 'text-green-600' :
                            assignment.feedback.score >= 80 ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {assignment.feedback.score}%
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Feedback Display */}
          <div className="lg:col-span-3">
            {currentAssignment && currentAssignment.feedback ? (
              <FeedbackDisplay
                feedback={currentAssignment.feedback}
                assignmentTitle={currentAssignment.title}
              />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No feedback available for this assignment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
