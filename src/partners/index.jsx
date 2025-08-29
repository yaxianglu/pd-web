import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import Logout from '../components/logout';
import './index.scss';
import apiService from '../services/api';
import { message, Tag, Button, Modal, Popconfirm } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

// const { Search } = Input;
// const { Option } = Select;

export default function Partners() {
  // const navigate = useNavigate();
  // const { logout, userType, userInfo } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText] = useState('');
  const [statusFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  // 展开交互已移除
  // const [expanded, setExpanded] = useState({});

  // 获取合作夥伴列表
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const result = await apiService.get('/api/partners');
      if (result.success) {
        setPartners(result.data || []);
      } else {
        message.error('获取合作夥伴列表失败：' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('获取合作夥伴列表失败:', error);
              message.error('獲取合作夥伴列表失敗：網路錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // 查看詳情
  const showDetail = (record) => {
    setSelectedPartner(record);
    setDetailModalVisible(true);
  };

  // 获取狀態标签颜色
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

  // 获取狀態中文名称
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

  // const onToggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  // 表格列改为 market 风格的表头网格在样式中定义

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
    <div className="partners-dashboard">
      <div className="partners-card">
        <div className="table">
          <div className="thead">
            <div className="th id">ID</div>
            <div className="th name">姓名</div>
            <div className="th clinic">診所名稱</div>
            <div className="th phone">電話</div>
            <div className="th email">郵箱</div>
            <div className="th status">狀態</div>
            <div className="th created">註冊時間</div>
            <div className="th action">操作</div>
            <div className="th caret" />
          </div>

          <div className="tbody">
            {filteredPartners.map((p) => {
              return (
                <div key={p.id} className="tr">
                  <div className="row-main">
                    <div className="td id">{p.id}</div>
                    <div className="td name">{p.full_name || '-'}</div>
                    <div className="td clinic">{p.clinic_name || '-'}</div>
                    <div className="td phone">{p.phone || '-'}</div>
                    <div className="td email">{p.email || '-'}</div>
                    <div className="td status"><Tag color={getStatusColor(p.status)}>{getStatusText(p.status)}</Tag></div>
                    <div className="td created">{p.created_at ? new Date(p.created_at).toLocaleString('zh-TW') : '-'}</div>
                    <div className="td action" style={{ display: 'flex', gap: 8 }}>
                      <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => showDetail(p)}>查看</Button>
                      {p.status === 'pending' && (
                        <>
                          <Popconfirm
                            title="確定添加？"
                            description="將建立診所資料並不可撤銷，確定繼續？"
                            okText="確認"
                            cancelText="取消"
                            onConfirm={async () => {
                              try {
                                setLoading(true);
                                const r = await apiService.approvePartner(p.id);
                                if (r?.success) {
                                  message.success('已建立診所並激活');
                                  fetchPartners();
                                } else {
                                  message.error(r?.message || '操作失敗');
                                }
                              } catch (err) {
                                console.error('approvePartner error:', err);
                                message.error(err?.message || '操作失敗');
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            <Button type="primary" size="small" disabled={loading}>確定添加</Button>
                          </Popconfirm>

                          <Popconfirm
                            title="拒絕該申請？"
                            description="拒絕申請後不可撤銷，確定繼續？"
                            okText="確認"
                            cancelText="取消"
                            onConfirm={async () => {
                              try {
                                const r = await apiService.rejectPartner(p.id);
                                if (r?.success) {
                                  message.success('已拒絕該申請');
                                  fetchPartners();
                                } else {
                                  message.error(r?.message || '操作失敗');
                                }
                              } catch (err) {
                                message.error(err?.message || '操作失敗');
                              }
                            }}
                          >
                            <Button danger size="small" disabled={loading}>拒絕</Button>
                          </Popconfirm>
                        </>
                      )}
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 詳情模態框 */}
      <Modal
        title="合作夥伴詳情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            關閉
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
                  <label>診所名稱：</label>
                  <span>{selectedPartner.clinic_name || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>電話：</label>
                  <span>{selectedPartner.phone || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>郵箱：</label>
                  <span>{selectedPartner.email || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>經驗年數：</label>
                  <span>{selectedPartner.years_experience ? `${selectedPartner.years_experience}年` : '-'}</span>
                </div>
                <div className="detail-item">
                  <label>治療數量：</label>
                  <span>{selectedPartner.treatment_count || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>狀態：</label>
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
                <h3>特別備註</h3>
                <div className="detail-item full-width">
                  <span>{selectedPartner.special_notes}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 