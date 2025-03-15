"use client";

import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  MenuProps,
  Typography,
  Divider,
  Space,
  message,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { usePathname, useRouter } from "next/navigation";

const { Header } = Layout;
const { Text } = Typography;

interface UserProps {
  user: {
    username: string;
    fullName: string;
    avatar: string | null;
    role: string;
  } | null;
}

export default function CustomHeader({ user }: UserProps) {
  const pathname = usePathname();
  const router = useRouter();

 
  const generateBreadcrumbs = () => {
    const pathArray = pathname.split("/").filter((x) => x);
    const breadcrumbs = [{ title: <HomeOutlined />, href: "/admin/dashboard" }];

    pathArray.forEach((path, index) => {
      const href = `/${pathArray.slice(0, index + 1).join("/")}`;

      const breadcrumbTitle: { [key: string]: string } = {
        dashboard: "Trang chủ",
        student: "Học viên",
        instructor: "Giảng viên",
        courses: "Khóa học",
        schedule: "Lịch học",
        profile: "Hồ sơ cá nhân",
        settings: "Cài đặt",
        students: "Quản lý học viên",
        classes: "Quản lý lớp học",
        exams: "Ngân hàng đề thi",
      };

      breadcrumbs.push({
        title: <span>{breadcrumbTitle[path] || path}</span>,
        href,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();
  const avatarSrc = user?.avatar && user.avatar !== "" ? user.avatar : null;

  const handleLogout = () => {
    localStorage.removeItem("USER_LOCAL");
    message.success("Đăng xuất thành công!");
    router.push("/"); 
  };

  const handleMenuClick = (key: string) => {
    if (key === "/logout") {
      handleLogout();
    } else {
      router.push(key); 
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "avatar",
      label: (
        <div className="w-44">
          <Space
            direction="horizontal"
            size="small"
            style={{ display: "flex" }}
          >
            <Avatar
              size={50}
              src={avatarSrc}
              icon={!avatarSrc ? <UserOutlined /> : undefined}
            />
            <div className="flex flex-col">
              <Text strong>{user?.fullName || "Người dùng"}</Text>
              <Text type="secondary">{user?.role || "Vai trò"}</Text>
            </div>
          </Space>
          <Divider style={{ margin: "10px 0" }} />
        </div>
      ),
    },
    {
      key: "/admin/profile",
      label: "Thông tin",
      icon: <InfoCircleOutlined />,
      onClick: () => handleMenuClick("/admin/profile"),
    },
    {
      key: "/admin/profile/update",
      label: "Đổi mật khẩu",
      icon: <LockOutlined />,
      onClick: () => handleMenuClick("/admin/profile/update"), 
    },
    { type: "divider" },
    {
      key: "/logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => handleMenuClick("/logout"),
    },
    { type: "divider" },
    {
      key: "version",
      label: "Hoàng - 2025",
      disabled: true,
      style: { textAlign: "center" },
    },
  ];

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Breadcrumb items={breadcrumbItems} />

      <Dropdown
        menu={{ items: userMenuItems }}
        trigger={["click"]}
        placement="bottomRight"
        arrow
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <Avatar
            size="default"
            src={avatarSrc}
            icon={!avatarSrc ? <UserOutlined /> : undefined}
          />
        </div>
      </Dropdown>
    </Header>
  );
}
