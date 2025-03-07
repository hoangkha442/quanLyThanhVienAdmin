"use client";
import { useState } from "react";
import { Button, Input, message, Form, Card, Typography, Spin } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authServices } from "@/services/authApi";
import { userLocalStorage } from "@/services/LocalService";

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await authServices.login(values.email, values.password);


      userLocalStorage.set(data.token);

      message.success("Đăng nhập thành công!");

      if (data.role === "admin") {
        router.push("/admin/users");
      } else {
        message.error("Lỗi: Vai trò không hợp lệ!");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      message.error(error.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <Typography.Title level={2} className="text-center mb-4">
        Đăng nhập
      </Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không được bỏ trống!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Mật khẩu không được bỏ trống!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading} size="large">
            {loading ? <Spin /> : "Đăng nhập"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
