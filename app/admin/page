"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { DISCIPLINES, MAX_IMAGE_MB, ROLE_LABELS, safeFileName, type Role } from "@/lib/constants";

type Msg = { ok: boolean; text: string } | null;

function UsersPanel() {
  const { user } = useAuth();
  const [people, setPeople] = useState<Profile[] | null>(null);
  const [edits, setEdits] = useState<Record<string, { role: Role; discipline: string }>>({});
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState<Msg>(null);

  async function load() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setPeople((data as Profile[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(p: Profile) {
    const e = edits[p.id];
    if (!e) return;
    setMsg(null);
    const { error } = await supabase.from("profiles").update({ role: e.role, discipline: e.discipline }).eq("id", p.id);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: `Updated ${p.full_name || p.email}.` });
    setEdits((prev) => {
      const next = { ...prev };
      delete next[p.id];
      return next;
    });
    load();
  }

  const q = query.trim().toLowerCase();
  const shown = (people ?? []).filter((p) =>
    !q ? true : [p.full_name, p.email].some((v) => v?.toLowerCase().includes(q))
  );

  return (
    <section className="panel">
      <h2 className="text-xl font-semibold text-brand-dark">Manage users</h2>
      <p className="mt-1 text-sm text-ink/70">
        Give class representatives and faculty the <strong>Uploader</strong> role and set their programme. They can then
        post notices and upload PDFs for that programme only.
      </p>
      <div className="mt-4 max-w-sm">
        <label className="label" htmlFor="uq">Search by name or email</label>
        <input id="uq" className="input" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {msg && (
        <p className={`mt-4 rounded-md p-3 text-sm ${msg.ok ? "bg-brand-tint text-brand-dark" : "bg-red-50 text-red-700"}`}>{msg.text}</p>
      )}
      {people === null && <p className="mt-4 text-sm text-ink/60">Loading users…</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-ink/70">
            <tr>
              <th className="py-2 pr-3 font-medium">Name</th>
              <th className="py-2 pr-3 font-medium">Email</th>
              <th className="py-2 pr-3 font-medium">Role</th>
              <th className="py-2 pr-3 font-medium">Programme</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {shown.map((p) => {
              const cur = edits[p.id] ?? { role: p.role, discipline: p.discipline };
              const changed = cur.role !== p.role || cur.discipline !== p.discipline;
              const isMe = p.id === user?.id;
              return (
                <tr key={p.id}>
                  <td className="py-2 pr-3">{p.full_name || "-"}</td>
                  <td className="py-2 pr-3">{p.email}</td>
                  <td className="py-2 pr-3">
                    <select
                      aria-label={`Role for ${p.email}`}
                      className="input !py-1"
                      value={cur.role}
                      disabled={isMe}
                      onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...cur, role: e.target.value as Role } }))}
                    >
                      {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      aria-label={`Programme for ${p.email}`}
                      className="input !py-1"
                      value={cur.discipline}
                      onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...cur, discipline: e.target.value } }))}
                    >
                      {DISCIPLINES.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 text-right">
                    <button className="btn-primary !px-3 !py-1.5" disabled={!changed} onClick={() => save(p)}>Save</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function GalleryPanel() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const { user } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !user) return setMsg({ ok: false, text: "Choose an image first." });
    if (!file.type.startsWith("image/")) return setMsg({ ok: false, text: "Only image files are allowed." });
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return setMsg({ ok: false, text: `Image is larger than ${MAX_IMAGE_MB} MB.` });

    setBusy(true);
    setMsg(null);
    const path = `${Date.now()}-${safeFileName(file.name)}`;
    const up = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type });
    if (up.error) {
      setBusy(false);
      return setMsg({ ok: false, text: up.error.message });
    }
    const ins = await supabase.from("gallery").insert({ title: title.trim(), image_path: path, uploaded_by: user.id });
    setBusy(false);
    if (ins.error) {
      await supabase.storage.from("gallery").remove([path]);
      return setMsg({ ok: false, text: ins.error.message });
    }
    setMsg({ ok: true, text: "Photo added to the gallery." });
    setTitle("");
    setFile(null);
    const input = document.getElementById("img") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  return (
    <form onSubmit={submit} className="panel max-w-xl space-y-4">
      <h2 className="text-xl font-semibold text-brand-dark">Add a gallery photo</h2>
      <div>
        <label className="label" htmlFor="gt">Caption</label>
        <input id="gt" required className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="img">Image (max {MAX_IMAGE_MB} MB)</label>
        <input id="img" type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      {msg && (
        <p className={`rounded-md p-3 text-sm ${msg.ok ? "bg-brand-tint text-brand-dark" : "bg-red-50 text-red-700"}`}>{msg.text}</p>
      )}
      <button className="btn-primary" disabled={busy}>{busy ? "Uploading…" : "Add photo"}</button>
    </form>
  );
}

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Admin" subtitle="Manage who can upload, and keep the gallery up to date." />
      <RoleGuard allow={["admin"]}>
        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
          <UsersPanel />
          <GalleryPanel />
        </div>
      </RoleGuard>
    </>
  );
}
