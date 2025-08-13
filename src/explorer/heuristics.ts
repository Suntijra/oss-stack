import { Page } from 'playwright';

// Heuristics to find common selectors on a page.

const CONSENT_TEXTS = ['Accept', 'Agree', 'Consent', 'OK', 'Allow', 'I agree', 'ยอมรับ', 'ตกลง'];
const SEARCH_ATTRIBUTES = ['search', 'q', 's', 'query', 'keyword'];

/**
 * Tries to find selectors for cookie consent buttons.
 * @param page The Playwright Page object.
 * @returns A list of potential CSS selectors for consent buttons.
 */
export async function findConsentSelectors(page: Page): Promise<string[]> {
  const selectors = new Set<string>();

  for (const text of CONSENT_TEXTS) {
    const textSelector = `button:has-text('${text}'), a:has-text('${text}'), [role="button"]:has-text('${text}')`;
    const elements = await page.locator(textSelector).all();
    if (elements.length > 0) {
      // Attempt to create a more specific selector if possible
      for (const el of elements) {
        const id = await el.getAttribute('id');
        if (id) {
          selectors.add(`#${id}`);
        }
        const classNames = await el.getAttribute('class');
        if (classNames) {
          const stableClass = classNames.split(' ').find(c => !c.includes(':') && c.length > 3);
          if (stableClass) {
            selectors.add(`.${stableClass}:has-text('${text}')`);
          }
        }
      }
      selectors.add(textSelector.split(', ')[0]); // Add the simple text selector as a fallback
    }
  }

  return Array.from(selectors);
}

/**
 * Tries to find selectors for search input fields.
 * @param page The Playwright Page object.
 * @returns A list of potential CSS selectors for search inputs.
 */
export async function findSearchSelectors(page: Page): Promise<string[]> {
  const selectors = new Set<string>();

  for (const attr of SEARCH_ATTRIBUTES) {
    selectors.add(`input[type="search"]`);
    selectors.add(`input[name*="${attr}"]`);
    selectors.add(`input[placeholder*="${attr}" i]`);
    selectors.add(`input[aria-label*="${attr}" i]`);
  }

  // Validate which selectors actually exist on the page
  const existingSelectors: string[] = [];
  for (const selector of selectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      existingSelectors.push(selector);
    }
  }

  return existingSelectors;
}
