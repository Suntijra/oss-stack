import { Page } from 'playwright';
import { findConsentSelectors, findSearchSelectors } from './heuristics';

export interface SelectorResults {
  consentSelectors: string[];
  searchSelectors: string[];
}

export async function scanSelectors(page: Page): Promise<SelectorResults> {
  console.log('Scanning for consent selectors...');
  const consentSelectors = await findConsentSelectors(page);
  console.log(`Found ${consentSelectors.length} potential consent selectors.`);

  console.log('Scanning for search selectors...');
  const searchSelectors = await findSearchSelectors(page);
  console.log(`Found ${searchSelectors.length} potential search selectors.`);

  return { consentSelectors, searchSelectors };
}
