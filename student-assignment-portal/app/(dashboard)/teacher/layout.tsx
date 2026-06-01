import { DashboardLayout } from '@/components/shared/dashboard-layout';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
