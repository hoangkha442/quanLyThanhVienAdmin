import { https } from "@/services/config";

export const userServices = {
  getUsers: (page: number = 1, limit: number = 10) =>
    https.get(`/users?page=${page}&limit=${limit}`),

  getUserStatistics: () => https.get(`/users/stats`),

  updateUser: (id: number, data: any) => https.put(`/users/${id}`, data),

  deleteUser: (id: number) => https.delete(`/users/${id}`),

  createUser: (data: any) => https.post(`/users`, data),

  updatePassword: (id: number, data: any) => https.put(`/users/${id}/password`, data),

  getUserDetail: (id: number) => https.get(`/users/${id}`),
};
