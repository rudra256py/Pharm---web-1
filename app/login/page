"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { supabase, isConfigured } from "@/lib/supabase";
import { DISCIPLINES } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [discipline, setDiscipline] = useState("dpharm");
  const [requestedRole, setRequestedRole] = useState("student");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      router.push("/");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim(), discipline, requested_role: requestedRole },
      },
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    if (data.session) {
      router.push("/");
    } else {
      setMsg({
        ok: true,
        text: "Account created. Check your email and click the confirmation link, then log in.",
      });
      setMode("login");
    }
  }

  return (
    <>
      <PageHeader
        title={mode === "login" ? "Login" : "Create an account"}
        subtitle="Students and alumni can sign up here. Uploader access (class representatives and faculty) is given by the department admin."
      />
      <div className="px-4 py-8">
        <form onSubmit={submit} className="panel mx-auto max-w-md space-y-4">
          {!isConfigured && (
            <p className="rounded-md bg-amber-soft p-3 text-sm">
              Supabase keys are not set yet. Add them in Vercel, then redeploy.
            </p>
          )}

          {mode === "signup" && (
            <>
              <div>
                <label className="label" htmlFor="name">Full name</label>
                <input id="name" required className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="disc">Programme</label>
                  <select id="disc" className="input" value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
                    {DISCIPLINES.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="role">I am a</label>
                  <select id="role" className="input" value={requestedRole} onChange={(e) => setRequestedRole(e.target.value)}>
                    <option value="student">Current student</option>
                    <option value="alumni">Alumni / graduating student</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "signup" && <p className="mt-1 text-xs text-ink/60">At least 6 characters.</p>}
          </div>

          {msg && (
            <p className={`rounded-md p-3 text-sm ${msg.ok ? "bg-brand-tint text-brand-dark" : "bg-red-50 text-red-700"}`}>{msg.text}</p>
          )}

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>

          <p className="text-center text-sm text-ink/70">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-brand underline"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setMsg(null);
              }}
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
