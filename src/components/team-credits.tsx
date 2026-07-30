import React from "react";
import { Code, BookOpen, FileText, Sparkles, Layers, Heart, ShieldCheck } from "lucide-react";

export function TeamCredits() {
  const team = [
    {
      name: "Veera",
      role: "Lead Developer & Architect",
      contrib: "Platform Engineering, Custom Auth & Quiz Engine",
      icon: Code,
      badge: "Lead Dev 🚀",
      badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
      avatarBg: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
      highlight: true,
    },
    {
      name: "Harinee",
      role: "MCQ & Content Specialist",
      contrib: "MCQ Curation & Topic Question Banks",
      icon: BookOpen,
      badge: "MCQ Team 📚",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      avatarBg: "from-purple-500/20 to-pink-500/20 text-purple-400",
      highlight: false,
    },
    {
      name: "Darshan",
      role: "MCQ & Content Specialist",
      contrib: "Question PDF Processing & Data Structuring",
      icon: FileText,
      badge: "MCQ Team 📝",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      avatarBg: "from-amber-500/20 to-orange-500/20 text-amber-400",
      highlight: false,
    },
    {
      name: "Kavya",
      role: "MCQ & Content Specialist",
      contrib: "Question Datasets & Answer Verification",
      icon: Sparkles,
      badge: "MCQ Team ✨",
      badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      avatarBg: "from-sky-500/20 to-blue-500/20 text-sky-400",
      highlight: false,
    },
    {
      name: "Prakash",
      role: "MCQ & Content Specialist",
      contrib: "Material Gathering & Question PDF Compilations",
      icon: Layers,
      badge: "MCQ Team 📄",
      badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      avatarBg: "from-indigo-500/20 to-violet-500/20 text-indigo-400",
      highlight: false,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 backdrop-blur-xl shadow-xl animate-fade-up">
      {/* Decorative gradient glow background */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-500">
            <Heart className="h-3.5 w-3.5 fill-current animate-pulse" />
            Built for our batch
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Meet the Team Behind QuizForge
          </h2>
          <p className="max-w-xl text-xs md:text-sm text-muted-foreground leading-relaxed">
            QuizForge was built by <span className="font-semibold text-foreground">Veera</span> who designed & developed the platform, powered by the awesome contribution of <span className="font-semibold text-foreground">Harinee</span>, <span className="font-semibold text-foreground">Darshan</span>, <span className="font-semibold text-foreground">Kavya</span>, and <span className="font-semibold text-foreground">Prakash</span> who organized and curated the MCQ PDFs!
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {team.map((member) => {
            const Icon = member.icon;
            return (
              <div
                key={member.name}
                className={`relative group rounded-xl border p-4 transition-all duration-200 hover:-translate-y-1 ${
                  member.highlight
                    ? "border-primary/50 bg-gradient-to-br from-primary/10 via-card to-card shadow-lg shadow-primary/5"
                    : "border-border/60 bg-card/40 hover:border-border hover:bg-card/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon Avatar */}
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${member.avatarBg} font-bold shadow-inner`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-foreground text-base truncate flex items-center gap-1.5">
                        {member.name}
                        {member.highlight && (
                          <ShieldCheck className="h-4 w-4 text-primary fill-primary/20" title="Creator & Developer" />
                        )}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${member.badgeColor}`}>
                        {member.badge}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80 mt-1.5 leading-snug">
                      {member.contrib}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
