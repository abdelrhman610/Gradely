'use client';

import { mockTeacherStudents } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/toast-context';

export default function TeacherStudentsPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const getGradeLevel = (grade: number) => {
    if (grade >= 90) return { label: 'A', color: 'bg-green-100 text-green-800' };
    if (grade >= 80) return { label: 'B', color: 'bg-blue-100 text-blue-800' };
    if (grade >= 70) return { label: 'C', color: 'bg-yellow-100 text-yellow-800' };
    if (grade >= 60) return { label: 'D', color: 'bg-orange-100 text-orange-800' };
    return { label: 'F', color: 'bg-red-100 text-red-800' };
  };

  const handleViewStudent = (studentId: string, studentName: string) => {
    addToast(`Viewing profile for ${studentName}`, 'info');
    router.push(`/teacher/students/${studentId}`);
  };

  const handleContactStudent = (studentName: string) => {
    addToast(`Opening messages for ${studentName}`, 'info');
    router.push('/teacher/messages');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 sm:h-8 w-6 sm:w-8" />
          My Students
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Manage and track the progress of your students.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-xs sm:text-sm">Total Students</p>
              <p className="text-2xl sm:text-4xl font-bold text-primary mt-2">{mockTeacherStudents.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-xs sm:text-sm">Excellent (A)</p>
              <p className="text-2xl sm:text-4xl font-bold text-green-600 mt-2">
                {mockTeacherStudents.filter(s => s.grade >= 90).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-xs sm:text-sm">Good (B-C)</p>
              <p className="text-2xl sm:text-4xl font-bold text-blue-600 mt-2">
                {mockTeacherStudents.filter(s => s.grade >= 70 && s.grade < 90).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-xs sm:text-sm">Average Grade</p>
              <p className="text-2xl sm:text-4xl font-bold text-primary mt-2">
                {(mockTeacherStudents.reduce((sum, s) => sum + s.grade, 0) / mockTeacherStudents.length).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Click on a student to view their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTeacherStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-secondary/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{student.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{student.email}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Badge className={getGradeLevel(student.grade).color}>
                      {getGradeLevel(student.grade).label} - {student.grade}%
                    </Badge>
                  </div>
                  <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewStudent(student.id, student.name)}
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-xs sm:text-sm"
                      onClick={() => handleContactStudent(student.name)}
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
