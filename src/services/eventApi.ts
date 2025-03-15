import { https } from "@/services/config";

export const eventServices = {
  getEvents: (page: number = 1, limit: number = 10) =>
    https.get(`/events?page=${page}&limit=${limit}`),

  getEventStatistics: () => https.get(`/events/statistics`),

  updateEvent: (id: number, data: any) => https.put(`/events/${id}`, data),

  deleteEvent: (id: number) => https.delete(`/events/${id}`),

  createEvent: (data: any) => https.post(`/events`, data),

  getEventDetail: (id: number) => https.get(`/events/${id}`),

  getEventsWithRegistrations: () => https.get(`/events/with-registrations`),
};
