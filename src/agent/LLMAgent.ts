// This module will contain the logic for the ReAct Agent.
// It will be responsible for interacting with the Gemini LLM
// to decide the next best action to achieve a high-level goal.

import { Page } from 'playwright';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Action } from '../types';

// This is a placeholder for the detailed page state we'll send to the LLM.
// It could include simplified DOM, accessibility tree, screenshots, etc.
type PageState = { html: string; url: string; };

/**
 * Determines the next action to take based on the current page state and the overall goal.
 * This function will interact with the Gemini API.
 * 
 * @param goal The high-level user goal (e.g., "Find and record the video of Thailand vs China").
 * @param page The Playwright page instance representing current browser state.
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
