import PageHeader from "@/components/PageHeader";
import { faculty } from "@/data/site";

export const metadata = { title: "Faculty | Department of Pharmacy" };

export default function FacultyPage() {
  return (
    <>
      <PageHeader title="Faculty" subtitle="The teachers and researchers of the department." />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {faculty.map((f) => (
          <article key={f.email} className="panel">
            <div
              aria-hidden
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint font-serif text-lg font-semibold text-brand-dark"
            >
              {f.name.replace(/^Dr\.\s*/, "").charAt(0)}
            </div>
            <h2 className="text-lg font-semibold">{f.name}</h2>
            <p className="text-sm font-medium text-brand">{f.designation}</p>
            <dl className="mt-3 space-y-1 text-sm text-ink/75">
              <div><dt className="inline font-medium">Qualification: </dt><dd className="inline">{f.qualification}</dd></div>
              <div><dt className="inline font-medium">Area: </dt><dd className="inline">{f.specialization}</dd></div>
              <div><dt className="inline font-medium">Email: </dt><dd className="inline">{f.email}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
