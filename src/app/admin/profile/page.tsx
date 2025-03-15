"use client";
import React, { useEffect, useState } from "react";
import { authServices } from "@/services/authApi";
import { Card, Typography, Spin, message, Avatar, Button, Row, Col } from "antd";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function MyInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchUserInfo = async () => {
        setLoading(true);
        try {
          const userData = localStorage.getItem("USER_LOCAL");
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            if (parsedUserData) {
              const { data } = await authServices.getUserInfo(parsedUserData); 
              setUser({
                email: data.email,
                fullName: data.name,
                status: data.status,
                role: data.role,
                avatar: data.avatar, 
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

      fetchUserInfo();
    }
  }, []);

  if (loading) {
    return <Spin size="large" style={{ marginTop: "20px" }} />;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Card
        style={{
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Row gutter={24}>
          <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              size={100}
              src={user?.avatar || "https://joeschmoe.io/api/v1/random"}
              alt="User Avatar"
              style={{
                borderRadius: "50%",
                marginBottom: "20px",
                border: "2px solid #f0f0f0",
              }}
            />
          </Col>
          <Col span={18}>
            <Title level={2} style={{ color: "#333" }}>
              Thông tin người dùng
            </Title>
            <Text strong style={{ fontSize: "16px" }}>
              Tên: 
            </Text>
            <Text style={{ fontSize: "16px" }}> {user?.fullName}</Text>
            <br />
            <Text strong style={{ fontSize: "16px" }}>
              Email: 
            </Text>
            <Text style={{ fontSize: "16px" }}> {user?.email}</Text>
            <br />
            <Text strong style={{ fontSize: "16px" }}>
              Trạng thái: 
            </Text>
            <Text style={{ fontSize: "16px" }}> {user?.status}</Text>
            <br />
            <Text strong style={{ fontSize: "16px" }}>
              Vai trò: 
            </Text>
            <Text style={{ fontSize: "16px" }}> {user?.role}</Text>
            <br />
          </Col>
        </Row>
      </Card>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Button
          type="primary"
          onClick={() => router.push("/admin/profile/update")}
          style={{
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            borderRadius: "6px",
            padding: "10px 20px",
          }}
        >
          Cập nhật thông tin
        </Button>
      </div>
    </div>
  );
}
