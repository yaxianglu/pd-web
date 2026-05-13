import React, { useMemo } from 'react';
import { Pagination, Table, Tooltip } from 'antd';
import './index.scss';

const SMILE_TEST_TABLE_SCROLL_X = 1908;

function TextCell({ value, strong = false }) {
  const displayValue = value || '—';

  return (
    <Tooltip title={displayValue === '—' ? null : displayValue} placement="topLeft">
      <span className={`smile-test-cell-text${strong ? ' strong' : ''}`}>{displayValue}</span>
    </Tooltip>
  );
}

function TimeCell({ value }) {
  if (!value || value === '—') {
    return <span className="smile-test-time empty">—</span>;
  }

  const [datePart, ...timeParts] = String(value).split(' ');
  const timePart = timeParts.join(' ');

  if (!timePart) {
    return <span className="smile-test-time single">{value}</span>;
  }

  return (
    <div className="smile-test-time">
      <span className="date">{datePart}</span>
      <span className="time">{timePart}</span>
    </div>
  );
}

export default function SmileTestTable({
  items,
  loading = false,
  timeColumns,
  pagination,
  totalSummaryText,
  createPatientLabel,
  historyLabel,
  labels,
  expandedRowKeys,
  onExpandedRowsChange,
  onOpenHistory,
  onOpenBind,
  onPageChange,
  renderExpandedContent,
}) {
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: labels.seq,
        dataIndex: 'id',
        key: 'seq',
        width: 88,
        render: (value) => <span className="smile-test-seq">{value}</span>,
      },
      {
        title: labels.patientName,
        dataIndex: 'patientName',
        key: 'patientName',
        width: 180,
        render: (value) => <TextCell value={value} strong />,
      },
      {
        title: labels.phone,
        dataIndex: 'phone',
        key: 'phone',
        width: 160,
        render: (value) => <TextCell value={value} />,
      },
      {
        title: labels.email,
        dataIndex: 'email',
        key: 'email',
        width: 240,
        render: (value) => <TextCell value={value} />,
      },
      {
        title: labels.lineId,
        dataIndex: 'lineId',
        key: 'lineId',
        width: 160,
        render: (value) => <TextCell value={value} />,
      },
      {
        title: labels.region,
        dataIndex: 'region',
        key: 'region',
        width: 120,
        render: (value) => <TextCell value={value} />,
      },
      ...timeColumns.map((column) => ({
        title: column.header,
        dataIndex: column.key,
        key: column.key,
        width: 200,
        render: (value) => <TimeCell value={value} />,
      })),
      {
        title: labels.download,
        dataIndex: 'smileUuid',
        key: 'download',
        width: 120,
        fixed: 'right',
        render: (_, row) => (
          <button
            type="button"
            className="smile-test-link-button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenHistory(row.smileUuid);
            }}
          >
            {historyLabel}
          </button>
        ),
      },
      {
        title: labels.status,
        dataIndex: 'statusText',
        key: 'status',
        width: 180,
        fixed: 'right',
        render: (value, row) => (
          value === createPatientLabel ? (
            <button
              type="button"
              className="create-patient-info-button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenBind(row.smileUuid);
              }}
            >
              {createPatientLabel}
            </button>
          ) : (
            <TextCell value={value} />
          )
        ),
      },
      {
        key: Table.EXPAND_COLUMN,
        width: 60,
        fixed: 'right',
      },
    ];

    return baseColumns;
  }, [createPatientLabel, historyLabel, labels, onOpenBind, onOpenHistory, timeColumns]);

  return (
    <div className="smile-test-table-card">
      <Table
        className="smile-test-table"
        columns={columns}
        dataSource={items}
        loading={loading}
        rowKey="rowKey"
        pagination={false}
        scroll={{ x: SMILE_TEST_TABLE_SCROLL_X }}
        rowClassName={() => 'smile-test-table-row'}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange,
          expandedRowRender: renderExpandedContent,
          columnWidth: 60,
        }}
      />

      <div className="smile-test-table-footer">
        <div className="smile-test-table-summary">{totalSummaryText}</div>
        <Pagination
          current={pagination.page}
          pageSize={pagination.page_size}
          total={pagination.total}
          showSizeChanger={false}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
