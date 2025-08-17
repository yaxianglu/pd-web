import React from 'react';
import './Help.scss';

export default function Help() {
  return (
    <div className="help-page">
      <div className="card">
        <div className="card-title">尋找幫助</div>
        <div className="help-content">
          <div className="help-section">
            <h3>常見問題</h3>
            <div className="faq-item">
              <h4>如何創建患者資料卡？</h4>
              <p>在患者列表頁面點擊右上角的「創建患者資料卡」按鈕，填寫患者基本信息後提交即可。</p>
            </div>
            <div className="faq-item">
              <h4>如何篩選患者狀態？</h4>
              <p>使用左側菜單的患者狀態篩選，或使用頂部的狀態下拉選單來篩選不同階段的患者。</p>
            </div>
            <div className="faq-item">
              <h4>如何修改個人信息？</h4>
              <p>點擊左側菜單的「個人設置」，在該頁面可以查看和修改個人信息及密碼。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
