import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { adminListUsers, adminSetUserRole, getMyRole, adminSetUserMcq1Access } from '@/lib/admin.functions';
import { AvatarBadge } from '@/components/avatar-badge';
import { ShieldCheck, ShieldAlert, User, Crown, Lock, Unlock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const queryClient = useQueryClient();
  const roleFn = useServerFn(getMyRole);
  const listUsersFn = useServerFn(adminListUsers);
  const setRoleFn = useServerFn(adminSetUserRole);
  const setMcq1Fn = useServerFn(adminSetUserMcq1Access);

  const { data: roleInfo } = useQuery({
    queryKey: ['myRole'],
    queryFn: () => roleFn(),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => listUsersFn(),
  });

  const setRoleMutation = useMutation({
    mutationFn: (data: { targetUserId: string; role: 'super_admin' | 'admin' | 'user' }) => setRoleFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Role updated successfully');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const mcq1Mutation = useMutation({
    mutationFn: (data: { targetUserId: string; showMcq1: boolean }) => setMcq1Fn({ data }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success(res.showMcq1 ? 'MCQ1 access granted.' : 'MCQ1 access revoked.');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleRoleChange = (userId: string, newRole: 'super_admin' | 'admin' | 'user') => {
    setRoleMutation.mutate({ targetUserId: userId, role: newRole });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Trainee & Role Management</h2>
        <p className="text-sm text-muted-foreground">Manage user permissions across the Oracle PaaS batch</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Batch Roster ({users.length})</CardTitle>
          <CardDescription>
            Super Admins can grant or revoke Admin permissions and MCQ1 course access for trainees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading roster...</div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div key={user.id} className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <AvatarBadge avatarId={user.avatar_preset} size="md" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">
                          {user.display_name || 'Trainee User'}
                        </p>
                        {user.role === 'super_admin' && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                            <Crown className="w-3 h-3" /> Super Admin
                          </span>
                        )}
                        {user.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        )}
                        {/* MCQ1 access badge */}
                        {(user as any).show_mcq1 && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                            <Unlock className="w-3 h-3" /> MCQ1
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enrolled: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* MCQ1 Access Toggle (admin can grant/revoke) */}
                    {roleInfo?.isAdmin && user.role !== 'super_admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-8 text-xs gap-1.5 transition-colors ${
                          (user as any).show_mcq1
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        disabled={mcq1Mutation.isPending}
                        onClick={() =>
                          mcq1Mutation.mutate({ targetUserId: user.id, showMcq1: !(user as any).show_mcq1 })
                        }
                        title={(user as any).show_mcq1 ? 'Revoke MCQ1 access' : 'Grant MCQ1 access'}
                      >
                        {(user as any).show_mcq1 ? (
                          <><Unlock className="w-3 h-3" /> MCQ1: On</>
                        ) : (
                          <><Lock className="w-3 h-3" /> MCQ1: Off</>
                        )}
                      </Button>
                    )}

                    {/* Role Selector */}
                    {roleInfo?.isSuperAdmin && user.role !== 'super_admin' ? (
                      <Select
                        value={user.role}
                        onValueChange={(val: any) => handleRoleChange(user.id, val)}
                        disabled={setRoleMutation.isPending}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Trainee User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-muted-foreground capitalize font-medium px-2 py-1 bg-muted rounded">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
