// Type definitions for the Safe Chat Filter app

export interface CheckRequest {
  text: string;
}

export interface CheckResponse {
  safe: boolean;
  reasons: string[];
  mode: 'openai' | 'heuristic' | 'none';
}

export interface ApiError {
  message: string;
  status?: number;
}
