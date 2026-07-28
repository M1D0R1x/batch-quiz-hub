import React from 'react';
import { AVATAR_PRESETS, getAvatarPreset } from '@/lib/avatars';
import { 
  Code, Cloud, Database, Terminal, Cpu, Shield, Zap, Award, BarChart3, Layers, Crown 
} from 'lucide-react';

interface AvatarBadgeProps {
  avatarId?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  code: Code,
  cloud: Cloud,
  database: Database,
  terminal: Terminal,
  cpu: Cpu,
  shield: Shield,
  zap: Zap,
  award: Award,
  'bar-chart': BarChart3,
  layers: Layers,
  crown: Crown,
};

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatarId,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const preset = getAvatarPreset(avatarId);
  const IconComponent = ICON_MAP[preset.svgIcon] || Cloud;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${preset.gradient} text-white shadow-md transition-transform duration-200 ${sizeClasses}`}
        style={{
          boxShadow: `0 4px 14px 0 ${preset.color}40`,
        }}
      >
        <IconComponent className={iconSizes} />
        {preset.id === 'avatar_oracle_master' && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] text-amber-950 font-bold shadow-sm">
            ★
          </span>
        )}
      </div>
      {showLabel && (
        <div className="flex flex-col text-left">
          <span className="font-semibold leading-tight text-foreground">{preset.name}</span>
          <span className="text-xs text-muted-foreground">{preset.role}</span>
        </div>
      )}
    </div>
  );
};
