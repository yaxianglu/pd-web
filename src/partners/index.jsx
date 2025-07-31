import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './index.scss';
import { apiService } from '../services/api';
import { message, Table, Input, Select, Tag, Space, Button, Modal } from 'antd';
import { SearchOutlined, EyeOutlined, ReloadOutlined, LogoutOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

export default function Partners() {
  const navigate = useNavigate();
  const { logout, userType, userInfo } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 获取合作夥伴列表
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const result = await apiService.getPartners();
      if (result.success) {
        setPartners(result.data || []);
      } else {
        message.error('获取合作夥伴列表失败：' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('获取合作夥伴列表失败:', error);
      message.error('获取合作夥伴列表失败：网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // 查看详情
  const showDetail = (record) => {
    setSelectedPartner(record);
    setDetailModalVisible(true);
  };

  // 获取状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'orange';
      case 'inactive':
        return 'red';
      case 'suspended':
        return 'red';
      default:
        return 'default';
    }
  };

  // 获取状态中文名称
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'pending':
        return '待审核';
      case 'inactive':
        return '非活跃';
      case 'suspended':
        return '已暂停';
      default:
        return status;
    }
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/login');
    message.success('已成功登出');
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 120,
    },
    {
      title: '诊所名称',
      dataIndex: 'clinic_name',
      key: 'clinic_name',
      width: 150,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '经验年数',
      dataIndex: 'years_experience',
      key: 'years_experience',
      width: 100,
      render: (text) => text ? `${text}年` : '-',
    },
    {
      title: '治疗数量',
      dataIndex: 'treatment_count',
      key: 'treatment_count',
      width: 100,
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (text) => text ? new Date(text).toLocaleString('zh-TW') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            size="small"
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = !searchText || 
      partner.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      partner.clinic_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      partner.phone?.includes(searchText) ||
      partner.email?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="partners-page">
      {/* 用户信息栏 */}
      <div className="user-info-bar" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e8e8e8',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          欢迎，{userType === 'staff' ? '工作人员' : '患者'} 
          {userInfo && (userInfo.username || userInfo.account)}
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          size="small"
        >
          登出
        </Button>
      </div>

      <div className="partners-filters">
        <div className="filters-left">
          <Search
            placeholder="搜索姓名、诊所名称、电话或邮箱"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={setSearchText}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120, marginLeft: 16 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="active">活跃</Option>
            <Option value="pending">待审核</Option>
            <Option value="inactive">非活跃</Option>
            <Option value="suspended">已暂停</Option>
          </Select>
        </div>
        <div className="filters-right">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPartners}
            loading={loading}
          >
            刷新
          </Button>
        </div>
      </div>

      <div className="partners-table">
        <Table
          columns={columns}
          dataSource={filteredPartners}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* 详情模态框 */}
      <Modal
        title="合作夥伴详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedPartner && (
          <div className="partner-detail">
            <div className="detail-section">
              <h3>基本信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>姓名：</label>
                  <span>{selectedPartner.full_name || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>诊所名称：</label>
                  <span>{selectedPartner.clinic_name || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>电话：</label>
                  <span>{selectedPartner.phone || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>邮箱：</label>
                  <span>{selectedPartner.email || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>经验年数：</label>
                  <span>{selectedPartner.years_experience ? `${selectedPartner.years_experience}年` : '-'}</span>
                </div>
                <div className="detail-item">
                  <label>治疗数量：</label>
                  <span>{selectedPartner.treatment_count || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>状态：</label>
                  <Tag color={getStatusColor(selectedPartner.status)}>
                    {getStatusText(selectedPartner.status)}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>地址信息</h3>
              <div className="detail-item full-width">
                <label>地址：</label>
                <span>{selectedPartner.address || '-'}</span>
              </div>
            </div>

            {selectedPartner.special_notes && (
              <div className="detail-section">
                <h3>特别备注</h3>
                <div className="detail-item full-width">
                  <span>{selectedPartner.special_notes}</span>
                </div>
              </div>
            )}

            <div className="detail-section">
              <h3>时间信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>注册时间：</label>
                  <span>{selectedPartner.created_at ? new Date(selectedPartner.created_at).toLocaleString('zh-TW') : '-'}</span>
                </div>
                <div className="detail-item">
                  <label>更新时间：</label>
                  <span>{selectedPartner.updated_at ? new Date(selectedPartner.updated_at).toLocaleString('zh-TW') : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 