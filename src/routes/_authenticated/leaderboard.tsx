import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getLeaderboard } from '@/lib/leaderboard.functions';
import { AvatarBadge } from '@/components/avatar-badge';
import { AppHeader } from '@/components/app-header';
import { Trophy, Flame, BarChart3, Calendar, Medal } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/leaderboard')({
  head: () => ({
    meta: [
      { title: 'Leaderboard — QuizForge' },
      { name: 'description', content: 'Top performers in the Oracle PaaS batch.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: LeaderboardPage,
});

type Category = 'avg_score' | 'streak' | 'total_quizzes';
type Period = 'all_time' | 'weekly';

const CATEGORY_CONFIG = {
  avg_score: { label: 'Avg Score', icon: BarChart3, format: (v: number) => `${v}%` },
  streak: { label: 'Active Days', icon: Flame, format: (v: number) => `${v} days` },
  total_quizzes: { label: 'Quizzes Done', icon: Trophy, format: (v: number) => `${v} quizzes` },
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-md">
      <span className="text-xs font-black text-amber-900">#1</span>
    </div>
  );
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-md">
      <span className="text-xs font-black text-slate-900">#2</span>
    </div>
  );
  if (rank === 3) return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 flex items-center justify-center shadow-md">
      <span className="text-xs font-black text-orange-950">#3</span>
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
      <span className="text-xs font-bold text-muted-foreground">#{rank}</span>
    </div>
  );
}

function LeaderboardPage() {
  const [category, setCategory] = useState<Category>('avg_score');
  const [period, setPeriod] = useState<Period>('all_time');
  const leaderboardFn = useServerFn(getLeaderboard);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['leaderboard', category, period],
    queryFn: () => leaderboardFn({ data: { category, period } }),
  });

  const cfg = CATEGORY_CONFIG[category];
  const ValueIcon = cfg.icon;

  const getStatValue = (entry: any) => {
    if (category === 'avg_score') return entry.avgScore;
    if (category === 'streak') return entry.daysActive;
    return entry.totalQuizzes;
  };

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Trophy className="w-4 h-4" /> Batch Leaderboard
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Oracle PaaS Top Performers
          </h1>
          <p className="text-muted-foreground text-sm">
            Live rankings across all 200 trainees in the batch
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-up">
          <div className="flex rounded-xl border border-border overflow-hidden bg-card p-1 gap-1">
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
              const C = CATEGORY_CONFIG[cat];
              const CatIcon = C.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    category === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {C.label}
                </button>
              );
            })}
          </div>

          <div className="flex rounded-xl border border-border overflow-hidden bg-card p-1 gap-1">
            {(['all_time', 'weekly'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === p
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {p === 'all_time' ? 'All Time' : 'This Week'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-sm text-muted-foreground">Computing rankings...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 space-y-3 border border-dashed rounded-2xl">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-lg font-semibold text-foreground">No rankings yet</p>
            <p className="text-sm text-muted-foreground">Complete a quiz to appear on the leaderboard!</p>
          </div>
        ) : (
          <>
            {/* Podium Top 3 */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-4 pt-4 animate-fade-up">
                {/* 2nd Place */}
                {top3[1] && (
                  <div className="flex flex-col items-center gap-2 pb-2">
                    <div className="relative">
                      <AvatarBadge avatarId={top3[1].avatarPreset} size="lg" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center">
                        <Medal className="w-3 h-3 text-slate-900" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-foreground text-center max-w-[80px] truncate">{top3[1].displayName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{cfg.format(getStatValue(top3[1]))}</p>
                    <div className="w-20 h-16 bg-gradient-to-t from-slate-400/30 to-slate-300/10 border border-slate-400/30 rounded-t-xl flex items-center justify-center">
                      <span className="text-2xl font-black text-slate-500">#2</span>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-bounce">
                      <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                    </div>
                    <div className="relative">
                      <AvatarBadge avatarId={top3[0].avatarPreset} size="xl" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-md">
                        <span className="text-[10px] font-black text-amber-900">★</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-foreground text-center max-w-[100px] truncate">{top3[0].displayName}</p>
                    <p className="text-xs text-primary font-mono font-bold">{cfg.format(getStatValue(top3[0]))}</p>
                    <div className="w-24 h-24 bg-gradient-to-t from-amber-500/30 to-amber-400/10 border border-amber-500/30 rounded-t-xl flex items-center justify-center">
                      <span className="text-3xl font-black text-amber-500">#1</span>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                  <div className="flex flex-col items-center gap-2 pb-2">
                    <div className="relative">
                      <AvatarBadge avatarId={top3[2].avatarPreset} size="lg" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-amber-700 flex items-center justify-center">
                        <span className="text-[9px] font-black text-orange-950">3</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-foreground text-center max-w-[80px] truncate">{top3[2].displayName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{cfg.format(getStatValue(top3[2]))}</p>
                    <div className="w-20 h-12 bg-gradient-to-t from-orange-400/30 to-orange-300/10 border border-orange-400/30 rounded-t-xl flex items-center justify-center">
                      <span className="text-2xl font-black text-orange-500">#3</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rest of leaderboard */}
            {rest.length > 0 && (
              <div className="card-elevated divide-y divide-border/60 animate-fade-up">
                {rest.map((entry, idx) => {
                  const rank = idx + 4;
                  return (
                    <div key={entry.userId} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                      <RankBadge rank={rank} />
                      <AvatarBadge avatarId={entry.avatarPreset} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{entry.displayName}</p>
                        <p className="text-xs text-muted-foreground">{entry.totalQuizzes} quizzes completed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{cfg.format(getStatValue(entry))}</p>
                        <p className="text-xs text-muted-foreground">{entry.daysActive} active days</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
