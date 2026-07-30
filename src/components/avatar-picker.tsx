import React from 'react';
import { AVATAR_PRESETS } from '@/lib/avatars';
import { AvatarBadge } from './avatar-badge';
import { Check } from 'lucide-react';

interface AvatarPickerProps {
  selectedAvatarId: string;
  onSelectAvatar: (id: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedAvatarId,
  onSelectAvatar,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-foreground flex items-center gap-2">
          Choose Your Avatar Badge
        </label>
        <span className="text-xs text-muted-foreground">Select a title & badge</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {AVATAR_PRESETS.map((preset) => {
          const isSelected = selectedAvatarId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectAvatar(preset.id)}
              title={`${preset.name} — ${preset.role}`}
              className={`relative flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/15 shadow-md ring-2 ring-primary ring-offset-1 ring-offset-background scale-[1.02] z-10'
                  : 'border-border/80 bg-card/60 hover:bg-muted/80 hover:border-border'
              }`}
            >
              <AvatarBadge avatarId={preset.id} size="md" className="shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{preset.name}</p>
                <p className="text-[11px] font-medium text-muted-foreground truncate mt-0.5">{preset.role}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
