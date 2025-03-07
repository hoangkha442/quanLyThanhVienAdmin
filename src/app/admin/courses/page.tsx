"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table, message, Card, Typography, Button, Popconfirm, Modal, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { coursesServices } from "@/services/courseApi";

const { Title } = Typography;

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [activeCourses, setActiveCourses] = useState(0);
  const [coursesWithCertificates, setCoursesWithCertificates] = useState([]);
  const [coursesWithFeedback, setCoursesWithFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 3, total: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const [form] = Form.useForm();
  const [selectedCourse, setSelectedCourse] = useState<{ course_id: number; title: string; description: string; duration: string; instructor: string; status: string } | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await coursesServices.getCourses(
        pagination.current?.toString() ?? "1",
        pagination.pageSize?.toString() ?? "4"
      );
      setCourses(data.data);
      setFilteredCourses(data.data);
      setPagination((prev) => ({ ...prev, total: data.total }));
    } catch (error) {
      message.error("Không thể tải danh sách khóa học!");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  const fetchStatistics = useCallback(async () => {
    try {
      const { data } = await coursesServices.getStatistics();
      setTotalCourses(data.totalCourses);
      setActiveCourses(data.activeCourses);
    } catch (error) {
      message.error("Không thể tải thống kê khóa học!");
    }
  }, []);

  const fetchCoursesWithCertificates = useCallback(async () => {
    try {
      const { data } = await coursesServices.getCoursesWithCertificates();
      setCoursesWithCertificates(data);
    } catch (error) {
      message.error("Không thể tải khóa học có chứng chỉ!");
    }
  }, []);

  const fetchCoursesWithFeedback = useCallback(async () => {
    try {
      const { data } = await coursesServices.getCoursesWithFeedback();
      setCoursesWithFeedback(data);
    } catch (error) {
      message.error("Không thể tải khóa học có phản hồi!");
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchStatistics();
    fetchCoursesWithCertificates();
    fetchCoursesWithFeedback();
  }, [fetchCourses, fetchStatistics, fetchCoursesWithCertificates, fetchCoursesWithFeedback]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = courses.filter((course: any) => course.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredCourses(filtered);
  };

  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
    if (value === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course: any) => (value ? course.status === value : true) && course.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const openAddNewCourse = () => {
    router.push("/admin/courses/add-course");
  };

  const showCourseDetails = (course: any) => {
    setSelectedCourse(course);
    form.setFieldsValue(course);
    setIsModalOpen(true);
  };

  const handleUpdateCourse = async (values: any) => {
    if (!selectedCourse) return;
    try {
      await coursesServices.updateCourse(selectedCourse.course_id, values);
      message.success("Cập nhật khóa học thành công!");
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      message.error("Cập nhật khóa học thất bại!");
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await coursesServices.deleteCourse(courseId);
      message.success("Xóa khóa học thành công!");
      fetchCourses();
    } catch (error) {
      message.error("Xóa khóa học thất bại!");
    }
  };

  return (
    <div>
      <Card className="mb-4 w-1/3 shadow-inner">
        <Title level={3}>Thống kê khóa học</Title>
        <Typography>Tổng số khóa học: {totalCourses}</Typography>
        <Typography>Khóa học đang hoạt động: {activeCourses}</Typography>
      </Card>

      <Button type="primary" onClick={openAddNewCourse} className="my-3">
        Tạo khóa học mới
      </Button>

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên khóa học"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300, marginRight: 10 }}
        />
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          placeholder="Chọn trạng thái"
          style={{ width: 200 }}
        >
          <Select.Option value="active">Hoạt động</Select.Option>
          <Select.Option value="inactive">Không hoạt động</Select.Option>
          <Select.Option value="all">Tất cả</Select.Option>
        </Select>
      </div>

      <Table
        columns={[
          { title: "ID", dataIndex: "course_id", key: "course_id" },
          { title: "Tên khóa học", dataIndex: "title", key: "title" },
          { title: "Mô tả", dataIndex: "description", key: "description" },
          { title: "Thời gian", dataIndex: "duration", key: "duration" },
          { title: "Giảng viên", dataIndex: "instructor", key: "instructor" },
          { title: "Trạng thái", dataIndex: "status", key: "status" },
          {
            title: "Hành động",
            key: "actions",
            render: (record: any) => (
              <>
                <Button type="link" onClick={() => showCourseDetails(record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteCourse(record.course_id)}>
                  <Button type="link" danger>Xóa</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        dataSource={filteredCourses}
        rowKey="course_id"
        loading={loading}
        pagination={pagination}
        onChange={(p) => setPagination((prev) => ({ ...prev, current: p.current || 1, pageSize: p.pageSize || 10 }))}  
      />

      <Title level={4}>Khóa học có chứng chỉ</Title>
      <Table
        columns={[
          { title: "ID", dataIndex: "course_id", key: "course_id" },
          { title: "Tên khóa học", dataIndex: "title", key: "title" },
          { title: "Mô tả", dataIndex: "description", key: "description" },
        ]}
        dataSource={coursesWithCertificates}
        rowKey="course_id"
        pagination={false}  // Remove pagination for this table, you can add it if needed
      />

      <Title level={4}>Khóa học có phản hồi</Title>
      <Table
        columns={[
          { title: "ID", dataIndex: "course_id", key: "course_id" },
          { title: "Tên khóa học", dataIndex: "title", key: "title" },
          { title: "Mô tả", dataIndex: "description", key: "description" },
          { title: "Phản hồi", dataIndex: "user_feedbacks", key: "user_feedbacks", render: (feedbacks: any) => feedbacks.map((feedback: any) => <div key={feedback.feedback_id}>{feedback.comment}</div>) }
        ]}
        dataSource={coursesWithFeedback}
        rowKey="course_id"
        pagination={false}  // Remove pagination for this table, you can add it if needed
      />

      <Modal title="Cập nhật khóa học" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpdateCourse}>
          <Form.Item name="title" label="Tên khóa học" rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="duration" label="Thời gian">
            <Input />
          </Form.Item>
          <Form.Item name="instructor" label="Giảng viên">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Form>
      </Modal>
    </div>
  );
}
