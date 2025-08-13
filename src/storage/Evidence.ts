import { Page } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

// Manages storing evidence like snapshots and logs

export async function snapshot(page: Page, job: any) {
  const path = `artifacts/${job.site}-${Date.now()}.png`;
  console.log(`Taking full-page snapshot to: ${path}`);
  mkdirSync('artifacts', { recursive: true });
  await page.screenshot({ path, fullPage: true });
}

export async function storeArtifacts(job: any, recordingPath: string, logs: any) {
  console.log('Storing all artifacts...');
  // This would upload to S3/MinIO and save metadata
  const metadata = {
    job,
    recordingPath,
    snapshotPath: `artifacts/${job.site}-${Date.now()}.png`,
    logs,
    timestamp: new Date().toISOString(),
  };
  writeFileSync(`artifacts/${job.site}-metadata.json`, JSON.stringify(metadata, null, 2));
  console.log('Artifacts stored.');
}
