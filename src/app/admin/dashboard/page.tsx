"use client";
import React, { useEffect, useState } from "react";
import { dashboardServices } from "@/services/dashboardApi"; 

export default function Dashboard() {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await dashboardServices.getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
        Thống kê Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tổng số khóa học */}
        <div className="card shadow-lg rounded-lg p-6 bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Tổng số khóa học</h3>
          <p className="text-lg font-medium">{statistics.totalCourses}</p>
          <p>Khóa học đang hoạt động: {statistics.totalActiveCourses}</p>
          <p>Khóa học không hoạt động: {statistics.totalInactiveCourses}</p>
        </div>

        {/* Tổng số người dùng */}
        <div className="card shadow-lg rounded-lg p-6 bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Tổng số người dùng</h3>
          <p className="text-lg font-medium">{statistics.totalUsers}</p>
          <p>Người dùng hoạt động: {statistics.activeUsers}</p>
          <p>Người dùng không hoạt động: {statistics.inactiveUsers}</p>
          <p>Admin: {statistics.totalAdmins}</p>
          <p>User: {statistics.totalRegularUsers}</p>
        </div>

        {/* Tổng số sự kiện */}
        <div className="card shadow-lg rounded-lg p-6 bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Tổng số sự kiện</h3>
          <p className="text-lg font-medium">{statistics.totalEvents}</p>
          <p>Đã đăng ký: {statistics.totalRegistrations}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Khóa học đã cấp chứng chỉ */}
        <div className="card shadow-lg rounded-lg p-6 bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Khóa học đã cấp chứng chỉ</h3>
          <p className="text-lg font-medium">{statistics.totalCoursesWithCertificates}</p>
        </div>

        {/* Khóa học có phản hồi */}
        <div className="card shadow-lg rounded-lg p-6 bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Khóa học có phản hồi</h3>
          <p className="text-lg font-medium">{statistics.totalCoursesWithFeedback}</p>
        </div>
      </div>
    </div>
  );
}
