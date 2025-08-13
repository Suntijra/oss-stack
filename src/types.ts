// Shared type definitions for the project

export type GotoAction = { action: 'goto'; url: string };
export type WaitStableAction = { action: 'wait_stable'; min_ms?: number };
export type TypeAction = { action: 'type'; selector: string; text: string; delay_ms_range?: [number, number] };
export type KeypressAction = { action: 'keypress'; selector?: string; key: string; delay_ms_range?: [number, number] };
export type HumanScrollAction = { action: 'human_scroll'; mode: string; steps: number };
export type ClickAction = { action: 'click'; selector: string; human_like?: boolean };
export type FinishAction = { action: 'finish'; reason: string };

export type Action =
  | GotoAction
  | WaitStableAction
  | TypeAction
  | KeypressAction
  | HumanScrollAction
  | ClickAction
  | FinishAction;
