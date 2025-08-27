import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Button, message, Space, Tag } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import apiService from '../../services/api';
import './index.scss';

const HistoryModal = ({ 
  open, 
  onCancel, 
  smileTestUuid, 
  userType = 'patient' // 'patient' | 'doctor' | 'admin'
}) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [messageApi, messageCtx] = message.useMessage();

  // 获取文件列表
  const loadFiles = useCallback(async () => {
    if (!smileTestUuid) return;
    
    try {
      setLoading(true);
      const result = await apiService.getSmileTestFiles(smileTestUuid);
      
      if (result.success && Array.isArray(result.data)) {
        // 根据用户类型过滤文件
        let filteredFiles = result.data;
        
        if (userType === 'patient') {
          // 患者只显示微笑测试图片
          filteredFiles = result.data.filter(file => file.upload_type === 'smile_test');
        }
        // 其他用户（医生、管理员）显示所有文件
        
        // 过滤掉UUID为null的记录
        filteredFiles = filteredFiles.filter(file => file.uuid && file.uuid !== 'null');
        
        console.log(`📊 文件列表:`, filteredFiles.map(f => ({ 
          uuid: f.uuid, 
          fileName: f.file_name, 
          type: f.upload_type 
        })));
        
        // 按最新日期排序
        filteredFiles.sort((a, b) => {
          const dateA = new Date(a.upload_time || a.created_at);
          const dateB = new Date(b.upload_time || b.created_at);
          return dateB - dateA;
        });
        
        setFiles(filteredFiles);
      } else {
        setFiles([]);
        if (result.message) {
          messageApi.warning(result.message);
        }
      }
    } catch (error) {
      console.error('加载文件列表失败:', error);
      messageApi.error('加载文件列表失败');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [smileTestUuid, userType, messageApi]);

  // 下载文件
  const handleDownload = useCallback(async (fileUuid, fileName) => {
    try {
      console.log(`🔍 开始下载文件:`, { fileUuid, fileName });
      
      if (!fileUuid || fileUuid === 'null') {
        messageApi.error({ content: '文件UUID无效', key: 'download' });
        return;
      }
      
      messageApi.loading({ content: '正在下载...', key: 'download' });
      
      const result = await apiService.downloadFile(fileUuid);
      
      if (result.success && result.data) {
        const blob = result.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // 从响应头中获取文件名，如果没有则使用默认文件名
        let downloadFileName = fileName || 'file';
        console.log('🔍 文件名处理:', {
          originalFileName: fileName,
          resultFilename: result.filename,
          finalFileName: result.filename || fileName
        });
        
        if (result.filename) {
          downloadFileName = result.filename;
        }
        
        console.log('📁 最终下载文件名:', downloadFileName);
        a.download = downloadFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        
        messageApi.success({ content: '下载成功', key: 'download' });
      } else {
        messageApi.error({ content: result.message || '下载失败', key: 'download' });
      }
    } catch (error) {
      console.error('下载失败:', error);
      messageApi.error({ content: '下载失败', key: 'download' });
    }
  }, [messageApi]);

  // 删除文件
  const handleDelete = useCallback(async (fileUuid, fileName) => {
    try {
      messageApi.loading({ content: '正在删除...', key: 'delete' });
      
      const result = await apiService.deleteFile(fileUuid);
      
      if (result.success) {
        messageApi.success({ content: '删除成功', key: 'delete' });
        // 重新加载文件列表
        loadFiles();
      } else {
        messageApi.error({ content: result.message || '删除失败', key: 'delete' });
      }
    } catch (error) {
      console.error('删除失败:', error);
      messageApi.error({ content: '删除失败', key: 'delete' });
    }
  }, [messageApi, loadFiles]);

  // 格式化文件类型显示
  const formatFileType = (uploadType) => {
    switch (uploadType) {
      case 'smile_test':
        return <Tag color="blue">微笑測試</Tag>;
      case 'oral_scan':
        return <Tag color="green">口掃文件</Tag>;
      default:
        return <Tag color="default">{uploadType}</Tag>;
    }
  };

  // 格式化时间显示
  const formatTime = (timeStr) => {
    if (!timeStr) return '—';
    return dayjs(timeStr).format('YYYY/MM/DD/HH:mm');
  };

  // 表格列定义
  const columns = [
    {
      title: '編號',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => String(index + 1).padStart(2, '0'),
    },
    {
      title: '文件名稱',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (fileName, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {formatFileType(record.upload_type)}
          </div>
          <div style={{ color: '#666', fontSize: 12 }}>
            {formatTime(record.upload_time || record.created_at)}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.uuid, record.file_name)}
            style={{ padding: 0, color: '#52c41a' }}
          >
            下載
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.uuid, record.file_name)}
            style={{ padding: 0, color: '#ff4d4f' }}
          >
            刪除
          </Button>
        </Space>
      ),
    },
  ];

  // 当弹窗打开时加载数据
  useEffect(() => {
    if (open && smileTestUuid) {
      loadFiles();
    }
  }, [open, smileTestUuid, loadFiles]);

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        title="歷史資料"
        width={600}
        centered
        footer={[
          <Button key="close" onClick={onCancel}>
            關閉
          </Button>
        ]}
        destroyOnClose
      >
        <div className="history-modal-content">
          {files.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              暫無歷史資料
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={files}
              rowKey="uuid"
              pagination={false}
              loading={loading}
              size="small"
              scroll={{ y: 400 }}
            />
          )}
        </div>
      </Modal>
      {messageCtx}
    </>
  );
};

export default HistoryModal;
