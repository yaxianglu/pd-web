import React, { useState } from 'react';
import './index.scss';

const DataTable = ({ 
  title, 
  subtitle, 
  columns, 
  data, 
  expandable = false,
  className = '' 
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (index) => {
    if (!expandable) return;
    
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className={`data-table-container ${className}`}>
      {/* 表格头部 */}
      <div className="table-header">
        <div className="header-left">
          <span className="title">{title}</span>
        </div>
        {subtitle && (
          <div className="header-right">
            <span className="subtitle">{subtitle}</span>
          </div>
        )}
      </div>
      
      <hr className="divider" />
      
      {/* 表格内容 */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} style={column.style}>
                  {column.title}
                </th>
              ))}
              {expandable && <th></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <React.Fragment key={row.id || index}>
                <tr 
                  className={`table-row ${index % 2 === 0 ? 'even' : 'odd'} ${expandedRows.has(index) ? 'expanded' : ''}`}
                  onClick={() => toggleRow(index)}
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={column.className || ''}
                      style={column.cellStyle}
                    >
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </td>
                  ))}
                  {expandable && (
                    <td className="expand-icon">
                      {expandedRows.has(index) ? '▾' : '▸'}
                    </td>
                  )}
                </tr>
                {/* 展开的详细信息 */}
                {expandable && expandedRows.has(index) && row.detail && (
                  <tr className="detail-row">
                    <td colSpan={columns.length + 1}>
                      <div className="detail-content">
                        <span className="detail-label">詳細備註:</span>
                        <span className="detail-text">{row.detail}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 