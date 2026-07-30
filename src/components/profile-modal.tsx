import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getMyProfile } from '@/lib/quiz.functions';
import { getMyRole } from '@/lib/admin.functions';
import { updateProfile } from '@/lib/profile.functions';
import { AvatarPicker } from './avatar-picker';
import { AvatarBadge } from './avatar-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, UserCheck, ShieldCheck, Crown, User, Sparkles, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const getProfileFn = useServerFn(getMyProfile);
  const getRoleFn = useServerFn(getMyRole);
  const updateProfileFn = useServerFn(updateProfile);

  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: () => getProfileFn(),
    enabled: isOpen,
  });

  const { data: roleInfo } = useQuery({
    queryKey: ['myRole'],
    queryFn: () => getRoleFn(),
    enabled: isOpen,
  });

  const [displayName, setDisplayName] = useState('');
  const [avatarPreset, setAvatarPreset] = useState('avatar_cloud_1');
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setAvatarPreset(profile.avatar_preset || 'avatar_cloud_1');
      setShowOnLeaderboard(profile.show_on_leaderboard ?? true);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: { displayName?: string; avatarPreset?: string; showOnLeaderboard?: boolean }) =>
      updateProfileFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast.success('Profile updated successfully!');
      onClose();
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update profile'),
  });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      displayName: displayName.trim() || undefined,
      avatarPreset,
      showOnLeaderboard,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg card-elevated p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <AvatarBadge avatarId={avatarPreset} size="md" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Profile & Avatar Settings</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {roleInfo?.isSuperAdmin && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                    <Crown className="w-3 h-3" /> Super Admin
                  </span>
                )}
                {roleInfo?.isAdmin && !roleInfo.isSuperAdmin && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
                {!roleInfo?.isAdmin && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    <User className="w-3 h-3" /> Trainee User
                  </span>
                )}
              </div>
              {(profile as any)?.username && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  @{(profile as any).username}
                </p>
              )}
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dn-modal" className="font-semibold text-sm">
              Display Name
            </Label>
            <Input
              id="dn-modal"
              placeholder="Your full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-base"
            />
          </div>

          <AvatarPicker selectedAvatarId={avatarPreset} onSelectAvatar={setAvatarPreset} />

          <div className="flex items-center space-x-3 pt-2 border-t border-border/60">
            <Checkbox
              id="sol"
              checked={showOnLeaderboard}
              onCheckedChange={(v) => setShowOnLeaderboard(!!v)}
            />
            <label htmlFor="sol" className="text-sm font-medium leading-none cursor-pointer">
              Display my profile on the Batch Leaderboard
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => {
                if ('serviceWorker' in navigator && (window as any).deferredPwaPrompt) {
                  (window as any).deferredPwaPrompt.prompt();
                } else {
                  toast.info('To install QuizForge App: Open browser menu (⋮ or Share) → Add to Home Screen / Install App');
                }
              }}
            >
              <Download className="w-3.5 h-3.5" /> Install App
            </Button>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} size="sm" className="gap-2">
                <UserCheck className="w-4 h-4" />
                {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
