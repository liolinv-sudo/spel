import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-moss mb-3">
          Field Notes
        </p>
        <h1 className="font-display text-3xl mb-6">Sign in to write.</h1>

        {sent ? (
          <p className="text-sm text-ink/70 border-l-2 border-moss pl-4">
            Check {email} for a sign-in link.
          </p>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-moss"
            />
            <button
              type="submit"
              className="w-full bg-ink text-paper py-3 text-sm font-medium hover:bg-moss transition-colors"
            >
              Send magic link
            </button>
            {error && <p className="text-sm text-clay">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
