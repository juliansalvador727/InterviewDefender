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
      className="group relative overflow-hidden"
    >
      <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
      <span>Connect GitHub App</span>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer pointer-events-none" />
    </Button>
  );
}
