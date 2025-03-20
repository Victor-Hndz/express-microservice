import { InsertRequest, Request } from "@shared/schema/schema";
import { apiRequest } from "./api";

export const requestsService = {
  create: (data: InsertRequest) => apiRequest<Request>("POST", "/api/requests", data),

  getUserRequests: () => apiRequest<Request[]>("GET", "/api/requests"),
};
