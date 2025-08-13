import * as YAML from 'yaml';
import { Action } from '../types';

/**
 * Generates a draft playbook YAML string from discovered selectors.
 * @param url The target URL.
 * @param consentSelectors A list of discovered consent selectors.
 * @param searchSelectors A list of discovered search selectors.
 * @returns A YAML string representing the draft playbook.
 */
export function generatePlaybook(
  url: URL,
  consentSelectors: string[],
  searchSelectors: string[]
): string {
  const initialFlow: Action[] = [
    {
      action: 'goto',
      url: url.href,
    },
    {
      action: 'wait_stable',
      min_ms: 1500,
    },
  ];

  const playbook = {
    site_id: `draft-${url.hostname}`,
    host_patterns: [url.hostname, `www.${url.hostname}`],
    locale: 'en-US',
    anti_bot_profile: {
      consent_selectors: consentSelectors,
    },
    flows: {
      search_and_open: initialFlow,
    },
    ads: {
      skip_texts: ['Skip', 'Skip Ad', 'ข้าม', 'ข้ามโฆษณา'],
      dom_selectors: ["button:has-text('Skip')", ".ad-skip-button"],
      ocr: { enabled: false, bbox: 'viewport' }, // Add default ocr block
    },
    recording: {
      prefer: 'mediarecorder',
      crop_strategy: 'video_bounding_box',
      duration_sec: 15,
    },
  };

  // If a search input was found, add the typing flow
  if (searchSelectors.length > 0) {
    playbook.flows.search_and_open.push({
      action: 'type',
      selector: searchSelectors[0], // Use the first likely selector
      text: '{{ query }}',
      delay_ms_range: [90, 180],
    });
    playbook.flows.search_and_open.push({
      action: 'keypress',
      key: 'Enter',
      delay_ms_range: [120, 260],
    });
  }

  return YAML.stringify(playbook);
}
