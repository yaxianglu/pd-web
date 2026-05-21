import React from 'react';
import { render } from '@testing-library/react';

jest.mock('antd', () => {
  const React = require('react');
  const table = jest.fn(() => <div data-testid="mock-table" />);
  table.EXPAND_COLUMN = 'EXPAND_COLUMN';

  return {
    Pagination: () => <div data-testid="mock-pagination" />,
    Table: table,
    Tooltip: ({ children }) => <>{children}</>,
    __mockTable: table,
  };
});

import SmileTestTable from './index';

const { __mockTable: mockTable } = jest.requireMock('antd');

describe('SmileTestTable sticky scroll config', () => {
  beforeEach(() => {
    mockTable.mockClear();
  });

  it('passes sticky scroll support to the antd table', () => {
    render(
      <SmileTestTable
        items={[]}
        timeColumns={[]}
        pagination={{ page: 1, page_size: 50, total: 0 }}
        totalSummaryText="共 0 条记录"
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

    expect(mockTable).toHaveBeenCalledWith(
      expect.objectContaining({
        sticky: true,
        scroll: { x: 1908 },
      }),
      undefined,
    );
  });
});
