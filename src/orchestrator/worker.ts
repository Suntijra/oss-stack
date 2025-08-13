import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'playwright';
import { determineNextAction } from '../agent/LLMAgent';
import { Action, TypeAction } from '../types';
import * as human from '../utils/human';

// Apply stealth plugin
chromium.use(StealthPlugin());

/**
 * Executes a single action determined by the LLM agent.
 * @param page The Playwright page object.
 * @param action The action to execute.
 */
async function executeAction(page: Page, action: Action): Promise<void> {
  const anyPage: any = page;
  console.log(`Executing action: ${action.action}`);
  switch (action.action) {
    case 'goto':
      await anyPage.goto(action.url, { timeout: 60000 });
      break;
    case 'wait_stable':
      await human.wait_stable(anyPage, action.min_ms);
      break;
    case 'keypress':
      // The selector is optional for keypress, it can be on the whole page
      const target = action.selector ? anyPage.locator(action.selector) : anyPage;
      await target.press(action.key);
      break;
    case 'click':
      await human.click(anyPage, action.selector);
      break;
    case 'human_scroll':
      await human.human_scroll(anyPage, action.mode, action.steps);
      break;
    case 'finish':
      console.log(`Agent finished job with reason: ${action.reason}`);
      break;
    default:
      const _exhaustiveCheck: never = action;
      throw new Error(`Unknown action: ${(_exhaustiveCheck as Action).action}`);
  }
}

/**
 * Runs a job using the ReAct Agentic model.
 * @param goal The high-level goal for the agent.
 */
export async function runAgenticJob(goal: string) {
  console.log(`🚀 Starting new agentic job with goal: "${goal}"`);
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    const MAX_STEPS = 10; // Safety break to prevent infinite loops
    for (let i = 0; i < MAX_STEPS; i++) {
      console.log(`
--- Step ${i + 1}/${MAX_STEPS} ---
      `);
      const nextAction = await determineNextAction(goal, page);

      await executeAction(page, nextAction);

      if (nextAction.action === 'finish') {
        break;
      }

      // Add a small delay to make the browser actions more observable
      await page.waitForTimeout(1000);
    }

  } catch (error) {
    console.error('A critical error occurred in the agentic job:', error);
  } finally {
    console.log('Cleaning up agent session...');
    if (browser) {
      await browser.close();
    }
  }
}