import GithubOAuthLogin from "../components/GithubOAuthLogin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ClipboardCheck, Lock } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

const features = [
  {
    icon: FileText,
    title: "Repo-Aware Interviews",
    description: "Practice interviews based on your actual codebase and projects. We analyze your repos to generate contextual questions.",
    delay: "0.8s"
  },
  {
    icon: ClipboardCheck,
    title: "Evidence-Backed Feedback",
    description: "Get detailed feedback grounded in your repository context. Every critique references actual code patterns.",
    delay: "1s"
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your code stays private. You control which repos we can access. Zero-knowledge architecture.",
    delay: "1.2s"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen noise-bg text-gray-100 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Floating ambient shapes */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

      {/* Hero Section */}
      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-3xl text-center">
          {/* Terminal-style badge */}
          <Badge 
            variant="amber"
            className="mb-8 opacity-0 animate-fade-in px-4 py-2 gap-2"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="tracking-wider uppercase">System Ready</span>
          </Badge>

          {/* Heading */}
          <h1 
            className="text-[72px] font-extrabold tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Interview<br/>Defender
          </h1>

          {/* Subtitle */}
          <p 
            className="mt-8 text-[19px] leading-relaxed text-gray-300 font-light tracking-wide opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Prepare for interviews with repo-aware simulations and
            evidence-backed feedback. Your code. Your context. Your edge.
          </p>

          {/* CTA Button */}
          <div 
            className="mt-14 flex flex-col items-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            {API_BASE ? (
              <GithubOAuthLogin apiBase={API_BASE} />
            ) : (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-4 py-2 rounded">
                Missing API configuration. Please set VITE_API_BASE_URL.
              </div>
            )}
            <p className="text-[12px] text-gray-500 tracking-wide font-mono">
              → AUTHENTICATE WITH GITHUB
            </p>
          </div>

          {/* Features */}
          <div className="mt-20 grid gap-5 text-left">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="group opacity-0 animate-fade-in-up"
                  style={{ animationDelay: feature.delay }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[17px] text-amber-300 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-[14px] text-gray-400 leading-relaxed font-light">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Terminal-style footer */}
          <div 
            className="mt-16 flex items-center justify-center gap-2 text-[11px] text-gray-600 font-mono opacity-0 animate-fade-in"
            style={{ animationDelay: '1.4s' }}
          >
            <span className="text-amber-500">$</span>
            <span>./init_defense_protocol</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
