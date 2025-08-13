import { Page } from 'playwright';

// Placeholder for human-like interaction primitives

export async function wait_stable(page: Page, min_ms: number = 1000) {
  console.log(`Waiting for network idle and DOM stability for ${min_ms}ms...`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(min_ms); // Simple wait for now
}

export async function human_scroll(page: Page, mode: string = 'paged', steps: number = 1) {
  console.log(`Scrolling like a human (${mode}, ${steps} steps)...`);
  for (let i = 0; i < steps; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8));
    await page.waitForTimeout(Math.random() * 1000 + 200);
  }
}

export async function click(page: Page, selector: string, human_like: boolean = true) {
  console.log(`Clicking selector: ${selector}`);
  if (human_like) {
    const element = await page.waitForSelector(selector);
    await element.hover({ trial: true });
    await page.mouse.down();
    await page.waitForTimeout(Math.random() * 100 + 50);
    await page.mouse.up();
  } else {
    await page.click(selector);
  }
}

export async function type(page: Page, selector: string, text: string, delay_range: [number, number] = [80, 160]) {
  console.log(`Typing '${text}' into selector: ${selector}`);
  await page.type(selector, text, { delay: Math.random() * (delay_range[1] - delay_range[0]) + delay_range[0] });
}
