import { chromium } from 'playwright-extra';
import { Browser } from 'playwright';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { scanSelectors } from './explorer/scanner';
import { generatePlaybook } from './explorer/generator';
import { writePlaybookFile } from './explorer/output';
import { URL } from 'url';

interface CliArgs {
  url: string;
}

export function parseArgs(): CliArgs {
  const argv = yargs(hideBin(process.argv))
    .option('url', {
      type: 'string',
      demandOption: true,
      describe: 'Target URL to explore',
    })
    .strict()
    .help()
    .parseSync();

  return { url: argv.url as string };
}

export async function runExplorer(urlString: string): Promise<void> {
  let browser: Browser | null = null;

  try {
    const url = new URL(urlString);
    console.log(`Starting Explorer Mode for: ${url.href}`);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url.href, { waitUntil: 'networkidle', timeout: 45000 });

    const { consentSelectors, searchSelectors } = await scanSelectors(page);

    console.log('Generating draft playbook...');
    const playbookYaml = generatePlaybook(url, consentSelectors, searchSelectors);
    const fileName = `draft-${url.hostname.replace(/ww/g, '')}.yaml`;
    const filePath = `playbooks/${fileName}`;
    await writePlaybookFile(filePath, playbookYaml);

    console.log('\n----------------------------------------');
    console.log('✨ Explorer Mode Finished! ✨');
    console.log(`\nDraft playbook created at: ${filePath}`);
    console.log('Please review the file and adjust selectors before use.');
    console.log('----------------------------------------');
  } catch (error) {
    console.error('An error occurred during Explorer Mode:', error);
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed.');
      } catch (closeError) {
        console.error('Failed to close browser:', closeError);
      }
    }
  }
}

if (require.main === module) {
  const { url } = parseArgs();
  runExplorer(url).catch(() => process.exit(1));
}
