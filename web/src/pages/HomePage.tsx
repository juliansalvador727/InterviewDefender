import GithubOAuthLogin from "../components/GithubOAuthLogin";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero Section */}
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-xl text-center">
          {/* Heading */}
          <h1 className="text-[48px] font-bold tracking-tight leading-tight text-neutral-900">
            InterviewDefender
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-[18px] leading-relaxed text-neutral-600">
            Prepare for interviews with repo-aware simulations and
            evidence-backed feedback.
          </p>

          {/* CTA Button */}
          <div className="mt-12 flex flex-col items-center gap-4">
            {API_BASE ? (
              <GithubOAuthLogin apiBase={API_BASE} />
            ) : (
              <div className="text-red-600 text-sm">
                Missing API configuration. Please set VITE_API_BASE_URL.
              </div>
            )}
            <p className="text-[13px] text-neutral-400">
              Sign in with GitHub to get started
            </p>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-6 text-left">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-neutral-900 p-2 text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-neutral-900">
                    Repo-Aware Interviews
                  </h3>
                  <p className="mt-1 text-[13px] text-neutral-600">
                    Practice interviews based on your actual codebase and projects
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-neutral-900 p-2 text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-neutral-900">
                    Evidence-Backed Feedback
                  </h3>
                  <p className="mt-1 text-[13px] text-neutral-600">
                    Get detailed feedback grounded in your repository context
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-neutral-900 p-2 text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-neutral-900">
                    Secure & Private
                  </h3>
                  <p className="mt-1 text-[13px] text-neutral-600">
                    Your code stays private. You control which repos we can access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
