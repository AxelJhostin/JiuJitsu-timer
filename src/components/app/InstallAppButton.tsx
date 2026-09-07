import React from "react";
import { Download } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: InstallPromptEvent;
  }
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] =
    React.useState<InstallPromptEvent | null>(null);

  React.useEffect(() => {
    const handleInstallPrompt = (event: InstallPromptEvent) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  if (!installPrompt) return null;

  return (
    <button className="button pwa-install" type="button" onClick={install}>
      <Download aria-hidden="true" /> Instalar aplicación
    </button>
  );
}
