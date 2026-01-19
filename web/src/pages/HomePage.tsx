import GithubOAuthLogin from "../components/GithubOAuthLogin";
import Navbar from "../components/Navbar";
import { Sparkles, Shield, Zap, ArrowRight, Github } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Practice",
    description: "Advanced interview simulations tailored to your actual codebase and tech stack.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Real-time analysis and actionable insights to improve your interview performance.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption. Your code never leaves your control. Full compliance guaranteed.",
    gradient: "from-violet-500 to-purple-500"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-mesh text-white relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-float opacity-70" />
      <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/20 to-pink-500/20 rounded-full blur-3xl animate-float opacity-70" style={{ animationDelay: '-3s' }} />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      {/* Content */}
      <div className="relative">
        {/* Navbar */}
        <Navbar variant="fixed" />

        {/* Hero */}
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6 sm:mb-8 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-300">Now in Beta</span>
              </div>

              {/* Main heading */}
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-5 sm:mb-6 opacity-0 animate-fade-in-up px-4"
                style={{ animationDelay: '0.2s' }}
              >
                <span className="gradient-text">Master Your</span>
                <br />
                <span className="gradient-text">Next Interview</span>
              </h1>

              {/* Subtitle */}
              <p 
                className="text-lg sm:text-xl lg:text-2xl text-gray-400 font-light leading-relaxed mb-10 sm:mb-12 max-w-2xl mx-auto opacity-0 animate-fade-in-up px-4"
                style={{ animationDelay: '0.4s' }}
              >
                AI-powered interview prep that analyzes your actual code. Get personalized questions and feedback that matter.
              </p>

              {/* CTA */}
              <div 
                className="flex flex-col items-center gap-6 opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.6s' }}
              >
                {API_BASE ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-glow" />
                    <div className="relative">
                      <GithubOAuthLogin apiBase={API_BASE} />
                    </div>
                  </div>
                ) : (
                  <div className="glass-card px-6 py-4 rounded-xl text-red-400">
                    Missing API configuration. Please set VITE_API_BASE_URL.
                  </div>
                )}
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Connect with GitHub to get started
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group glass-card rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-300 opacity-0 animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${0.8 + idx * 0.1}s` }}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                    <div className="mt-5 sm:mt-6 flex items-center gap-2 text-sm font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div 
              className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '1.2s' }}
            >
              <div className="grid md:grid-cols-3 gap-8 sm:gap-12 text-center">
                <div className="py-4">
                  <div className="text-4xl sm:text-5xl font-black gradient-text mb-2 sm:mb-3">10k+</div>
                  <div className="text-sm sm:text-base text-gray-400">Practice Sessions</div>
                </div>
                <div className="py-4">
                  <div className="text-4xl sm:text-5xl font-black gradient-text mb-2 sm:mb-3">98%</div>
                  <div className="text-sm sm:text-base text-gray-400">Success Rate</div>
                </div>
                <div className="py-4">
                  <div className="text-4xl sm:text-5xl font-black gradient-text mb-2 sm:mb-3">24/7</div>
                  <div className="text-sm sm:text-base text-gray-400">Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2026 InterviewDefender. Built for developers, by developers.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
