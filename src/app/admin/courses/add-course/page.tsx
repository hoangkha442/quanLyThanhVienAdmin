"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useRouter } from "next/navigation";
import { userServices } from "@/services/userApi";
import { coursesServices } from "@/services/courseApi";

const { Option } = Select;

export default function AddCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);  
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await userServices.getUsers(1, 100);
        setUsers(data.data);
      } catch (error) {
        message.error("Không thể tải danh sách người dùng!");
      }
    };
    fetchUsers();
  }, []);

  const handleCreateCourse = async (values: any) => {
    setLoading(true);
    try {
      await coursesServices.createCourse(values.title, values.description, values.duration, values.instructor.toString());
      message.success("Khóa học đã được tạo thành công!");
    } catch (error) {
      message.error("Tạo khóa học thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Button type="default" onClick={() => router.push("/admin/courses")} style={{ marginBottom: 20 }}>
        Quay lại
      </Button>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>

      <p className="text-2xl mb-4">Tạo Khóa Học Mới</p>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateCourse}
        initialValues={{
          status: 'active',
        }}
      >
        <Form.Item
          name="title"
          label="Tên khóa học"
          rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Thời gian"
          rules={[{ required: true, message: "Vui lòng nhập thời gian khóa học!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
        >
          <Select
            showSearch
            placeholder="Chọn giảng viên"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map((user: any) => (
              <Option key={user.user_id} value={user.user_id} label={user.name}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Tạo Khóa Học
          </Button>
        </Form.Item>
      </Form>
      </div>
      
    </div>
  );
}
