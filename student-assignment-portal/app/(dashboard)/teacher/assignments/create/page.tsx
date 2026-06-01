'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rubricItems, setRubricItems] = useState([{ criteria: '', points: 0 }]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    dueTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRubricChange = (index: number, field: string, value: string) => {
    const newRubric = [...rubricItems];
    newRubric[index] = {
      ...newRubric[index],
      [field]: field === 'points' ? parseInt(value) || 0 : value,
    };
    setRubricItems(newRubric);
  };

  const addRubricItem = () => {
    setRubricItems([...rubricItems, { criteria: '', points: 0 }]);
  };

  const removeRubricItem = (index: number) => {
    setRubricItems(rubricItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success and redirect
      setTimeout(() => {
        router.push('/teacher/assignments');
      }, 500);
    } catch (error) {
      console.error('Failed to create assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      {/* Back Button */}
      <Link href="/teacher/assignments">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Assignment</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new assignment for your students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Basic information about your assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Assignment Title</label>
              <Input
                name="title"
                placeholder="e.g., Midterm Essay"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 bg-secondary border-border"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Course</label>
              <Input
                name="course"
                placeholder="e.g., English 101"
                value={formData.course}
                onChange={handleInputChange}
                className="mt-1 bg-secondary border-border"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                name="description"
                placeholder="Enter detailed assignment instructions..."
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 bg-secondary border-border min-h-32"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Due Date</label>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="mt-1 bg-secondary border-border"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Due Time</label>
                <Input
                  type="time"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleInputChange}
                  className="mt-1 bg-secondary border-border"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grading Rubric */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grading Rubric</CardTitle>
                <CardDescription>Define the criteria for grading</CardDescription>
              </div>
              <Button
                type="button"
                onClick={addRubricItem}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Criteria
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {rubricItems.map((item, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    placeholder="Criteria (e.g., Originality, Grammar)"
                    value={item.criteria}
                    onChange={(e) => handleRubricChange(index, 'criteria', e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    placeholder="Points"
                    value={item.points}
                    onChange={(e) => handleRubricChange(index, 'points', e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeRubricItem(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              Total Points: {rubricItems.reduce((sum, item) => sum + item.points, 0)}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Link href="/teacher/assignments" className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              'Create Assignment'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
