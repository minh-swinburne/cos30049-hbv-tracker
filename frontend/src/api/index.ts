/**
 * @file index.ts
 * @description API client for making HTTP requests to the backend
 * @author Group 3
 * @date 2025-03-20
 */

import { BaseClient } from "./baseClient";
import { authClient } from "./auth";
import { blockchainClient } from "./blockchain";
import { graphClient } from "./graph";

const baseClient = new BaseClient();

const apiClient = {
  auth: authClient(baseClient),
  graph: graphClient(baseClient),
  blockchain: blockchainClient(baseClient),
};

export default apiClient;
