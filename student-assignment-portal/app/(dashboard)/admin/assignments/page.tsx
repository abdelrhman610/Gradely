'use client';

import { mockTeacherAssignments } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssignments = mockTeacherAssignments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-8 w-8" />
          All Assignments
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all assignments across the platform.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {assignment.course} • Created by: {assignment.createdByName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Due</p>
                  <p className="font-medium text-foreground">{assignment.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Total Submissions</p>
                  <p className="text-2xl font-bold text-foreground">{assignment.submissions.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {assignment.submissions.filter(s => s.status === 'submitted').length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {assignment.submissions.filter(s => s.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
