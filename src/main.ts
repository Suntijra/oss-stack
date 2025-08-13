import * as dotenv from 'dotenv';
import { runAgenticJob } from './orchestrator/worker';

// Load environment variables from .env file
dotenv.config();

// Main entry point for running an agentic job.
async function main() {
  // This is the high-level goal we want the agent to achieve.
  // It's taken from the user's request.
  const goal = 'Go to dooball666.live and find the video for the Thailand vs China (W) football match.';

  if (!process.env.GEMINI_API_KEY) {
    console.warn('----------------------------------------');
    console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in .env file.');
    console.warn('The agent will run in SIMULATED mode.');
    console.warn('----------------------------------------');
  }

  await runAgenticJob(goal);

  console.log('Main process finished.');
}

main();