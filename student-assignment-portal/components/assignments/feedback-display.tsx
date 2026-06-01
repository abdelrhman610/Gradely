'use client';

import { Feedback } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Lightbulb, Target } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: Feedback;
  assignmentTitle: string;
}

export function FeedbackDisplay({ feedback, assignmentTitle }: FeedbackDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{assignmentTitle}</h2>
              <p className="text-muted-foreground mt-1">AI-Generated Feedback</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-5xl font-bold text-primary mt-1">{feedback.score}</p>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{feedback.comments}</p>
          <p className="text-xs text-muted-foreground mt-4">
            Feedback generated on {feedback.generatedAt}
          </p>
        </CardContent>
      </Card>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-green-900">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Areas for Improvement */}
      {feedback.areasForImprovement.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-orange-900">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-600 flex-shrink-0" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Lightbulb className="h-5 w-5" />
              Suggestions for Next Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-blue-900">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Performance Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Score</span>
                <span className="text-sm font-bold text-foreground">{feedback.score}%</span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    feedback.score >= 90 ? 'bg-green-500' :
                    feedback.score >= 80 ? 'bg-blue-500' :
                    feedback.score >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${feedback.score}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {feedback.score >= 90 ? '🎉 Excellent work!' :
               feedback.score >= 80 ? '👏 Great job!' :
               feedback.score >= 70 ? '✓ Good effort!' :
               '💪 Keep improving!'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
