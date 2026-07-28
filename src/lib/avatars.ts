export interface AvatarPreset {
  id: string;
  name: string;
  role: string;
  color: string; // Tailwind color class or hex
  gradient: string;
  svgIcon: string; // Icon identifier or inline SVG path
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'avatar_apex_ninja',
    name: 'APEX Ninja',
    role: 'Low-Code Master',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    svgIcon: 'code'
  },
  {
    id: 'avatar_cloud_architect',
    name: 'Cloud Architect',
    role: 'OCI PaaS Specialist',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
    svgIcon: 'cloud'
  },
  {
    id: 'avatar_db_sentinel',
    name: 'Database Sentinel',
    role: 'Autonomous DB Lead',
    color: '#ef4444',
    gradient: 'from-red-500 to-rose-600',
    svgIcon: 'database'
  },
  {
    id: 'avatar_devops_commander',
    name: 'DevOps Commander',
    role: 'CI/CD Pipeline Hero',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    svgIcon: 'terminal'
  },
  {
    id: 'avatar_integration_guru',
    name: 'Integration Guru',
    role: 'OIC Specialist',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-violet-600',
    svgIcon: 'cpu'
  },
  {
    id: 'avatar_security_guardian',
    name: 'Security Guardian',
    role: 'IAM & Vault Admin',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    svgIcon: 'shield'
  },
  {
    id: 'avatar_fusion_pioneer',
    name: 'Fusion Pioneer',
    role: 'Apps Suite Lead',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-500',
    svgIcon: 'zap'
  },
  {
    id: 'avatar_oracle_scholar',
    name: 'Oracle Scholar',
    role: 'Top Trainee',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    svgIcon: 'award'
  },
  {
    id: 'avatar_data_wizard',
    name: 'Data Wizard',
    role: 'Analytics Expert',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-600',
    svgIcon: 'bar-chart'
  },
  {
    id: 'avatar_api_catalyst',
    name: 'API Catalyst',
    role: 'REST Gateway Admin',
    color: '#eab308',
    gradient: 'from-yellow-500 to-amber-600',
    svgIcon: 'layers'
  },
  {
    id: 'avatar_quantum_coder',
    name: 'Quantum Coder',
    role: 'Full-Stack Developer',
    color: '#0284c7',
    gradient: 'from-sky-500 to-blue-700',
    svgIcon: 'terminal'
  },
  {
    id: 'avatar_oracle_master',
    name: 'Oracle Master',
    role: 'Certified Architect',
    color: '#d97706',
    gradient: 'from-amber-600 to-red-600',
    svgIcon: 'crown'
  }
];

export function getAvatarPreset(avatarId?: string | null): AvatarPreset {
  if (!avatarId) return AVATAR_PRESETS[0];
  return AVATAR_PRESETS.find(a => a.id === avatarId) || AVATAR_PRESETS[0];
}
