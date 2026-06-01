'use client';

import { BookOpen } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Gradely</h1>
        </div>
        <p className="text-muted-foreground">Assignment management platform</p>
      </div>

      <LoginForm />
    </div>
  );
}
