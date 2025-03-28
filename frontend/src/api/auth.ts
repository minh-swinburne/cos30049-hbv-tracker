/**
 * @file auth.ts
 * @description API client for authentication operations
 * @author Group 3
 * @date 2025-03-20
 */

import type { AuthToken } from "../types/auth";
import { BaseClient } from "./baseClient";

const prefix = "/auth";

export const authClient = (client: BaseClient) => ({
  generateToken: (address: string, message: string, signature: string): Promise<AuthToken> =>
    client.post<AuthToken>(`${prefix}/token`, { address, message, signature }),
  verifyToken: (): Promise<boolean> => client.get<boolean>(`${prefix}/verify`),
});
