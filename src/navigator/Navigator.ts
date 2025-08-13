import { Page } from 'playwright';
import * as human from '../utils/human';

// Executes the flow defined in a playbook
export async function runPlaybookFlow(page: Page, playbook: any, query: string) {
  console.log('Running playbook flow...');

  for (const step of playbook.flows.search_and_open) {
    console.log(`Executing action: ${step.action}`);
    switch (step.action) {
      case 'goto':
        await page.goto(step.url, { timeout: 60000 });
        break;
      case 'wait_stable':
        await human.wait_stable(page, step.min_ms);
        break;
      case 'type':
        const text = step.text.replace('{{ query }}', query);
        await human.type(page, step.selector, text, step.delay_ms_range);
        break;
      case 'keypress':
        await page.press(step.selector, step.key);
        break;
      case 'human_scroll':
        await human.human_scroll(page, step.mode, step.steps);
        break;
      case 'click':
        await human.click(page, step.selector, step.human_like);
        break;
      default:
        console.warn(`Unknown action: ${step.action}`);
    }
  }
  console.log('Playbook flow finished.');
}

// Placeholder for handling consent and login before the main flow
export async function gotoAndConsentLogin(page: Page, job: any, profile: any) {
  console.log('Executing placeholder for gotoAndConsentLogin...');
  // In a real scenario, this would use playbook selectors to handle cookie banners or login forms.
  // For now, it does nothing.
  return;
}
