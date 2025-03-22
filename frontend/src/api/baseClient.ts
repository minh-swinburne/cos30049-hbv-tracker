/**
 * @file baseClient.ts
 * @description Base API client for making HTTP requests
 * @author Group 3
 * @date 2024-03-20
 */

const BASE_URL = 'http://127.0.0.1:8000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message || 'An error occurred');
  }
  return response.json();
}

export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  return handleResponse<T>(response);
}

export async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function put<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function del<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
  return handleResponse<T>(response);
} 