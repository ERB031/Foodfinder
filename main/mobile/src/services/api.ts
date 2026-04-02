import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@shared/constants';
import type { ApiError } from '@shared/types';

const ACCESS_TOKEN_KEY = 'foodfinder_access_token';
const REFRESH_TOKEN_KEY = 'foodfinder_refresh_token';

class ApiClient {
  private accessToken: string | null = null;

  async init(): Promise<void> {
    this.accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    this.accessToken = accessToken;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null;
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }

  hasToken(): boolean {
    return this.accessToken !== null;
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && this.accessToken) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        return this.request<T>(method, path, body);
      }
      await this.clearTokens();
      throw new ApiClientError('UNAUTHORIZED', 'Session expired');
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const apiError = errorBody?.error as ApiError | undefined;
      throw new ApiClientError(
        apiError?.code ?? 'UNKNOWN',
        apiError?.message ?? `Request failed with status ${response.status}`,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async tryRefresh(): Promise<boolean> {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      await this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }
}

export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export const api = new ApiClient();
