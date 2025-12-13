import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import Logout from '../components/logout';
import './index.scss';
import apiService from '../services/api';
import { message, Tag, Button, Modal, Popconfirm } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useLanguage } from '../context/LanguageContext';

// const { Search } = Input;
// const { Option } = Select;

export default function Partners() {
  // const navigate = useNavigate();
  // const { logout, userType, userInfo } = useAuth();
  const { t, currentLanguage } = useLanguage();
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
        message.error(t('partners.messages.fetchFailed') + (result.message || t('errors.unknown')));
      }
    } catch (error) {
      console.error('获取合作夥伴列表失败:', error);
      message.error(t('partners.messages.networkError'));
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

  // 获取狀態文本（使用翻译）
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return t('common.status.active');
      case 'pending':
        return t('common.status.pending');
      case 'inactive':
        return t('common.status.inactive');
      case 'suspended':
        return t('common.status.suspended');
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
            <div className="th id">{t('partners.table.id')}</div>
            <div className="th name">{t('partners.table.name')}</div>
            <div className="th clinic">{t('partners.table.clinicName')}</div>
            <div className="th phone">{t('partners.table.phone')}</div>
            <div className="th email">{t('partners.table.email')}</div>
            <div className="th status">{t('partners.table.status')}</div>
            <div className="th created">{t('partners.table.registrationTime')}</div>
            <div className="th action">{t('partners.table.action')}</div>
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
                    <div className="td created">
                      {p.created_at ? new Date(p.created_at).toLocaleString(
                        currentLanguage === 'zh-TW' ? 'zh-TW' : 
                        currentLanguage === 'zh-CN' ? 'zh-CN' : 
                        'en-US'
                      ) : '-'}
                    </div>
                    <div className="td action" style={{ display: 'flex', gap: 8 }}>
                      <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => showDetail(p)}>{t('partners.buttons.view')}</Button>
                      {p.status === 'pending' && (
                        <>
                          <Popconfirm
                            title={t('partners.confirm.confirmAddTitle')}
                            description={t('partners.confirm.confirmAddDescription')}
                            okText={t('partners.confirm.ok')}
                            cancelText={t('partners.confirm.cancel')}
                            onConfirm={async () => {
                              try {
                                setLoading(true);
                                const r = await apiService.approvePartner(p.id);
                                if (r?.success) {
                                  message.success(t('partners.messages.clinicActivated'));
                                  fetchPartners();
                                } else {
                                  message.error(r?.message || t('partners.messages.operationFailed'));
                                }
                              } catch (err) {
                                console.error('approvePartner error:', err);
                                message.error(err?.message || t('partners.messages.operationFailed'));
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            <Button type="primary" size="small" disabled={loading}>{t('partners.buttons.confirmAdd')}</Button>
                          </Popconfirm>

                          <Popconfirm
                            title={t('partners.confirm.rejectTitle')}
                            description={t('partners.confirm.rejectDescription')}
                            okText={t('partners.confirm.ok')}
                            cancelText={t('partners.confirm.cancel')}
                            onConfirm={async () => {
                              try {
                                const r = await apiService.rejectPartner(p.id);
                                if (r?.success) {
                                  message.success(t('partners.messages.applicationRejected'));
                                  fetchPartners();
                                } else {
                                  message.error(r?.message || t('partners.messages.operationFailed'));
                                }
                              } catch (err) {
                                message.error(err?.message || t('partners.messages.operationFailed'));
                              }
                            }}
                          >
                            <Button danger size="small" disabled={loading}>{t('partners.buttons.reject')}</Button>
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
        title={t('partners.modal.title')}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            {t('partners.buttons.close')}
          </Button>
        ]}
        width={800}
      >
        {selectedPartner && (
          <div className="partner-detail">
            <div className="detail-section">
              <h3>{t('partners.modal.basicInfo')}</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>{t('partners.table.name')}：</label>
                  <span>{selectedPartner.full_name || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t('partners.table.clinicName')}：</label>
                  <span>{selectedPartner.clinic_name || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t('partners.table.phone')}：</label>
                  <span>{selectedPartner.phone || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t('partners.table.email')}：</label>
                  <span>{selectedPartner.email || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t('partners.modal.yearsExperience')}：</label>
                  <span>{selectedPartner.years_experience ? `${selectedPartner.years_experience}${t('units.year')}` : '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t('partners.modal.treatmentCount')}：</label>
                  <span>{selectedPartner.treatment_count || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>{t('partners.table.status')}：</label>
                  <Tag color={getStatusColor(selectedPartner.status)}>
                    {getStatusText(selectedPartner.status)}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>{t('partners.modal.addressInfo')}</h3>
              <div className="detail-item full-width">
                <label>{t('partners.modal.address')}：</label>
                <span>{selectedPartner.address || '-'}</span>
              </div>
            </div>

            {selectedPartner.special_notes && (
              <div className="detail-section">
                <h3>{t('partners.modal.specialNotes')}</h3>
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