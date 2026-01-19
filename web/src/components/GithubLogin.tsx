export default function ConnectGitHubAppButton({
  apiBase,
  token,
}: {
  apiBase: string;
  token: string;
}) {
  async function connect() {
    console.log("CONNECT CLICKED", { apiBase, tokenLen: token?.length });
    alert("connect clicked"); // temporary

    const res = await fetch(`${apiBase}/api/v1/github/app/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    console.log("START RES", res.status);
    const text = await res.text();
    console.log("START BODY", text);

    if (!res.ok) throw new Error(text);
    const { install_url } = JSON.parse(text);
    window.location.href = install_url;
  }

  return (
    <button onClick={connect} disabled={!token}>
      Connect GitHub App
    </button>
  );
}
