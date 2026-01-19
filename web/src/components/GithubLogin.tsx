import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

/**
 * GithubAppConnect - GitHub App installation component
 * Used for connecting the GitHub App to access repositories
 * Requires user to be already authenticated
 * Endpoint: /api/v1/github/app/start
 */
interface GithubAppConnectProps {
  apiBase: string;
  onConnect?: () => void | Promise<void>;
}

export default function GithubAppConnect({
  apiBase,
  onConnect,
}: GithubAppConnectProps) {
  async function handleConnect() {
    try {
      const res = await fetch(`${apiBase}/api/v1/github/app/start`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      if (onConnect) {
        await onConnect();
      }
      
      window.location.href = data.install_url;
    } catch (error) {
      console.error("Failed to start GitHub App connection:", error);
    }
  }

  return (
    <Button
      onClick={() => void handleConnect()}
      size="lg"
      className="group relative text-[15px] font-semibold"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
      
      <Github className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
      <span className="relative z-10">Connect GitHub App</span>
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-lg border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
    </Button>
  );
}
