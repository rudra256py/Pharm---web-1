"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { GalleryItem } from "@/lib/types";

export default function GalleryPage() {
  const { profile } = useAuth();
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  async function load() {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as GalleryItem[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(item: GalleryItem) {
    if (!confirm("Delete this photo?")) return;
    await supabase.storage.from("gallery").remove([item.image_path]);
    await supabase.from("gallery").delete().eq("id", item.id);
    load();
  }

  return (
    <>
      <PageHeader title="Gallery" subtitle="Moments from department events and activities." />
      <div className="mx-auto max-w-6xl px-4 py-10">
        {items === null && <p className="text-sm text-ink/60">Loading photos…</p>}
        {items?.length === 0 && (
          <p className="panel text-sm text-ink/70">
            No photos yet. The admin can add photos from the Admin page.
          </p>
        )}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items?.map((it) => {
            const url = supabase.storage.from("gallery").getPublicUrl(it.image_path).data.publicUrl;
            return (
              <figure key={it.id} className="mb-4 break-inside-avoid overflow-hidden rounded-lg border border-ink/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={it.title} loading="lazy" className="w-full" />
                <figcaption className="flex items-center justify-between gap-2 p-3 text-sm">
                  <span>{it.title}</span>
                  {profile?.role === "admin" && (
                    <button className="btn-danger" onClick={() => remove(it)}>Delete</button>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </>
  );
}
