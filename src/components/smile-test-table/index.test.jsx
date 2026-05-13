import React from 'react';
import { render, screen } from '@testing-library/react';
import SmileTestTable from './index';

describe('SmileTestTable', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function matchMedia() {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    };

    global.ResizeObserver = global.ResizeObserver || class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders an antd-based smile test table with summary text', () => {
    render(
      <SmileTestTable
        items={[
          {
            rowKey: 'smile-1',
            id: '01',
            patientName: '王小明',
            phone: '0911111111',
            email: 'test@example.com',
            lineId: 'line-1',
            region: '台北市',
            createdAt: '2026/5/13 下午10:41:05',
            latestImageUploadTime: '2026/5/13 下午10:41:51',
            updatedAt: '2026/5/13 下午10:42:00',
            statusText: '创建患者信息',
            smileUuid: 'smile-1',
          },
        ]}
        timeColumns={[
          { key: 'createdAt', header: '创建时间' },
          { key: 'latestImageUploadTime', header: '图片上传时间' },
          { key: 'updatedAt', header: '更新时间' },
        ]}
        pagination={{ page: 1, page_size: 50, total: 1 }}
        totalSummaryText="共 1 条记录"
        createPatientLabel="创建患者信息"
        historyLabel="历史资料"
        labels={{
          seq: '编号',
          patientName: '患者名称',
          phone: '手机号码',
          email: '电子信箱',
          lineId: 'Line ID',
          region: '地址',
          download: '资料下载',
          status: '患者卡',
        }}
        expandedRowKeys={[]}
        onExpandedRowsChange={jest.fn()}
        onOpenHistory={jest.fn()}
        onOpenBind={jest.fn()}
        onPageChange={jest.fn()}
        renderExpandedContent={() => <div>展开内容</div>}
      />,
    );

    expect(document.querySelector('.ant-table')).toBeTruthy();
    expect(screen.getByText('共 1 条记录')).toBeInTheDocument();
    expect(screen.getByText('王小明')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '创建患者信息' })).toBeInTheDocument();
  });
});
