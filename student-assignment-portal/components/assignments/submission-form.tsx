'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/lib/toast-context';
import { api } from '@/lib/api-client';
import { SubmissionDto } from '@/lib/types';

interface SubmissionFormProps {
  assignmentId: string;
  onSubmit?: () => void;
}

export function SubmissionForm({ assignmentId, onSubmit }: SubmissionFormProps) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      addToast(`${e.target.files.length} file(s) selected`, 'info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      addToast('Please select a PDF file to upload', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('file', files[0]);

      await api.upload<SubmissionDto>('/api/submissions', formData);
      setSubmitSuccess(true);
      addToast('Assignment submitted successfully!', 'success');
      setContent('');
      setFiles([]);

      setTimeout(() => {
        setSubmitSuccess(false);
        onSubmit?.();
      }, 3000);
    } catch (error) {
      addToast('Submission failed. Please try again.', 'error');
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Submission successful!</p>
              <p className="text-sm text-green-700">Your assignment has been submitted for review.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Work</CardTitle>
        <CardDescription>Upload your assignment submission below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Assignment Content (Optional)
            </label>
            <Textarea
              id="content"
              placeholder="Paste your assignment content here or upload files below..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              className="bg-secondary border-border min-h-32"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Upload Files (Optional)</label>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="sr-only"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 cursor-pointer hover:bg-secondary transition"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-sm font-medium text-foreground">{files.length} file(s) selected:</p>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center gap-2 p-2 bg-secondary rounded">
                      <span className="text-xs font-medium text-foreground">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Requirements Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">Before submitting:</p>
              <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                <li>Review your work carefully</li>
                <li>Ensure all required components are included</li>
                <li>Double-check formatting and spelling</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || (!content && files.length === 0)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              'Submit Assignment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
