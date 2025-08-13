import { Page } from 'playwright';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Action } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// This is a placeholder for the detailed page state we'll send to the LLM.
// It could include simplified DOM, accessibility tree, screenshots, etc.
type PageState = { html: string; url: string; };

// Initialize Google Generative AI
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in .env file. Agent will not function correctly.');
  // In a real app, you might throw an error or handle this more gracefully.
}
const genAI = new GoogleGenerativeAI(API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro as a placeholder

/**
 * Determines the next action to take based on the current page state and the overall goal.
 * This function will interact with the Gemini API.
 * 
 * @param goal The high-level user goal (e.g., "Find and record the video of Thailand vs China").
<<<<<<< HEAD
 * @param page The Playwright Page object.
=======
 * @param page The Playwright page instance representing current browser state.
>>>>>>> 9c5a99ba197b94108b8f307968a4ca2d836d746b
 * @returns The next action to be executed by the worker.
 */
export async function determineNextAction(goal: string, page: Page): Promise<Action> {
  console.log('🤖 Agent is thinking...');

  // 1. Capture page state
  const pageState: PageState = {
    html: await page.content(), // In a real scenario, we would simplify this HTML.
    url: page.url(),
  };

  // 2. Construct the prompt for the LLM
<<<<<<< HEAD
  // The prompt guides the LLM to act as an agent, think, and then output a specific JSON action.
  const prompt = `You are an autonomous web browsing agent. Your goal is: "${goal}".\n\nHere is the current state of the webpage:\nURL: ${pageState.url}\nHTML (simplified for brevity, focus on relevant elements):\n\`\`\`html\n${pageState.html.substring(0, 5000)}...\n\`\`\`\n\nAvailable actions (respond with one JSON object):\n- {"action": "goto", "url": "<url>"} - Navigate to a URL.\n- {"action": "type", "selector": "<css_selector>", "text": "<text_to_type>"} - Type text into an input field.\n- {"action": "click", "selector": "<css_selector>"} - Click an element.\n- {"action": "keypress", "key": "<key_name>"} - Press a key (e.g., "Enter").\n- {"action": "human_scroll", "mode": "<mode>", "steps": <number>} - Scroll the page.\n- {"action": "wait_stable", "min_ms": <milliseconds>} - Wait for the page to stabilize.\n- {"action": "finish", "reason": "<reason_for_completion>"} - Indicate that the goal is achieved.\n\nThink step-by-step about what action to take next to achieve your goal.\nRespond only with a JSON object containing your 'thought' and 'action'.\nExample: {"thought": "I need to find the search bar and type the query.", "action": {"action": "type", "selector": "input[name='q']", "text": "my query"}}\n\nYour response MUST be a valid JSON object.`;

  console.log(`Prompt sent to LLM (first 200 chars): ${prompt.substring(0, 200)}...`);

  // 3. Call the Gemini API\n  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`🤖 Agent's raw response: ${text.substring(0, 200)}...`);

    // Attempt to parse JSON. LLM might return extra text.\n    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let jsonString = text;
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }

    const llmResponse = JSON.parse(jsonString);

    console.log(`🤖 Agent's thought: ${llmResponse.thought}`);

    // 4. Return the action\n    return llmResponse.action as Action;
  } catch (error: any) { // Cast error to any\n    console.error('Error calling Gemini API or parsing response:', error);
    // Fallback to a finish action on error to prevent infinite loops\n    return { action: 'finish', reason: `LLM API error: ${error.message}` };
  }\n}\n
=======
  const prompt = `You are a browser automation agent.\n` +
    `Goal: ${goal}\nPage URL: ${pageState.url}\n` +
    `HTML: ${pageState.html}\n\n` +
    `Return the next action as JSON matching the Action type.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('LLM call timed out')), 30000)),
    ]);

    const text = (result as any).response?.text?.();
    console.log(`🤖 Agent raw output: ${text}`);

    const action = JSON.parse(text) as Action;
    return action;
  } catch (err) {
    console.error('Gemini API error', err);
    return { action: 'finish', reason: `Failed to determine next action: ${(err as Error).message}` };
  }
}
>>>>>>> 9c5a99ba197b94108b8f307968a4ca2d836d746b
