import { https } from "@/services/config";

export const authServices = {
  login: (email: string, password: string) =>
    https.post(`/auth/login`, { email, password }),

  signup: (email: string, password: string, role?: string, status?: string) =>
    https.post(`/auth/signup`, { email, password, role, status }),

  getUserInfo: (token: unknown) => 
    https.get("auth/get-info", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
