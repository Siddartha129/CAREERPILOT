import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { applicationApi } from "../api/queries.js";
import { Button } from "../components/Button.jsx";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { StatusPill } from "../components/StatusPill.jsx";
import { formatDate } from "../utils/format.js";

const statuses = ["SAVED", "PREPARING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function ApplicationTracker() {
  const queryClient = useQueryClient();
  const appsQuery = useQuery({ queryKey: ["applications"], queryFn: applicationApi.list });
  const update = useMutation({ mutationFn: applicationApi.update, onSuccess: () => invalidate(queryClient) });
  const remove = useMutation({ mutationFn: applicationApi.remove, onSuccess: () => invalidate(queryClient) });
  if (appsQuery.isLoading) return <LoadingState label="Loading tracker..." />;
  const apps = appsQuery.data?.applications || [];

  return (
    <div className="space-y-4">
      <ErrorBanner error={appsQuery.error || update.error || remove.error} />
      <h2 className="text-3xl font-black">Application Tracker</h2>
      <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {statuses.map((status) => (
          <section key={status} className="card min-h-48 p-3">
            <div className="mb-3"><StatusPill status={status} /></div>
            <div className="space-y-3">
              {apps.filter((app) => app.status === status).map((app) => (
                <article key={app._id} className="rounded-md border border-ink/10 bg-white p-3">
                  <h3 className="font-black">{app.internship?.title}</h3>
                  <p className="text-sm text-ink/60">{app.internship?.company}</p>
                  <p className="mt-1 text-xs font-semibold">Next: {formatDate(app.nextActionDate)}</p>
                  <select className="mt-3 w-full rounded-md border border-ink/15 px-2 py-1 text-sm" value={app.status} onChange={(e) => update.mutate({ id: app._id, status: e.target.value })}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
                  <textarea className="mt-2 w-full rounded-md border border-ink/15 px-2 py-1 text-sm" defaultValue={app.notes} onBlur={(e) => update.mutate({ id: app._id, notes: e.target.value })} />
                  <Button className="mt-2 w-full" variant="secondary" onClick={() => confirm("Delete this application?") && remove.mutate(app._id)}><Trash2 size={15} />Delete</Button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function invalidate(queryClient) {
  ["applications", "analytics", "notifications"].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
}
