"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table, message, Card, Typography, Button, Popconfirm, Modal, Form, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { userServices } from "@/services/userApi";

const { Title } = Typography;

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 3, total: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [selectedUser, setSelectedUser] = useState<{ user_id: number; name: string; email: string; role: string; status: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userServices.getUsers(pagination.current, pagination.pageSize);
      setUsers(data.data);
      setFilteredUsers(data.data);
      setPagination((prev) => ({ ...prev, total: data.total }));
    } catch (error) {
      message.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  const fetchStatistics = useCallback(async () => {
    try {
      const { data } = await userServices.getUserStatistics();
      setTotalUsers(data.totalUsers);
      setActiveUsers(data.activeUsers);
    } catch (error) {
      message.error("Không thể tải thống kê người dùng!");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [fetchUsers, fetchStatistics]);

  const handleUpdateUser = async (values: any) => {
    if (!selectedUser) return;
    try {
      await userServices.updateUser(selectedUser.user_id, values);
      message.success("Cập nhật người dùng thành công!");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      message.error("Cập nhật người dùng thất bại!");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await userServices.deleteUser(userId);
      message.success("Xóa người dùng thành công!");
      fetchUsers();
    } catch (error) {
      message.error("Xóa người dùng thất bại!");
    }
  };

  const handleChangePassword = async (values: any) => {
    if (!selectedUser) return;
    try {
      await userServices.updatePassword(selectedUser.user_id, values);
      message.success("Cập nhật mật khẩu thành công!");
      setIsPasswordModalOpen(false);
    } catch (error) {
      message.error("Cập nhật mật khẩu thất bại!");
    }
  };

  const openAddNewUser = () => {
    router.push("/admin/users/add-user");
  };

  const showUserDetails = (user: any) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const openPasswordModal = (user: any) => {
    setSelectedUser(user);
    passwordForm.resetFields();
    setIsPasswordModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = users.filter((user: any) => user.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredUsers(filtered);
  };


  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
    if (value === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user: any) => (value ? user.status === value : true) && user.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };
  

  return (
    <div>
      <Card className="mb-4 w-1/3 shadow-inner">
        <Title level={3}>Thống kê người dùng</Title>
        <Typography>Tổng số người dùng: {totalUsers}</Typography>
        <Typography>Người dùng đang hoạt động: {activeUsers}</Typography>
      </Card>

      <Button type="primary" onClick={openAddNewUser} className="my-3">
        Tạo người dùng mới
      </Button>

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên"
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
          { title: "ID", dataIndex: "user_id", key: "user_id" },
          { title: "Tên", dataIndex: "name", key: "name" },
          { title: "Email", dataIndex: "email", key: "email" },
          { title: "Vai trò", dataIndex: "role", key: "role" },
          { title: "Trạng thái", dataIndex: "status", key: "status" },
          {
            title: "Hành động",
            key: "actions",
            render: (record: any) => (
              <>
                <Button type="link" onClick={() => showUserDetails(record)}>Sửa</Button>
                <Button type="link" onClick={() => openPasswordModal(record)}>Đổi mật khẩu</Button>
                <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteUser(record.user_id)}>
                  <Button type="link" danger>Xóa</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        dataSource={filteredUsers}
        rowKey="user_id"
        loading={loading}
        pagination={pagination}
        onChange={(p) => setPagination((prev) => ({ ...prev, current: p.current || 1, pageSize: p.pageSize || 10 }))}  
      />

      <Modal title="Cập nhật thông tin người dùng" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
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

      <Modal title="Đổi mật khẩu" open={isPasswordModalOpen} onCancel={() => setIsPasswordModalOpen(false)} footer={null}>
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: "Nhập mật khẩu mới!" }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit">Cập nhật</Button>
        </Form>
      </Modal>
    </div>
  );
}
