import React from "react";
import png2 from '../asserts/2.svg';
import './BrandCompareTable.scss';

export default function BrandCompareTable() {
  const rowGroups = [
    {
      label: "品質",
      color: "#78a9ee",
      rows: ["牙套材質", "生產地點", "醫材認證", "客戶服務"]
    },
    {
      label: "收費",
      color: "#b7d257",
      rows: ["終端收費"]
    },
    {
      label: "技術",
      color: "#f19b43",
      rows: ["牙套透明度", "軟體模擬", "製作時間"]
    }
  ];

  const brands = [
    { name: "I牌", isActive: false },
    { 
      name: (
        <div className="brand-logo">
          <img 
            src={png2} 
            alt="PEARL DIGITAL"
          />
          <span>PEARL DIGITAL</span>
        </div>
      ),
      isActive: true
    },
    { name: "Z牌", isActive: false },
    { name: "牙技品牌", isActive: false }
  ];

  // 定义比较数据
  const compareData = {
    "牙套材質": {
      "I牌": "專利材質",
      "PEARL DIGITAL": "專利材質",
      "Z牌": "醫材認證材質",
      "牙技品牌": "一般牙技材質"
    },
    "生產地點": {
      "I牌": "墨西哥\n輸入進口",
      "PEARL DIGITAL": "台灣QMS\n醫療器材廠",
      "Z牌": "中國\n輸入進口",
      "牙技品牌": "牙技所自產"
    },
    "醫材認證": {
      "I牌": "台灣FDA認證\n台灣TFDA\nclass II\n醫材許可",
      "PEARL DIGITAL": "美國FDA認證\n台灣TFDA\nclass II\n醫材許可",
      "Z牌": "台灣TFDA\nclass II\n醫材許可",
      "牙技品牌": "X"
    },
    "客戶服務": {
      "I牌": "中南美洲客服",
      "PEARL DIGITAL": "台灣在地\n微笑管家",
      "Z牌": "APP追蹤",
      "牙技品牌": "品牌端"
    },
    "終端收費": {
      "I牌": "美國醫材品牌\n>20萬",
      "PEARL DIGITAL": "美國醫材品牌\n$48000起",
      "Z牌": "新加坡品牌\n$72000起",
      "牙技品牌": "牙技自產\n價格不透明"
    },
    "牙套透明度": {
      "I牌": "中等\n有明顯條紋",
      "PEARL DIGITAL": "高透明度",
      "Z牌": "霧面\n不清晰",
      "牙技品牌": "視生產而定\n無品質管理系統"
    },
    "軟體模擬": {
      "I牌": "○",
      "PEARL DIGITAL": "○\n合法軟體醫材",
      "Z牌": "○",
      "牙技品牌": "X"
    },
    "製作時間": {
      "I牌": "2-3周",
      "PEARL DIGITAL": "5個工作日",
      "Z牌": "2-3周",
      "牙技品牌": "7-10天"
    }
  };

  // 统计总行数
  const rows = rowGroups.reduce((arr, group) => [...arr, ...group.rows], []);
  // 用于左侧彩色分区合并单元格
  const getRowSpan = i => rowGroups[i].rows.length;

  return (
    <div className="brand-compare-table">
      <div className="compare-container">
        <div className="compare-title">
          與其他品牌比較
        </div>
        {/* 表格主体 */}
        <div className="table-wrapper">
          {/* 品牌表头 */}
          <div className="brand-header">
            <div className="empty-cell"></div>
            {brands.map(({ name, isActive }, idx) => (
              <div
                key={idx}
                className={`brand-cell ${isActive ? 'active' : 'inactive'}`}
              >
                {name}
              </div>
            ))}
          </div>
          {/* 表格内容 */}
          <table className="compare-table">
            <tbody>
              {rowGroups.map((group, groupIdx) => {
                const isLast = groupIdx === rowGroups.length-1;
                return  group.rows.map((rowLabel, rowIdx) => {
                  // 判断是否为第一个
                  let showCategory = rowIdx === 0;
                  const isLastGroup = rowIdx === group.rows.length-1;
                  return (
                    <tr key={group.label+rowLabel}>
                      {/* 左侧彩色分区标签 */}
                      {showCategory && (
                        <td
                          rowSpan={getRowSpan(groupIdx)}
                          className={`category-cell ${
                            groupIdx === 0 ? 'quality' : 
                            groupIdx === 1 ? 'pricing' : 'technology'
                          }`}
                        >
                          {group.label}
                        </td>
                      )}
                      {/* 指标内容 */}
                      <td className={`metric-cell ${isLast && isLastGroup ? 'last-row' : ''}`}>
                        {rowLabel}
                      </td>
                      {/* 各品牌数据单元格 */}
                      {brands.map((brand,idx) => {
                        const brandName = typeof brand.name === 'string' ? brand.name : 'PEARL DIGITAL';
                        const cellData = compareData[rowLabel]?.[brandName] || '';
                        return (
                          <td 
                            key={brand.name+idx} 
                            className={`brand-cell ${isLast && isLastGroup ? 'last-row' : ''}`}
                          >
                            <div className="cell-content">
                              {cellData}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
