"use client"
import React, { useState } from 'react'
import { Form, Input, Button, Select, message, Typography } from 'antd'
import { authServices } from '@/services/authApi'
import { useRouter } from 'next/navigation'
import { ArrowLeftOutlined } from '@ant-design/icons'

const { Option } = Select

type Props = {}

export default function AddNewUser({}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (values: any) => {
    setLoading(true)
    try {
      await authServices.signup(values.email, values.password, values.role, values.status)
      message.success('Tạo người dùng thành công!')
    } catch (error) {
      message.error('Tạo người dùng thất bại!')
    } finally {
      setLoading(false)
    }
  }


  return (
    <section>
      <button className='cursor-pointer hover:text-blue-500 transition-all' onClick={() => router.push('/admin/users')}>
        <ArrowLeftOutlined className='mr-2'/>
        Quay lại
      </button>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <p className='text-xl mb-4'>Thêm Người Dùng Mới</p>
        <Form
          layout="vertical"
          onFinish={handleSignUp}
          initialValues={{
            role: 'user',
            status: 'active',
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo Người Dùng
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  )
}
