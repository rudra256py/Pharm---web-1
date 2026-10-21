"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { AlumniProfile } from "@/lib/types";
import { DISCIPLINES } from "@/lib/constants";

function ProfileForm() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [existingId, setExistingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    batch: "",
    discipline: profile?.discipline ?? "dpharm",
    job_title: "",
    organization: "",
    city: "",
    bio: "",
    linkedin: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("alumni")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const a = data as AlumniProfile | null;
        if (!a) return;
        setExistingId(a.id);
        setForm({
          full_name: a.full_name,
          batch: a.batch,
          discipline: a.discipline ?? "dpharm",
          job_title: a.job_title ?? "",
          organization: a.organization ?? "",
          city: a.city ?? "",
          bio: a.bio ?? "",
          linkedin: a.linkedin ?? "",
        });
      });
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setMsg(null);
    const row = {
      user_id: user.id,
      full_name: form.full_name.trim(),
      batch: form.batch.trim(),
      discipline: form.discipline,
      job_title: form.job_title.trim() || null,
      organization: form.organization.trim() || null,
      city: form.city.trim() || null,
      bio: form.bio.trim() || null,
      linkedin: form.linkedin.trim() || null,
    };
    const { error } = existingId
      ? await supabase.from("alumni").update(row).eq("id", existingId)
      : await supabase.from("alumni").insert(row);
    setBusy(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
    } else {
      setMsg({ ok: true, text: "Profile saved." });
      router.push("/alumni");
    }
  }

  return (
    <form onSubmit={save} className="panel mx-auto max-w-xl space-y-4">
      <div>
        <label className="label" htmlFor="fn">Full name</label>
        <input id="fn" required className="input" value={form.full_name} onChange={set("full_name")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="batch">Batch (passing-out year)</label>
          <input id="batch" required className="input" placeholder="2026" value={form.batch} onChange={set("batch")} />
        </div>
        <div>
          <label className="label" htmlFor="disc">Programme</label>
          <select id="disc" className="input" value={form.discipline} onChange={set("discipline")}>
            {DISCIPLINES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="jt">Job title</label>
          <input id="jt" className="input" value={form.job_title} onChange={set("job_title")} />
        </div>
        <div>
          <label className="label" htmlFor="org">Organisation</label>
          <input id="org" className="input" value={form.organization} onChange={set("organization")} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="city">City</label>
        <input id="city" className="input" value={form.city} onChange={set("city")} />
      </div>
      <div>
        <label className="label" htmlFor="bio">Short bio</label>
        <textarea id="bio" rows={3} className="input" value={form.bio} onChange={set("bio")} />
      </div>
      <div>
        <label className="label" htmlFor="li">LinkedIn URL (optional)</label>
        <input id="li" type="url" className="input" placeholder="https://www.linkedin.com/in/..." value={form.linkedin} onChange={set("linkedin")} />
      </div>
      {msg && (
        <p className={`rounded-md p-3 text-sm ${msg.ok ? "bg-brand-tint text-brand-dark" : "bg-red-50 text-red-700"}`}>{msg.text}</p>
      )}
      <button className="btn-primary" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
    </form>
  );
}

export default function MyAlumniProfilePage() {
  return (
    <>
      <PageHeader title="My alumni profile" subtitle="This appears in the public Alumni Registry." />
      <div className="px-4 py-8">
        <RoleGuard allow={["alumni", "admin"]}>
          <ProfileForm />
        </RoleGuard>
      </div>
    </>
  );
}
