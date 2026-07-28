import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full p-4 rounded-2xl bg-card border border-primary/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground">Install QuizForge App</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Install QuizForge on your device for instant offline practice and full-screen exam mode.
            </p>
          </div>
        </div>
        <Button onClick={handleDismiss} variant="ghost" size="icon" className="h-6 w-6 rounded-full shrink-0 text-muted-foreground">
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button onClick={handleDismiss} variant="outline" size="sm" className="text-xs h-8">
          Not now
        </Button>
        <Button onClick={handleInstall} size="sm" className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground font-semibold">
          <Download className="w-3.5 h-3.5" /> Install App
        </Button>
      </div>
    </div>
  );
};
