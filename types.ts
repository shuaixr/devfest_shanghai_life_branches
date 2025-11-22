export enum Era {
  QingDynasty = '1890',
  OldShanghai = '1930',
  ReformEra = '1990',
  ModernShanghai = '2025',
  FutureShanghai = '2050',
  StellarCity = '2100',
}

export interface EraConfig {
  id: Era;
  name: string;
  year: string;
  description: string;
  defaultPrompt: string;
  captionPrompt: string;
  color: string;
  bgGradient: string;
}

export interface GeneratedResult {
  era: Era;
  imageUrl: string | null;
  caption: string | null;
  loading: boolean;
  error: string | null;
}

export type GeminiModel = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';

export interface AppState {
  apiKey: string | null;
  isDemoMode: boolean;
  selectedModel: GeminiModel;
  userImage: string | null;
  prompts: Record<Era, string>;
  results: Record<Era, GeneratedResult>;
  step: 'upload' | 'edit' | 'generating' | 'results';
}