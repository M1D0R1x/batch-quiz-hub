import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getMyRole } from '@/lib/admin.functions';
import { AppHeader } from '@/components/app-header';
import { LayoutDashboard, BookOpen, HelpCircle, Users, ShieldAlert, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const roleFn = useServerFn(getMyRole);

  const { data: roleInfo, isLoading } = useQuery({
    queryKey: ['myRole'],
    queryFn: () => roleFn(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!roleInfo?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-xl py-12 px-4 text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-destructive/10 text-destructive mb-2">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You need administrator privileges to access the Admin Control Center. If you are an instructor or super admin, please request role escalation.
          </p>
          <Button onClick={() => navigate({ to: '/dashboard' })} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/courses', label: 'Courses & Topics', icon: BookOpen },
    { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
    { to: '/admin/users', label: 'User Roles', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">Admin Control Center</span>
        </nav>

        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Control Center
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Oracle PaaS QuizForge Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage courses, subtopics, question banks, and trainee access permissions.
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/dashboard' })} variant="ghost" size="sm" className="gap-2 self-start sm:self-auto">
            <ArrowLeft className="w-4 h-4" /> Exit Admin
          </Button>
        </div>

        {/* Sub-Navigation Tabs */}
        <nav className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-px">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                activeProps={{ className: 'border-primary text-primary bg-primary/5 font-semibold' }}
                inactiveProps={{ className: 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50' }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-t-lg border-b-2 transition-all whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
