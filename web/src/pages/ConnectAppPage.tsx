import GithubAppConnect from "../components/GithubLogin";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

export default function ConnectAppPage() {
  const handleConnectSuccess = () => {
    // After connecting, redirect to dashboard
    // Note: The actual redirect happens in the component after GitHub callback
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="mx-auto max-w-screen-xl px-6 py-3 flex items-center justify-between">
          <span className="font-semibold text-[15px]">InterviewDefender</span>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Setup Required</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-xl text-center">
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-neutral-500">Signed In</span>
            </div>
            <div className="h-px w-12 bg-neutral-300" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm font-semibold">
                2
              </div>
              <span className="text-xs font-medium text-neutral-900">Connect App</span>
            </div>
            <div className="h-px w-12 bg-neutral-300" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-sm font-semibold">
                3
              </div>
              <span className="text-xs text-neutral-500">Ready</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[44px] font-bold tracking-tight leading-tight text-neutral-900">
            Connect GitHub App
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-[16px] leading-relaxed text-neutral-600">
            To unlock InterviewDefender, connect the GitHub App to access your repositories.
          </p>

          {/* CTA Button */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {API_BASE ? (
              <GithubAppConnect apiBase={API_BASE} onConnect={handleConnectSuccess} />
            ) : (
              <div className="text-red-600 text-sm">
                Missing API configuration
              </div>
            )}
            <p className="text-[13px] text-neutral-400">
              You'll choose which repositories to grant access to
            </p>
          </div>

          {/* Info Card */}
          <div className="mt-12 rounded-lg bg-neutral-50 border border-neutral-200 p-6 text-left">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-neutral-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-[14px] text-neutral-600">
                <p className="font-medium mb-2">What's the difference?</p>
                <ul className="space-y-2 text-neutral-500 text-[13px]">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                    <span><strong>OAuth Login:</strong> Authenticates your identity (completed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 flex-shrink-0 mt-0.5">→</span>
                    <span><strong>GitHub App:</strong> Grants access to your repositories for interview prep (current step)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 text-left">
            <h3 className="font-semibold text-[14px] text-neutral-900 mb-3">
              What happens next?
            </h3>
            <ol className="space-y-3 text-[13px] text-neutral-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-neutral-400 font-medium">1.</span>
                <span>You'll be redirected to GitHub</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-neutral-400 font-medium">2.</span>
                <span>Select which repositories InterviewDefender can access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-neutral-400 font-medium">3.</span>
                <span>Authorize the installation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-neutral-400 font-medium">4.</span>
                <span>Return here to start using InterviewDefender</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
