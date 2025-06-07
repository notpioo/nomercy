import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/use-pwa';

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('installDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Show install prompt after 3 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstallable]);

  const handleInstall = () => {
    installApp();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('installDismissed', 'true');
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isInstallable || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-gaming-purple to-gaming-blue p-4 rounded-lg shadow-xl transform transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Download className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Install GameCommunity</h3>
            <p className="text-sm opacity-90">Get the full native experience</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleInstall}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
