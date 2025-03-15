"use client";
import React, { useState } from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import { useRouter } from "next/navigation";
import { eventServices } from "@/services/eventApi";
import moment from "moment";

export default function AddEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCreateEvent = async (values: any) => {
    setLoading(true);
    try {
     
      const formattedDate = values.event_date ? moment(values.event_date).format("YYYY-MM-DD HH:mm:ss") : "";
      await eventServices.createEvent({ ...values, event_date: formattedDate });
      message.success("Sự kiện đã được tạo thành công!");
      router.push("/admin/events");
    } catch (error) {
      message.error("Tạo sự kiện thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Button type="default" onClick={() => router.push("/admin/events")} style={{ marginBottom: 20 }}>
        Quay lại
      </Button>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <p className="text-2xl mb-4">Tạo Sự Kiện Mới</p>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateEvent}
        >
          <Form.Item
            name="title"
            label="Tên sự kiện"
            rules={[{ required: true, message: "Vui lòng nhập tên sự kiện!" }]}
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
            name="event_date"
            label="Ngày và giờ"
            rules={[{ required: true, message: "Vui lòng chọn ngày và giờ sự kiện!" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo Sự Kiện
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
