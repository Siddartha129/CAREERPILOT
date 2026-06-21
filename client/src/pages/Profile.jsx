import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/queries.js";
import { Button } from "../components/Button.jsx";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Field, inputClass } from "../components/Field.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { ResumeUploadCard } from "../components/ResumeUploadCard.jsx";
import { formatDate } from "../utils/format.js";

const keysToInvalidate = [["profile"], ["profile-history"], ["internships"], ["matches"], ["resume-versions"], ["applications"], ["notifications"], ["analytics"]];

export function Profile() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const historyQuery = useQuery({ queryKey: ["profile-history"], queryFn: profileApi.history });
  const uploadMutation = useMutation({
    mutationFn: profileApi.uploadResume,
    onSuccess() {
      keysToInvalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    }
  });
  const prefsMutation = useMutation({
    mutationFn: profileApi.updatePreferences,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });

  if (profileQuery.isLoading) return <LoadingState label="Loading profile..." />;
  const profile = profileQuery.data?.profile;

  function savePrefs(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    prefsMutation.mutate({
      roles: form.get("roles"),
      location: form.get("location"),
      workMode: form.get("workMode"),
      stipendRange: form.get("stipendRange")
    });
  }

  return (
    <div className="space-y-6">
      <ErrorBanner error={profileQuery.error || uploadMutation.error || prefsMutation.error} />
      <ResumeUploadCard onUpload={(file) => uploadMutation.mutate(file)} uploading={uploadMutation.isPending} result={uploadMutation.data} />

      <section className="card p-5">
        <h2 className="text-xl font-black">Extracted Profile</h2>
        <ChipList title="Skills" items={profile?.skills} />
        <TextList title="Projects" items={profile?.projects} />
        <TextList title="Experience" items={profile?.experience} />
        <TextList title="Education" items={profile?.education} />
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-black">Preferences</h2>
        <form onSubmit={savePrefs} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Roles"><input className={inputClass} name="roles" defaultValue={(profile?.preferences?.roles || []).join(", ")} /></Field>
          <Field label="Location"><input className={inputClass} name="location" defaultValue={profile?.preferences?.location || ""} /></Field>
          <Field label="Work mode"><input className={inputClass} name="workMode" defaultValue={profile?.preferences?.workMode || ""} /></Field>
          <Field label="Stipend range"><input className={inputClass} name="stipendRange" defaultValue={profile?.preferences?.stipendRange || ""} /></Field>
          <Button className="sm:col-span-2" disabled={prefsMutation.isPending}>{prefsMutation.isPending ? "Saving..." : "Save Preferences"}</Button>
        </form>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-black">Resume History</h2>
        <div className="mt-4 space-y-3">
          {(historyQuery.data?.history || []).length === 0 ? <p className="text-sm text-ink/60">No previous resumes archived yet.</p> : null}
          {(historyQuery.data?.history || []).map((item) => (
            <article key={item._id} className="rounded-md border border-ink/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black">{item.label}</h3>
                <span className="text-sm font-semibold text-ink/60">Replaced {formatDate(item.supersededAt)}</span>
              </div>
              <p className="mt-2 text-sm text-ink/70">{item.summary}</p>
              <ChipList title="Archived skills" items={item.skills} />
              <p className="mt-2 text-sm font-bold">{item.matchCount} matches, {item.highMatchCount} high matches, {item.resumeVersionCount} resume versions</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChipList({ title, items = [] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-black uppercase text-ink/55">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <span key={item} className="rounded-md bg-moss/10 px-2 py-1 text-sm font-bold text-moss">{item}</span>) : <span className="text-sm text-ink/55">None yet</span>}
      </div>
    </div>
  );
}

function TextList({ title, items = [] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-black uppercase text-ink/55">{title}</h3>
      {items.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/75">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-ink/55">None yet</p>}
    </div>
  );
}
