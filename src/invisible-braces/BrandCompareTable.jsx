import React from "react";
import png2 from '../asserts/2-white.svg';
import './BrandCompareTable.scss';
import CardWrapper from "../components/card-wrapper";
import { useLanguage } from '../context/LanguageContext';

export default function BrandCompareTable() {
  const { t } = useLanguage();
  
  const rowGroups = [
    {
      label: t('invisibleBraces.brandCompare.categories.quality'),
      color: "#78a9ee",
      rows: [
        t('invisibleBraces.brandCompare.metrics.material'),
        t('invisibleBraces.brandCompare.metrics.production'),
        t('invisibleBraces.brandCompare.metrics.certification'),
        t('invisibleBraces.brandCompare.metrics.service')
      ]
    },
    {
      label: t('invisibleBraces.brandCompare.categories.pricing'),
      color: "#b7d257",
      rows: [t('invisibleBraces.brandCompare.metrics.cost')]
    },
    {
      label: t('invisibleBraces.brandCompare.categories.technology'),
      color: "#f19b43",
      rows: [
        t('invisibleBraces.brandCompare.metrics.transparency'),
        t('invisibleBraces.brandCompare.metrics.software'),
        t('invisibleBraces.brandCompare.metrics.productionTime')
      ]
    }
  ];

  const brands = [
    { name: t('invisibleBraces.brandCompare.brands.iBrand'), isActive: false },
    { 
      name: (
        <div className="brand-logo">
          <img 
            src={png2} 
            alt="PEARL DIGITAL"
          />
          <span>{t('invisibleBraces.brandCompare.brands.pearlDigital')}</span>
        </div>
      ),
      isActive: true
    },
    { name: t('invisibleBraces.brandCompare.brands.zBrand'), isActive: false },
    { name: t('invisibleBraces.brandCompare.brands.dentalTech'), isActive: false }
  ];

  // 定义比较数据
  const compareData = {
    [t('invisibleBraces.brandCompare.metrics.material')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.material.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.material.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.material.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.material.dentalTech')
    },
    [t('invisibleBraces.brandCompare.metrics.production')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.production.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.production.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.production.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.production.dentalTech')
    },
    [t('invisibleBraces.brandCompare.metrics.certification')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.certification.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.certification.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.certification.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.certification.dentalTech')
    },
    [t('invisibleBraces.brandCompare.metrics.service')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.service.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.service.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.service.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.service.dentalTech')
    },
    [t('invisibleBraces.brandCompare.metrics.cost')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.cost.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.cost.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.cost.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.cost.dentalTech')
    },
    [t('invisibleBraces.brandCompare.metrics.transparency')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.transparency.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.transparency.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.transparency.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.transparency.dentalTech')
    },
    [t('invisibleBraces.brandCompare.metrics.software')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.software.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.software.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.software.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.software.dentalTech')
    },
    [t('invisibleBraces.brandCompare.metrics.productionTime')]: {
      [t('invisibleBraces.brandCompare.brands.iBrand')]: t('invisibleBraces.brandCompare.data.productionTime.iBrand'),
      [t('invisibleBraces.brandCompare.brands.pearlDigital')]: t('invisibleBraces.brandCompare.data.productionTime.pearlDigital'),
      [t('invisibleBraces.brandCompare.brands.zBrand')]: t('invisibleBraces.brandCompare.data.productionTime.zBrand'),
      [t('invisibleBraces.brandCompare.brands.dentalTech')]: t('invisibleBraces.brandCompare.data.productionTime.dentalTech')
    }
  };

  // 统计总行数
  const rows = rowGroups.reduce((arr, group) => [...arr, ...group.rows], []);
  // 用于左侧彩色分区合并单元格
  const getRowSpan = i => rowGroups[i].rows.length;

  return (
    <CardWrapper
      title={t('invisibleBraces.brandCompare.title')}
    >
      <div className="table-wrapper">
          <table className="compare-table">
            <colgroup>
              <col className="col-category" />
              <col className="col-metric" />
              <col className="col-brand" />
              <col className="col-brand" />
              <col className="col-brand" />
              <col className="col-brand" />
            </colgroup>
            <thead>
              <tr className="brand-header-row">
                <th colSpan={2} className="brand-header-spacer" aria-hidden="true" />
                {brands.map(({ name, isActive }, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`brand-header-cell ${isActive ? 'active' : 'inactive'}`}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
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
                        const brandName = typeof brand.name === 'string'
                          ? brand.name
                          : t('invisibleBraces.brandCompare.brands.pearlDigital');
                        const cellData = compareData[rowLabel]?.[brandName] || '';
                        return (
                          <td 
                            key={`brand-cell-${rowLabel}-${idx}`}
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
    </CardWrapper>
  );
}
