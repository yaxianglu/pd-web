import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import apiService from '../services/api';
import '../market/index.scss';
import './account-management.scss';

const { Option } = Select;
const { TabPane } = Tabs;

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);

  // 获取当前用户信息
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    setCurrentUser(userInfo);
  }, []);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await apiService.getUsers();
        if (res?.success) {
          setUsers(res.data || []);
        }
      } else if (activeTab === 'clinics') {
        const res = await apiService.getClinics();
        if (res?.success) {
          setClinics(res.data || []);
        }
      } else if (activeTab === 'patients') {
        const res = await apiService.getPatients();
        if (res?.success) {
          setPatients(res.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('加載數據失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // 根据角色显示相应的管理模块
  const getVisibleTabs = () => {
    const userRole = currentUser?.role;
    const tabs = [];

    // 超级管理员可以管理所有账户
    if (userRole === 'super_admin') {
      tabs.push(
        { key: 'users', label: '用戶管理', icon: <UserOutlined /> },
        { key: 'clinics', label: '診所管理', icon: <BankOutlined /> },
        { key: 'patients', label: '患者管理', icon: <TeamOutlined /> }
      );
    }
    // 普通管理员可以管理所有账户
    else if (userRole === 'admin') {
      tabs.push(
        { key: 'users', label: '用戶管理', icon: <UserOutlined /> },
        { key: 'clinics', label: '診所管理', icon: <BankOutlined /> },
        { key: 'patients', label: '患者管理', icon: <TeamOutlined /> }
      );
    }
    // 医院管理员可以管理诊所、医生、患者
    else if (userRole === 'hospital') {
      tabs.push(
        { key: 'clinics', label: '診所管理', icon: <BankOutlined /> },
        { key: 'users', label: '醫生管理', icon: <UserOutlined /> },
        { key: 'patients', label: '患者管理', icon: <TeamOutlined /> }
      );
    }
    // 销售专员可以管理诊所、医生、患者
    else if (userRole === 'market') {
      tabs.push(
        { key: 'clinics', label: '診所管理', icon: <BankOutlined /> },
        { key: 'users', label: '醫生管理', icon: <UserOutlined /> },
        { key: 'patients', label: '患者管理', icon: <TeamOutlined /> }
      );
    }
    // 医生只能管理患者
    else if (userRole === 'doctor') {
      tabs.push(
        { key: 'patients', label: '患者管理', icon: <TeamOutlined /> }
      );
    }

    return tabs;
  };

  // 创建账户
  const handleCreate = async (values) => {
    try {
      let res;
      if (activeTab === 'users') {
        res = await apiService.createAdminUser(values);
      } else if (activeTab === 'clinics') {
        res = await apiService.createClinic(values);
      } else if (activeTab === 'patients') {
        res = await apiService.createPatient(values);
      }

      if (res?.success) {
        message.success(res.message || '創建成功');
        setCreateModalVisible(false);
        createForm.resetFields();
        loadData();
      } else {
        message.error(res?.message || '創建失敗');
      }
    } catch (error) {
      console.error('Failed to create:', error);
      message.error('創建失敗');
    }
  };

  // 删除/关闭账户
  const handleDelete = async (id) => {
    try {
      let res;
      if (activeTab === 'users') {
        res = await apiService.deleteUser(id);
      } else if (activeTab === 'clinics') {
        res = await apiService.deleteClinic(id);
      } else if (activeTab === 'patients') {
        res = await apiService.deletePatient(id);
      }

      if (res?.success) {
        message.success(res.message || '操作成功');
        loadData();
      } else {
        message.error(res?.message || '操作失敗');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      message.error('操作失敗');
    }
  };

  // 更新状态
  const handleStatusChange = async (id, status) => {
    try {
      let res;
      if (activeTab === 'users') {
        res = await apiService.updateUserStatus(id, status);
      } else if (activeTab === 'clinics') {
        res = await apiService.updateClinicStatus(id, status);
      } else if (activeTab === 'patients') {
        res = await apiService.updatePatientStatus(id, status);
      }

      if (res?.success) {
        message.success(res.message || '狀態更新成功');
        loadData();
      } else {
        message.error(res?.message || '狀態更新失敗');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      message.error('狀態更新失敗');
    }
  };

  // 用户表格列
  const userColumns = [
    {
      title: '用戶名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          admin: '管理員',
          market: '業務',
          doctor: '醫生',
          operator: '操作員'
        };
        return <Tag color="blue">{roleMap[role] || role}</Tag>;
      }
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 100 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="active">啟用</Option>
          <Option value="inactive">停用</Option>
          <Option value="suspended">暫停</Option>
        </Select>
      )
    },
    {
      title: '創建時間',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => date ? new Date(date).toLocaleString('zh-TW') : '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="確定要刪除此用戶嗎？"
            onConfirm={() => handleDelete(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              刪除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 诊所表格列
  const clinicColumns = [
    {
      title: '診所名稱',
      dataIndex: 'clinic_name',
      key: 'clinic_name',
    },
    {
      title: '診所代碼',
      dataIndex: 'clinic_code',
      key: 'clinic_code',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (address, record) => {
        const parts = [record.city, record.district, address].filter(Boolean);
        return parts.join(', ');
      }
    },
    {
      title: '電話',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 100 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="active">啟用</Option>
          <Option value="inactive">停用</Option>
          <Option value="suspended">暫停</Option>
          <Option value="closed">關閉</Option>
        </Select>
      )
    },
    {
      title: '創建時間',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => date ? new Date(date).toLocaleString('zh-TW') : '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="確定要關閉此診所嗎？"
            onConfirm={() => handleDelete(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              關閉
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 患者表格列
  const patientColumns = [
    {
      title: '姓名',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: '電話',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '性別',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        const genderMap = {
          male: '男',
          female: '女',
          other: '其他'
        };
        return genderMap[gender] || gender;
      }
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        // 将test_status映射到显示状态
        const statusMap = {
          'pending': 'active',
          'in_progress': 'active',
          'completed': 'discharged',
          'cancelled': 'inactive'
        };
        
        const displayStatus = statusMap[status] || status;
        
        return (
          <Select
            value={displayStatus}
            style={{ width: 100 }}
            onChange={(value) => {
              // 将显示状态映射回test_status
              const reverseStatusMap = {
                'active': 'pending',
                'inactive': 'cancelled',
                'suspended': 'cancelled',
                'discharged': 'completed'
              };
              handleStatusChange(record.id, reverseStatusMap[value] || value);
            }}
          >
            <Option value="active">啟用</Option>
            <Option value="inactive">停用</Option>
            <Option value="suspended">暫停</Option>
            <Option value="discharged">出院</Option>
          </Select>
        );
      }
    },
    {
      title: '創建時間',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => date ? new Date(date).toLocaleString('zh-TW') : '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="確定要關閉此患者嗎？"
            onConfirm={() => handleDelete(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              關閉
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 获取创建表单字段
  const getCreateFormFields = () => {
    if (activeTab === 'users') {
      return (
        <>
          <Form.Item
            name="username"
            label="用戶名"
            rules={[{ required: true, message: '請輸入用戶名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密碼"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="full_name"
            label="姓名"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            initialValue="doctor"
            rules={[{ required: true, message: '請選擇角色' }]}
          >
            <Select>
              <Option value="admin">普通管理員</Option>
              <Option value="market">銷售專員</Option>
              <Option value="doctor">醫生</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="郵箱"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="電話"
          >
            <Input />
          </Form.Item>
        </>
      );
    } else if (activeTab === 'clinics') {
      return (
        <>
          <Form.Item
            name="clinic_name"
            label="診所名稱"
            rules={[{ required: true, message: '請輸入診所名稱' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="clinic_code"
            label="診所代碼"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="城市"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="district"
            label="區域"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="電話"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="郵箱"
          >
            <Input />
          </Form.Item>
        </>
      );
    } else if (activeTab === 'patients') {
      return (
        <>
          <Form.Item
            name="full_name"
            label="姓名"
            rules={[{ required: true, message: '請輸入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="電話"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="郵箱"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性別"
          >
            <Select>
              <Option value="male">男</Option>
              <Option value="female">女</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emergency_contact"
            label="緊急聯絡人"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emergency_phone"
            label="緊急聯絡電話"
          >
            <Input />
          </Form.Item>
        </>
      );
    }
  };

  const visibleTabs = getVisibleTabs();

  return (
    <div className="account-management">
      <div className="market-header">
        <div className="title" style={{ width: '100%' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={visibleTabs}
          />
        </div>
      </div>

      <div className="content-area" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            創建{activeTab === 'users' ? '用戶' : activeTab === 'clinics' ? '診所' : '患者'}
          </Button>
        </div>

        <Table
          columns={
            activeTab === 'users' ? userColumns :
            activeTab === 'clinics' ? clinicColumns :
            patientColumns
          }
          dataSource={
            activeTab === 'users' ? users :
            activeTab === 'clinics' ? clinics :
            patients
          }
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 條記錄`,
          }}
        />
      </div>

      <Modal
        title={`創建${activeTab === 'users' ? '用戶' : activeTab === 'clinics' ? '診所' : '患者'}`}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
        >
          {getCreateFormFields()}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                創建
              </Button>
              <Button onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;
