import { https } from "@/services/config";

export const coursesServices = {
  // Create a new course
  createCourse: (title: string, description?: string, duration?: string, instructor?: string) =>
    https.post("/courses", { title, description, duration, instructor }),

  // Get all courses with pagination, search, and status filters
  getCourses: (page: string, size: string, search?: string, status?: string) => {
    let url = `/courses?page=${page}&size=${size}`;
    if (search || status) {
      url += `&search=${search || ""}&status=${status || ""}`;
    }
    return https.get(url);
  },

  // Get a course by ID
  getCourseById: (id: number) => https.get(`/courses/${id}`),

  // Update a course
  updateCourse: (id: number, values: any) =>
    https.put(`/courses/${id}`, values),

  // Delete a course
  deleteCourse: (id: number) => https.delete(`/courses/${id}`),

  // Get courses with certificates
  getCoursesWithCertificates: () => https.get('/courses/with-certificates'),

  // Get courses with feedback
  getCoursesWithFeedback: () => https.get('/courses/with-feedback'),

  // Get course statistics (total, active, inactive)
  getStatistics: () => https.get('/courses/statistics'),
};
