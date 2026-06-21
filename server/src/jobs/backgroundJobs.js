import cron from "node-cron";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env.js";
import { repo } from "../services/repository.js";
import { syncInternshipsForProfile, regenerateMatches } from "../services/pipelineService.js";
import { createNotification } from "../controllers/notificationController.js";

export function startQueues() {
  if (!env.UPSTASH_REDIS_URL) return null;
  const connection = new IORedis(env.UPSTASH_REDIS_URL, { maxRetriesPerRequest: null });
  return new Queue("careerpilot-background", { connection });
}

export function startCronJobs() {
  cron.schedule("0 */6 * * *", async () => {
    try { await syncInternshipsForProfile(null); } catch (error) { console.warn(error.message); }
  });
  cron.schedule("0 2 * * *", async () => {
    try {
      const profiles = await repo.getAll("profiles");
      for (const profile of profiles) if (profile.resumeText) await regenerateMatches(profile.userId, profile);
    } catch (error) { console.warn(error.message); }
  });
  cron.schedule("0 * * * *", async () => {
    try {
      const apps = await repo.getAll("applications");
      for (const app of apps.filter((item) => item.status === "APPLIED" && item.appliedAt && Date.now() - new Date(item.appliedAt).getTime() > 7 * 24 * 60 * 60 * 1000)) {
        await createNotification(app.userId, "Follow-up reminder", "One applied role has been waiting more than 7 days. Consider following up.");
      }
    } catch (error) { console.warn(error.message); }
  });
}
