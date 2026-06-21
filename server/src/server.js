import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { seedInitialData } from "./services/seedService.js";
import { startCronJobs, startQueues } from "./jobs/backgroundJobs.js";

async function startServer() {
  await connectDatabase();
  await seedInitialData();
  startQueues();
  startCronJobs();
  app.listen(env.PORT, () => {
    console.log(`CareerPilot AI API running on http://localhost:${env.PORT}/api`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
