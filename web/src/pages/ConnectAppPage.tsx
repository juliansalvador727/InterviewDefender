import GithubAppConnect from "../components/GithubLogin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Info } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

export default function ConnectAppPage() {
  const handleConnectSuccess = () => {
    // After connecting, redirect to dashboard
    // Note: The actual redirect happens in the component after GitHub callback
  };

  return (
    <div className="min-h-screen noise-bg text-gray-100 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="mx-auto max-w-screen-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">ID</span>
            </div>
            <span className="font-semibold text-[15px] text-amber-300">InterviewDefender</span>
          </div>
          <Badge variant="amber" className="gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs">SETUP_REQUIRED</span>
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl text-center">
          {/* Progress Indicator */}
          <div 
            className="mb-12 flex items-center justify-center gap-3 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={3} />
              </div>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Authenticated</span>
            </div>
            <Separator orientation="horizontal" className="w-16 bg-gradient-to-r from-gray-600 to-amber-500" />
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/40 animate-pulse">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <span className="text-xs font-semibold text-amber-300 font-mono uppercase tracking-wider">Active</span>
            </div>
            <Separator orientation="horizontal" className="w-16 bg-gray-700" />
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                <Circle className="text-gray-500 h-5 w-5" />
              </div>
              <span className="text-xs text-gray-600 font-mono uppercase tracking-wider">Pending</span>
            </div>
          </div>

          {/* Heading */}
          <h1 
            className="text-[56px] font-extrabold tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 mb-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            Connect GitHub App
          </h1>

          {/* Subtitle */}
          <p 
            className="text-[17px] leading-relaxed text-gray-300 font-light max-w-lg mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            To unlock InterviewDefender, connect the GitHub App to access your repositories.
          </p>

          {/* CTA Button */}
          <div 
            className="mt-12 flex flex-col items-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.7s' }}
          >
            {API_BASE ? (
              <GithubAppConnect apiBase={API_BASE} onConnect={handleConnectSuccess} />
            ) : (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 px-4 py-2 rounded">
                Missing API configuration
              </div>
            )}
            <p className="text-[12px] text-gray-500 font-mono tracking-wide">
              → Select repositories to grant access
            </p>
          </div>

          {/* Info Card */}
          <Card 
            className="mt-14 text-left opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.9s' }}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Info className="h-5 w-5 text-amber-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-[14px] mb-3">What's the difference?</CardTitle>
                  <CardDescription className="space-y-3 text-[13px]">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5 bg-green-500/10 border-green-500/40 text-green-400">
                        <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                      </Badge>
                      <span><strong className="text-gray-300">OAuth Login:</strong> Authenticates your identity (completed)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="amber" className="mt-0.5">
                        →
                      </Badge>
                      <span><strong className="text-gray-300">GitHub App:</strong> Grants access to your repositories for interview prep (current step)</span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* What Happens Next */}
          <Card 
            className="mt-6 text-left opacity-0 animate-fade-in-up"
            style={{ animationDelay: '1.1s' }}
          >
            <CardHeader>
              <CardTitle className="text-[15px] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Execution Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-[13px] text-gray-400 font-light">
                {[
                  "You'll be redirected to GitHub",
                  "Select which repositories InterviewDefender can access",
                  "Authorize the installation",
                  "Return here to start using InterviewDefender"
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <Badge 
                      variant="outline" 
                      className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700/50 border-gray-600 flex items-center justify-center font-mono text-xs font-semibold text-gray-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 group-hover:text-amber-400 transition-all"
                    >
                      {index + 1}
                    </Badge>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Terminal-style footer */}
          <div 
            className="mt-10 flex items-center justify-center gap-2 text-[11px] text-gray-600 font-mono opacity-0 animate-fade-in"
            style={{ animationDelay: '1.3s' }}
          >
            <span className="text-amber-500">$</span>
            <span>await github_app_authorization()</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
