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
      <label className="text-sm font-medium text-foreground">
        Choose your Preset Avatar
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {AVATAR_PRESETS.map((preset) => {
          const isSelected = selectedAvatarId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectAvatar(preset.id)}
              className={`relative flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                  : 'border-border bg-card/50 hover:bg-accent hover:border-accent-foreground/30'
              }`}
            >
              <AvatarBadge avatarId={preset.id} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{preset.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{preset.role}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
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
