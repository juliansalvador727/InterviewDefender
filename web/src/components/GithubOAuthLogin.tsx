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
      className="group relative overflow-hidden"
    >
      <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
      <span>Continue with GitHub</span>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer pointer-events-none" />
    </Button>
  );
}
