import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import apiService from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import '../market/index.scss';
import './account-management.scss';

const { Option } = Select;
const { TabPane } = Tabs;

const AccountManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('doctor');

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
        // 同時加載診所數據，用於顯示醫生綁定的診所
        const clinicRes = await apiService.getClinics();
        if (clinicRes?.success) {
          setClinics(clinicRes.data || []);
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

  // 加載診所數據（用於醫生綁定）
  const loadClinicsForDoctor = async () => {
    try {
      const res = await apiService.getClinics();
      if (res?.success) {
        setClinics(res.data || []);
      }
    } catch (error) {
      console.error('Failed to load clinics:', error);
      message.error('加載診所數據失敗');
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // 根据角色显示相应的管理模块
  const getVisibleTabs = () => {
    const userRole = currentUser?.role;
    const tabs = [];

    // 超級管理員可以管理所有賬戶
    if (userRole === 'super_admin') {
      tabs.push(
        { key: 'users', label: t('admin.tabs.userManagement'), icon: <UserOutlined /> },
        { key: 'clinics', label: t('admin.tabs.clinicManagement'), icon: <BankOutlined /> },
        { key: 'patients', label: t('admin.tabs.patientManagement'), icon: <TeamOutlined /> }
      );
    }
    // 普通管理員可以管理所有賬戶
    else if (userRole === 'admin') {
      tabs.push(
        { key: 'users', label: t('admin.tabs.userManagement'), icon: <UserOutlined /> },
        { key: 'clinics', label: t('admin.tabs.clinicManagement'), icon: <BankOutlined /> },
        { key: 'patients', label: t('admin.tabs.patientManagement'), icon: <TeamOutlined /> }
      );
    }
    // 醫院管理員可以管理診所、醫生、患者
    else if (userRole === 'hospital') {
      tabs.push(
        { key: 'clinics', label: t('admin.tabs.clinicManagement'), icon: <BankOutlined /> },
        { key: 'users', label: t('admin.tabs.doctorManagement'), icon: <UserOutlined /> },
        { key: 'patients', label: t('admin.tabs.patientManagement'), icon: <TeamOutlined /> }
      );
    }
    // 銷售專員可以管理診所、醫生、患者
    else if (userRole === 'market') {
      tabs.push(
        { key: 'clinics', label: t('admin.tabs.clinicManagement'), icon: <BankOutlined /> },
        { key: 'users', label: t('admin.tabs.doctorManagement'), icon: <UserOutlined /> },
        { key: 'patients', label: t('admin.tabs.patientManagement'), icon: <TeamOutlined /> }
      );
    }
    // 醫生只能管理患者
    else if (userRole === 'doctor') {
      tabs.push(
        { key: 'patients', label: t('admin.tabs.patientManagement'), icon: <TeamOutlined /> }
      );
    }

    return tabs;
  };

  // 創建賬戶
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

  // 刪除/關閉賬戶
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



  // 用户表格列
  const userColumns = [
    {
      title: t('admin.userColumns.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('admin.userColumns.name'),
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: t('admin.userColumns.role'),
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          admin: t('admin.roles.admin'),
          super_admin: t('admin.roles.superAdmin'),
          market: t('admin.roles.sales'),
          doctor: t('admin.roles.doctor'),
          hospital: t('admin.roles.manufacturer')
        };
        return <Tag color="blue">{roleMap[role] || role}</Tag>;
      }
    },
    {
      title: t('admin.userColumns.clinic'),
      dataIndex: 'department',
      key: 'department',
      render: (department, record) => {
        if (record.role === 'doctor' && department) {
          // 從診所列表中查找對應的診所名稱
          const clinic = clinics.find(c => c.uuid === department);
          return clinic ? clinic.clinic_name : department;
        }
        return '-';
      }
    },
    {
      title: t('admin.userColumns.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => date ? new Date(date).toLocaleString('zh-TW') : '-'
    },
    {
      title: t('admin.userColumns.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={t('admin.confirm.deleteUser')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('admin.confirm.ok')}
            cancelText={t('admin.confirm.cancel')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('admin.actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 診所表格列
  const clinicColumns = [
    {
      title: t('admin.clinicColumns.name'),
      dataIndex: 'clinic_name',
      key: 'clinic_name',
    },
    {
      title: t('admin.clinicColumns.code'),
      dataIndex: 'clinic_code',
      key: 'clinic_code',
    },
    {
      title: t('admin.clinicColumns.address'),
      dataIndex: 'address',
      key: 'address',
      render: (address, record) => {
        const parts = [record.city, record.district, address].filter(Boolean);
        return parts.join(', ');
      }
    },
    {
      title: t('admin.clinicColumns.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('admin.clinicColumns.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => date ? new Date(date).toLocaleString('zh-TW') : '-'
    },
    {
      title: t('admin.clinicColumns.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={t('admin.confirm.closeClinic')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('admin.confirm.ok')}
            cancelText={t('admin.confirm.cancel')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('admin.actions.close')}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 患者表格列
  const patientColumns = [
    {
      title: t('admin.patientColumns.name'),
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: t('admin.patientColumns.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('admin.patientColumns.gender'),
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        const genderMap = {
          male: t('admin.gender.male'),
          female: t('admin.gender.female'),
          other: t('admin.gender.other')
        };
        return genderMap[gender] || gender;
      }
    },

    {
      title: t('admin.patientColumns.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => date ? new Date(date).toLocaleString('zh-TW') : '-'
    },
    {
      title: t('admin.patientColumns.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={t('admin.confirm.closePatient')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('admin.confirm.ok')}
            cancelText={t('admin.confirm.cancel')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('admin.actions.close')}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 获取創建表单字段
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
            initialValue="pd2025!"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password placeholder="默認密碼: pd2025!" />
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
            <Select 
              onChange={(value) => {
                setSelectedRole(value);
                // 如果選擇醫生角色，加載診所數據
                if (value === 'doctor') {
                  loadClinicsForDoctor();
                }
                // 清除診所選擇，保持默認密碼
                createForm.setFieldsValue({ 
                  department: undefined,
                  password: 'pd2025!'
                });
              }}
            >
              <Option value="admin">普通管理員</Option>
              <Option value="market">銷售專員</Option>
              <Option value="doctor">醫生</Option>
            </Select>
          </Form.Item>
          {selectedRole === 'doctor' && (
            <Form.Item
              name="department"
              label="綁定診所"
              rules={[{ required: true, message: '請選擇診所' }]}
            >
              <Select
                placeholder="請選擇診所"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {clinics.map(clinic => (
                  <Option key={clinic.uuid} value={clinic.uuid}>
                    {clinic.clinic_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
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
            onClick={() => {
              setCreateModalVisible(true);
              setSelectedRole('doctor');
              createForm.resetFields();
              // 设置默认密码
              createForm.setFieldsValue({ password: 'pd2025!' });
              // 如果是用戶管理，預加載診所數據
              if (activeTab === 'users') {
                loadClinicsForDoctor();
              }
            }}
          >
{t('admin.createButton', { type: activeTab === 'users' ? t('admin.types.user') : activeTab === 'clinics' ? t('admin.types.clinic') : t('admin.types.patient') })}
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
            showTotal: (total) => t('admin.pagination.total', { total }),
          }}
        />
      </div>

      <Modal
        title={t('admin.createModal.title', { type: activeTab === 'users' ? t('admin.types.user') : activeTab === 'clinics' ? t('admin.types.clinic') : t('admin.types.patient') })}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setSelectedRole('doctor');
          createForm.resetFields();
          // 重置为默认密码
          createForm.setFieldsValue({ password: 'pd2025!' });
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
                setSelectedRole('doctor');
                createForm.resetFields();
                // 重置为默认密码
                createForm.setFieldsValue({ password: 'pd2025!' });
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
