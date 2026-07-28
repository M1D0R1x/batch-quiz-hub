import React from 'react';
import { Download, X, Sparkles, Monitor, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleNativePrompt = () => {
    if ('serviceWorker' in navigator && (window as any).deferredPwaPrompt) {
      (window as any).deferredPwaPrompt.prompt();
    }
    onClose();
  };

  const hasNativePrompt = typeof window !== 'undefined' && !!(window as any).deferredPwaPrompt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md card-elevated p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Install QuizForge App</h2>
              <p className="text-xs text-muted-foreground">Full-screen PWA for Desktop & Mobile</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {hasNativePrompt ? (
          <div className="space-y-4 text-center py-2">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-foreground space-y-2">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-bold text-base">App Ready to Install!</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Click below to launch the native browser app installation window.
              </p>
            </div>
            <Button onClick={handleNativePrompt} size="lg" className="w-full gap-2 font-semibold">
              <Download className="w-4 h-4" /> Launch App Installer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              To install QuizForge as an app on Opera / Comet / Safari:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Monitor className="w-4 h-4 text-primary" /> Opera / Comet / Chrome Desktop
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Look at the right side of your browser address bar for the <strong>Install App icon (⊕ or ⬇)</strong>, or click <strong>Browser Menu (⋮ / ≡) → Install QuizForge</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Smartphone className="w-4 h-4 text-emerald-500" /> Mobile / iOS Safari
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Tap the <strong>Share button (⎋)</strong> at the bottom of Safari/Opera → select <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Button onClick={onClose} variant="outline" size="sm" className="w-full">
                Got it
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
