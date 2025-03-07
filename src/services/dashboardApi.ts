import { https } from "@/services/config";

export const dashboardServices = {
  getStatistics: () => https.get("/dashboard/statistics"),
};
