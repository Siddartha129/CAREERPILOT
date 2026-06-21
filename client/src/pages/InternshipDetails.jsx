import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { applicationApi, internshipApi, materialApi, skillGapApi } from "../api/queries.js";
import { Button } from "../components/Button.jsx";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { LoadingState } from "../components/LoadingState.jsx";

export function InternshipDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const internshipsQuery = useQuery({ queryKey: ["internships"], queryFn: internshipApi.list });
  const gapQuery = useQuery({ queryKey: ["skill-gap", id], queryFn: () => skillGapApi.get(id), retry: false });
  const versionsQuery = useQuery({ queryKey: ["resume-versions"], queryFn: materialApi.list });
  const generate = useMutation({ mutationFn: () => materialApi.generate(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["resume-versions"] }); queryClient.invalidateQueries({ queryKey: ["applications"] }); } });
  const approve = useMutation({ mutationFn: materialApi.approve, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume-versions"] }) });
  const apply = useMutation({ mutationFn: applicationApi.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["applications"] }); queryClient.invalidateQueries({ queryKey: ["notifications"] }); } });
  const internship = useMemo(() => (internshipsQuery.data?.internships || []).find((item) => String(item._id) === String(id)), [internshipsQuery.data, id]);
  const version = (versionsQuery.data?.resumeVersions || []).find((item) => String(item.internshipId) === String(id));

  if (internshipsQuery.isLoading) return <LoadingState label="Loading internship..." />;
  if (!internship) return <ErrorBanner error={{ message: "Internship not found" }} />;

  return (
    <div className="space-y-5">
      <ErrorBanner error={internshipsQuery.error || gapQuery.error || versionsQuery.error || generate.error || approve.error || apply.error} />
      <section className="card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-3xl font-black">{internship.title}</h2>
            <p className="font-semibold text-ink/65">{internship.company} · {internship.location}</p>
          </div>
          <span className="rounded-md bg-moss/10 px-3 py-2 text-sm font-black text-moss">{internship.match ? `${internship.match.score}% match` : "No match yet"}</span>
        </div>
        <p className="mt-4 text-ink/75">{internship.description}</p>
        {internship.match ? <div className="mt-4 grid gap-3 sm:grid-cols-2"><SkillBox title="Matched" items={internship.match.matchedSkills} /><SkillBox title="Missing" items={internship.match.missingSkills} /></div> : null}
      </section>

      <section className="card p-5">
        <h3 className="text-xl font-black">Skill Gaps</h3>
        <div className="mt-3 grid gap-3">
          {(gapQuery.data?.skillGap || []).length === 0 ? <p className="text-sm text-ink/60">No skill gaps available yet.</p> : gapQuery.data.skillGap.map((gap) => (
            <div key={gap.skill} className="rounded-md border border-ink/10 p-3">
              <p className="font-black">{gap.skill} · {gap.priority}</p>
              <p className="text-sm text-ink/70">{gap.suggestedAction}</p>
              <p className="text-sm font-semibold text-moss">{gap.miniProject}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-black">Resume Version</h3>
          <Button onClick={() => generate.mutate()} disabled={generate.isPending}>{generate.isPending ? "Generating..." : "Generate Tailored Resume"}</Button>
        </div>
        {version ? (
          <div className="mt-4 space-y-3">
            <ul className="list-disc pl-5 text-sm text-ink/75">{version.changeSummary.map((line) => <li key={line}>{line}</li>)}</ul>
            <pre className="max-h-96 overflow-auto rounded-md bg-ink p-4 text-sm text-white">{version.content}</pre>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => materialApi.openPdf(version._id)}>View PDF</Button>
              <Button variant="secondary" onClick={() => approve.mutate(version._id)} disabled={version.approved}>{version.approved ? "Approved" : "Approve"}</Button>
              <Button onClick={() => { apply.mutate({ internshipId: id, status: "APPLIED" }); window.open(internship.applyLink, "_blank", "noopener,noreferrer"); }}><ExternalLink size={16} />Apply with updated resume</Button>
            </div>
          </div>
        ) : <p className="mt-3 text-sm text-ink/60">No tailored resume generated yet.</p>}
      </section>
    </div>
  );
}

function SkillBox({ title, items = [] }) {
  return <div className="rounded-md border border-ink/10 p-3"><p className="font-black">{title}</p><div className="mt-2 flex flex-wrap gap-2">{items.length ? items.map((item) => <span key={item} className="rounded-md bg-ink/5 px-2 py-1 text-xs font-bold">{item}</span>) : <span className="text-sm text-ink/55">None</span>}</div></div>;
}
