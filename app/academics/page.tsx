import PageHeader from "@/components/PageHeader";
import { programs } from "@/data/site";

export const metadata = { title: "Academics | Department of Pharmacy" };

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        title="Academics"
        subtitle="Programmes offered by the department. Contact the department office for admission and syllabus details."
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {programs.map((p) => (
            <div key={p.name} className="grid gap-1 p-5 sm:grid-cols-[10rem_1fr_9rem] sm:items-center">
              <h2 className="text-xl font-semibold text-brand-dark">{p.name}</h2>
              <p className="text-sm text-ink/75">{p.summary}</p>
              <p className="text-sm font-medium sm:text-right">{p.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
