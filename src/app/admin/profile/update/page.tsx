"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { userServices } from "@/services/userApi";
import { authServices } from "@/services/authApi";

export default function UpdateUserInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("USER_LOCAL");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData) {
            const { data } = await authServices.getUserInfo(parsedUserData);
            setUser(data);
            form.setFieldsValue({
              name: data.name,
              email: data.email,
            }); 
          } else {
            message.error("Vui lòng đăng nhập lại!");
          }
        }
      } catch (error) {
        message.error("Không thể tải thông tin người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [form]);

  const handleUpdate = async (values: any) => {
    try {
      const updatedData = { name: values.name };

      if (isPasswordUpdate && values.password) {
        await userServices.updatePassword(user.user_id, { newPassword: values.password });
      }
      await userServices.updateUser(user.user_id, updatedData);
      message.success("Cập nhật thông tin thành công!");
      router.push("/admin/profile"); 
    } catch (error) {
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 className="text-xl mb-4">Cập nhật thông tin người dùng</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
      >
        {/* Full Name Input */}
        <Form.Item
          name="name"
          label="Tên"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input disabled={isPasswordUpdate} />
        </Form.Item>

        {/* Email Input (Not Editable) */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input disabled={true} />
        </Form.Item>

        {isPasswordUpdate && (
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input type="password" />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thay đổi
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            type="link"
            onClick={() => setIsPasswordUpdate(!isPasswordUpdate)} 
            style={{ color: "#1890ff" }}
          >
            {isPasswordUpdate ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
