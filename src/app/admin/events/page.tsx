"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table, message, Card, Typography, Button, Popconfirm, Modal, Form, Input, Select, DatePicker } from "antd";
import { useRouter } from "next/navigation";
import { eventServices } from "@/services/eventApi";
import moment from "moment"; 

const { Title } = Typography;

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventsWithRegistrations, setEventsWithRegistrations] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [pastEvents, setPastEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4, total: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await eventServices.getEvents(pagination.current, pagination.pageSize);
      setEvents(data.data);
      setFilteredEvents(data.data);
      setPagination((prev) => ({ ...prev, total: data.total }));
    } catch (error) {
      message.error("Không thể tải danh sách sự kiện!");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  const fetchStatistics = useCallback(async () => {
    try {
      const { data } = await eventServices.getEventStatistics();
      setTotalEvents(data.totalEvents);
      setUpcomingEvents(data.upcomingEvents);
      setPastEvents(data.pastEvents);
    } catch (error) {
      message.error("Không thể tải thống kê sự kiện!");
    }
  }, []);

  const fetchEventsWithRegistrations = useCallback(async () => {
    try {
      const { data } = await eventServices.getEventsWithRegistrations();
      setEventsWithRegistrations(data); 
    } catch (error) {
      message.error("Không thể tải sự kiện có đăng ký!");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchStatistics();
    fetchEventsWithRegistrations(); 
  }, [fetchEvents, fetchStatistics, fetchEventsWithRegistrations]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = events.filter((event: any) => event.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredEvents(filtered);
  };

  const openAddNewEvent = () => {
    router.push("/admin/events/add-event");
  };

  const showEventDetails = (event: any) => {
    setSelectedEvent(event);
    form.setFieldsValue({
      ...event,
      event_date: moment(event.event_date),
    });
    setIsModalOpen(true);
  };

  const handleUpdateEvent = async (values: any) => {
    if (!selectedEvent) return;
    const formattedDate = new Date(values.event_date);
  
    if (isNaN(formattedDate.getTime())) { 
      message.error("Ngày sự kiện không hợp lệ!");
      return;
    }
  
    try {
      await eventServices.updateEvent(selectedEvent.event_id, { 
        ...values, 
        event_date: formattedDate.toISOString(), 
      });
      message.success("Cập nhật sự kiện thành công!");
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      message.error("Cập nhật sự kiện thất bại!");
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await eventServices.deleteEvent(eventId);
      message.success("Xóa sự kiện thành công!");
      fetchEvents();
    } catch (error) {
      message.error("Xóa sự kiện thất bại!");
    }
  };

  return (
    <div>
      <Card className="mb-4 w-1/3 shadow-inner">
        <Title level={3}>Thống kê sự kiện</Title>
        <Typography>Tổng số sự kiện: {totalEvents}</Typography>
        <Typography>Sự kiện sắp tới: {upcomingEvents}</Typography>
        <Typography>Sự kiện đã qua: {pastEvents}</Typography>
      </Card>

      <Button type="primary" onClick={openAddNewEvent} className="my-3">
        Tạo sự kiện mới
      </Button>

      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên sự kiện"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300, marginRight: 10 }}
        />
      </div>

      <Table
        columns={[
          { title: "ID", dataIndex: "event_id", key: "event_id" },
          { title: "Tên sự kiện", dataIndex: "title", key: "title" },
          { title: "Ngày", dataIndex: "event_date", key: "event_date" },
          { title: "Địa điểm", dataIndex: "location", key: "location" },
          {
            title: "Hành động",
            key: "actions",
            render: (record: any) => (
              <>
                <Button type="link" onClick={() => showEventDetails(record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDeleteEvent(record.event_id)}>
                  <Button type="link" danger>Xóa</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
        dataSource={filteredEvents}
        rowKey="event_id"
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
        }}
      />

      <Title level={4}>Sự kiện có người đăng ký</Title>
      <Table
        columns={[
          { title: "ID", dataIndex: "event_id", key: "event_id" },
          { title: "Tên sự kiện", dataIndex: "title", key: "title" },
          { title: "Địa điểm", dataIndex: "location", key: "location" },
          { title: "Số lượng đăng ký", dataIndex: "registrations", key: "registrations", render: (registrations: any) => registrations.length },
        ]}
        dataSource={eventsWithRegistrations}
        rowKey="event_id"
        pagination={false}
      />

      <Modal title="Cập nhật sự kiện" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpdateEvent}>
          <Form.Item name="title" label="Tên sự kiện" rules={[{ required: true, message: "Vui lòng nhập tên sự kiện!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="event_date" label="Ngày" rules={[{ required: true, message: "Vui lòng chọn ngày sự kiện!" }]}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="location" label="Địa điểm">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Form>
      </Modal>
    </div>
  );
}
