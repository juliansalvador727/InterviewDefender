export default function ConnectGitHubAppButton({
  apiBase,
}: {
  apiBase: string;
}) {
  async function connect() {
    const res = await fetch(`${apiBase}/api/v1/github/app/start`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    window.location.href = data.install_url;
  }

  return <button onClick={() => void connect()}>Connect GitHub App</button>;
}
