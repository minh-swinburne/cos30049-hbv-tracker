/**
 * @file baseClient.ts
 * @description Base API client for making HTTP requests
 * @author Group 3
 * @date 2025-03-20
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class BaseClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  setAuthorizationToken(token: string) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  clearAuthorizationToken() {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  async handleResponse<T>(response: any): Promise<T> {
    if (response.status >= 400) {
      const error = response.data || { message: "An error occurred" };
      throw new ApiError(response.status, error.message || "An error occurred");
    }
    return response.data;
  }

  async get<T>(
    url: string,
    params?: URLSearchParams,
    config?: AxiosRequestConfig<any>
  ): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, {
      params,
      ...config,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any>
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return this.handleResponse<T>(response);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any>
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return this.handleResponse<T>(response);
  }
}
