export default function LoginWithGitHubButton({
  apiBase,
}: {
  apiBase: string;
}) {
  return (
    <a href={`${apiBase}/auth/github/login`}>
      <button>Continue with GitHub</button>
    </a>
  );
}
