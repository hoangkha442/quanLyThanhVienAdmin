import { https } from "@/services/config";

export const coursesServices = {
  createCourse: (title: string, description?: string, duration?: string, instructor?: string) =>
    https.post("/courses", { title, description, duration, instructor }),

  getCourses: (page: string, size: string, search?: string, status?: string) => {
    let url = `/courses?page=${page}&size=${size}`;
    if (search || status) {
      url += `&search=${search || ""}&status=${status || ""}`;
    }
    return https.get(url);
  },

  getCourseById: (id: number) => https.get(`/courses/${id}`),

  updateCourse: (id: number, values: any) =>
    https.put(`/courses/${id}`, values),

  deleteCourse: (id: number) => https.delete(`/courses/${id}`),

  getCoursesWithCertificates: () => https.get('/courses/with-certificates'),

  getCoursesWithFeedback: () => https.get('/courses/with-feedback'),

  getStatistics: () => https.get('/courses/statistics'),
};
