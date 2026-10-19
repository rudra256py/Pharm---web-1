export const DISCIPLINES = [
  { value: "dpharm", label: "D.Pharm" },
  { value: "bpharm", label: "B.Pharm" },
  { value: "mpharm", label: "M.Pharm" },
  { value: "phd", label: "Ph.D." },
] as const;

export type Role = "student" | "uploader" | "alumni" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  uploader: "Uploader",
  alumni: "Alumni",
  admin: "Admin",
};

export function disciplineLabel(value: string): string {
  if (value === "all") return "All disciplines";
  return DISCIPLINES.find((d) => d.value === value)?.label ?? value;
}

export const MAX_PDF_MB = 10;
export const MAX_IMAGE_MB = 5;

export function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
