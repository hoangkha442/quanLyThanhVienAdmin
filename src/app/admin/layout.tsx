"use client";
import { ReactNode, useState, useEffect } from "react";
import { Layout, ConfigProvider, Spin, message } from "antd";
import Sidebar from "@/app/components/Sidebar";
import CustomHeader from "@/app/components/CustomerHeader";
import { authServices } from "@/services/authApi"; 

const { Content } = Layout;

interface LayoutProps {
  children: ReactNode;
}

const RootPage = ({ children }: LayoutProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchUserInfo = async () => {
        setLoading(true);
        try {
          const userData = localStorage.getItem('USER_LOCAL');
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            if (parsedUserData) {
              const { data } = await authServices.getUserInfo(parsedUserData);
              setUser({
                username: data.username,
                fullName: data.name,
                avatar: data.avatar || null,
                role: data.role,
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

  return (
    <div className="flex">
      <ConfigProvider componentSize="large">
        <Layout className="!h-screen">
          <Sidebar setLoading={setLoading} />
          <Layout>
            <CustomHeader user={user} />
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: "#ffffff",
                borderRadius: 8,
                position: "relative",
                overflowY: "auto",
              }}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
                  <Spin size="large" />
                </div>
              )}
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  );
};

export default RootPage;
