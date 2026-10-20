"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/lib/types";
import { disciplineLabel, formatDate } from "@/lib/constants";
import { site } from "@/data/site";

const SECTIONS = [
  { href: "/notices", title: "Notices", text: "Exam dates, circulars and announcements from the department." },
  { href: "/lecture-notes", title: "Lecture Notes", text: "PDF notes uploaded by your class representatives and faculty. Login required." },
  { href: "/alumni", title: "Alumni", text: "Find graduates of the department and see where they work." },
  { href: "/gallery", title: "Gallery", text: "Photos from department events and activities." },
];

export default function HomePage() {
  const [notices, setNotices] = useState<Notice[] | null>(null);

  useEffect(() => {
    supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => setNotices((data as Notice[]) ?? []));
  }, []);

  return (
    <>
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="text-sm font-medium text-brand">{site.university}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-brand-dark sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink/75">{site.tagline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/notices" className="btn-primary">Read latest notices</Link>
              <Link href="/lecture-notes" className="btn-ghost">Open lecture notes</Link>
            </div>
          </div>

          {/* Prescription-slip style notice board: the one memorable element of the site */}
          <div className="relative rounded-lg border-2 border-dashed border-brand/40 bg-paper p-6">
            <span aria-hidden className="absolute right-5 top-3 font-serif text-5xl font-bold text-amber/70">℞</span>
            <h2 className="text-xl font-semibold text-brand-dark">On the notice board</h2>
            <div className="mt-4 divide-y divide-ink/10">
              {notices === null && <p className="py-3 text-sm text-ink/60">Loading notices…</p>}
              {notices?.length === 0 && (
                <p className="py-3 text-sm text-ink/60">No notices yet. New announcements will appear here.</p>
              )}
              {notices?.map((n) => (
                <Link key={n.id} href="/notices" className="block py-3 hover:text-brand">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-ink/60">
                    {formatDate(n.created_at)} · {disciplineLabel(n.discipline)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <h2 className="text-2xl font-semibold text-brand-dark">Find what you need</h2>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="border-l-4 border-amber pl-4 hover:border-brand">
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-ink/70">{s.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
