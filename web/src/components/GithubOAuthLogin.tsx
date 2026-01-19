import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

/**
 * GithubOAuthLogin - OAuth authentication component
 * Used for user authentication via GitHub OAuth
 * Scope: read:user, user:email
 * Endpoint: /auth/github/login
 */
export default function GithubOAuthLogin({ apiBase }: { apiBase: string }) {
  function login() {
    window.location.href = `${apiBase}/auth/github/login`;
  }

  return (
    <Button
      onClick={login}
      size="lg"
      className="group relative text-[15px] font-semibold"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
      
      <Github className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
      <span className="relative z-10">Continue with GitHub</span>
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-lg border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
    </Button>
  );
}
