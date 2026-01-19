import GithubAppConnect from "../components/GithubLogin";
import { CheckCircle2, Circle, Shield, ArrowRight, Github } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

const steps = [
  "Redirect to GitHub authorization",
  "Select repositories to grant access",
  "Approve app installation",
  "Return to dashboard"
];

export default function ConnectAppPage() {
  const handleConnectSuccess = () => {
    // After connecting, redirect to dashboard
    // Note: The actual redirect happens in the component after GitHub callback
  };

  return (
    <div className="min-h-screen gradient-mesh text-white relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-float opacity-70" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-violet-500/20 to-pink-500/20 rounded-full blur-3xl animate-float opacity-70" style={{ animationDelay: '-3s' }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">InterviewDefender</span>
          </div>
          <div className="px-3 py-1.5 rounded-full glass-effect flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-300">Setup Required</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div 
            className="flex items-center justify-center gap-4 mb-16 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            {/* Step 1 - Complete */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-gray-400 hidden sm:inline">Authenticated</span>
            </div>

            {/* Connector */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-purple-500" />

            {/* Step 2 - Active */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <span className="text-lg font-bold text-white">2</span>
              </div>
              <span className="text-sm font-bold text-purple-400 hidden sm:inline">Connect App</span>
            </div>

            {/* Connector */}
            <div className="w-12 h-0.5 bg-white/10" />

            {/* Step 3 - Pending */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
                <Circle className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-600 hidden sm:inline">Complete</span>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="text-center mb-12">
            <h1 
              className="text-5xl sm:text-6xl font-black mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <span className="gradient-text">Connect GitHub App</span>
            </h1>
            <p 
              className="text-xl text-gray-400 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.5s' }}
            >
              Grant InterviewDefender access to your repositories to unlock personalized interview preparation.
            </p>
          </div>

          {/* CTA */}
          <div 
            className="flex flex-col items-center gap-6 mb-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.7s' }}
          >
            {API_BASE ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-glow" />
                <div className="relative">
                  <GithubAppConnect apiBase={API_BASE} onConnect={handleConnectSuccess} />
                </div>
              </div>
            ) : (
              <div className="glass-card px-6 py-4 rounded-xl text-red-400">
                Missing API configuration. Please set VITE_API_BASE_URL.
              </div>
            )}
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Github className="w-4 h-4" />
              Choose which repositories to authorize
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* What's Different */}
            <div 
              className="glass-card rounded-2xl p-8 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.9s' }}
            >
              <h3 className="text-xl font-bold mb-6">What's the difference?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-400" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">OAuth Login</div>
                    <div className="text-sm text-gray-400">Authenticates your identity with GitHub</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1">GitHub App</div>
                    <div className="text-sm text-gray-400">Grants access to specific repositories for AI analysis</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div 
              className="glass-card rounded-2xl p-8 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '1.1s' }}
            >
              <h3 className="text-xl font-bold mb-6">What happens next?</h3>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                      <span className="text-sm font-bold text-gray-400 group-hover:text-purple-400">{idx + 1}</span>
                    </div>
                    <div className="text-sm text-gray-400 pt-1.5">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div 
            className="text-center opacity-0 animate-fade-in"
            style={{ animationDelay: '1.3s' }}
          >
            <p className="text-sm text-gray-500">
              Your code and data remain private and secure. We only request read access to generate relevant interview questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
