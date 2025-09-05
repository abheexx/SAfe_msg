// API service for communicating with the backend
import axios from 'axios';
import { CheckRequest, CheckResponse, ApiError } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkText = async (text: string): Promise<CheckResponse> => {
  try {
    const response = await api.post<CheckResponse>('/api/check', { text });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.detail || error.message || 'Unknown error occurred',
        status: error.response?.status,
      };
      throw apiError;
    }
    throw { message: 'Network error occurred' } as ApiError;
  }
};

export const healthCheck = async (): Promise<{ status: string; openai_available: boolean; heuristic_available: boolean }> => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw { message: 'Health check failed' } as ApiError;
  }
};
