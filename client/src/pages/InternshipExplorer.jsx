import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { applicationApi, internshipApi, matchApi } from "../api/queries.js";
import { Button } from "../components/Button.jsx";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { LoadingState } from "../components/LoadingState.jsx";

export function InternshipExplorer() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const queryClient = useQueryClient();
  const internshipsQuery = useQuery({ queryKey: ["internships"], queryFn: internshipApi.list });
  const sync = useMutation({ mutationFn: internshipApi.sync, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["internships"] }) });
  const generate = useMutation({ mutationFn: matchApi.generate, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["internships"] }) });
  const apply = useMutation({ mutationFn: applicationApi.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["applications"] }); queryClient.invalidateQueries({ queryKey: ["notifications"] }); } });
  const internships = internshipsQuery.data?.internships || [];
  const filtered = useMemo(() => internships
    .filter((item) => source === "all" || item.source === source)
    .filter((item) => `${item.title} ${item.company} ${item.skillsRequired?.join(" ")}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0)), [internships, search, source]);
  const sources = ["all", ...new Set(internships.map((item) => item.source).filter(Boolean))];

  if (internshipsQuery.isLoading) return <LoadingState label="Loading internships..." />;
  return (
    <div className="space-y-5">
      <ErrorBanner error={internshipsQuery.error || sync.error || generate.error || apply.error} />
      <section className="card p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-black">Internship Explorer</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => sync.mutate()} disabled={sync.isPending}>Sync</Button>
            <Button onClick={() => generate.mutate()} disabled={generate.isPending}>Generate Matches</Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px]">
          <label className="flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3"><Search size={16} /><input className="w-full py-2 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles, companies, skills" /></label>
          <select className="rounded-md border border-ink/15 bg-white px-3 py-2" value={source} onChange={(e) => setSource(e.target.value)}>{sources.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </section>
      <div className="grid gap-4">
        {filtered.map((item) => (
          <article key={item._id} className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="font-semibold text-ink/65">{item.company} · {item.location} · {item.source}</p>
                <p className="mt-2 text-sm text-ink/70">{item.description}</p>
              </div>
              <span className="rounded-md bg-moss/10 px-3 py-2 text-sm font-black text-moss">{item.match ? `${item.match.score}%` : "No match"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">{(item.skillsRequired || []).map((skill) => <span key={skill} className="rounded-md bg-ink/5 px-2 py-1 text-xs font-bold">{skill}</span>)}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`/internships/${item._id}`}><Button variant="secondary">Details</Button></Link>
              <Button onClick={() => { apply.mutate({ internshipId: item._id, status: "APPLIED" }); window.open(item.applyLink, "_blank", "noopener,noreferrer"); }}><ExternalLink size={16} />Apply</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
