
import { InsertUser, User } from "@shared/schema/schema";
import { apiRequest } from "./api";

export type LoginData = Pick<InsertUser, "username" | "password">;
export type UpdateUserData = Pick<InsertUser, "username">;

export const authService = {
  login: (credentials: LoginData) => 
    apiRequest<User>("POST", "/api/login", credentials),
    
  register: (data: InsertUser) => 
    apiRequest<User>("POST", "/api/register", data),
    
  logout: () => 
    apiRequest<void>("POST", "/api/logout"),
    
  getProfile: () => 
    apiRequest<User>("GET", "/api/user"),
    
  updateProfile: (data: UpdateUserData) => 
    apiRequest<User>("PATCH", "/api/user", data),
    
  deleteProfile: () => 
    apiRequest<void>("DELETE", "/api/user"),
};
