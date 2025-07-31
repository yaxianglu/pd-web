
import React, { useState } from "react";
import { useResponsive } from '../responsive-hook';
import "./index.scss";
import Table from "../table";
import { apiService } from "../../services/api";

const faqList = [
  {
    q: "隱形牙套療程流程是什麼？",
    a: (
      <>
        線上預約與自拍微笑照測試(免費服務)<br />
        診所進行詳細諮詢與CBCT/X光掃描<br />
        臨床醫師主導設計、AI輔助模擬,決定療程方案複雜度<br />
        確認療程計畫、簽署合約並進行付款<br />
        台灣 QMS/GMP 工廠製作牙套,約2-3週後回診領取<br />
        正式開始配戴,每天20-22小時,並定期回診追蹤
      </>
    )
  },
  {
    q: "隱形牙套需要配戴多久時間？",
    a: (
      <>
        一般建議每天配戴20-22小時,包含白天與夜間。除進食與刷牙時,其餘時間應全程配戴,以確保療程如預期進展。
      </>
    )
  },
  {
    q: "配戴後多久可以看到效果？",
    a: (
      <>
        大多數人在配戴2-4週內就能感受到明顯變化,例如前牙對齊或縫隙縮小。療程初期變化最快,最終結果需依整體療程進度評估。
      </>
    )
  },
  {
    q: "18 歲以下是否適用珍舒美隱形牙套？",
    a: (
      <>
        我們提供專為青少年設計的療程選項。<br />
        具備穩定配戴習慣的<br />
        **中學階段學生(約12歲以上)**<br />
        **經由牙醫師評估後,即可進行療程規劃。**<br />
        若仍處於乳牙與恆牙交替期,將建議定期追蹤並待適齡再行矯正。
      </>
    )
  },
  {
    q: "珍舒美隱形牙套是否安全？",
    a: (
      <>
        • 我們使用**無**BPA 醫療級透明材質。<br />
        • 美國品牌 Pearl Digital Inc. 產品已通過FDA 認證。<br />
        • 台灣製造工廠擁有 ISO 13485 與QMS/GMP認證。<br />
        • 設計流程由共具有30多年經驗的療程規劃師團隊負責,AI僅為輔助工具確保每副牙套在材質、安全、設計與療效上都達國際醫療器材標準。
      </>
    )
  },
  {
    q: "珍舒美隱形牙套價格是多少?會有隱藏費用嗎?",
    a: (
      <>
        線上預約與自拍微笑照測試完全免費，醫師會根據上傳的口腔照片判斷是否適合治療。<br />
        若適合治療，將安排正式診間口腔評估(含3D口腔掃描與X光影像)，口腔掃描與X光檢查費用為 <strong>NT$3,000</strong>(由診所收費，實際金額依診所而定)。<br /><br />
        <Table list={[
          { k1: '療程方案', k2: '前牙微調, 輕度排列問題', k3: '定價' },
          { k1: '輕度', k2: '前牙微調, 輕度排列問題', k3: 'NT$48,000' },
          { k1: '中度', k2: '前牙+部分後牙, 中度排列或擁擠問題', k3: 'NT$98,000' },
          { k1: '重度', k2: '全口調整, 改善咬合與骨架對稱性', k3: 'NT$118,000' },
        ]} />
        <Table list={[
          { k1: '維持器組數', k2: '', k3: '定價' },
          { k1: '2入組', k2: '', k3: 'NT$11,000' },
          { k1: '3入組', k2: '', k3: 'NT$14,000' },
          { k1: '5入組', k2: '', k3: 'NT$16,000' },
        ]} />
        
        <strong>提醒：</strong>回診時主治醫師會根據最終牙套效果判斷是否可直接使用最後一副牙套齒列製作為維持器,或需要重新掃描製作維持器。如需再次口掃,診所將收取 NT$3,000(由診所收費)。<br /><br />
        
        我們致力於價格公開透明,無隱藏收費,所有費用皆於療程前由微笑專員與您說明清楚,讓您安心選擇、放心安排。
      </>
    )
  },
  {
    q: "付款方式有哪些?",
    a: (
      <>
        支持靈活付款方式：享受一次付清優惠，或申請分期付款。<br />
        支持所有主要付款工具：信用卡、銀行轉帳、行動支付。<br />
        旨在讓治療安排更輕鬆，減少您選擇的財務壓力。
      </>
    )
  },
  {
    q: "若我不滿意最終結果怎麼辦?",
    a: (
      <>
        治療結束後若需進一步微調,可再申請追加牙套,免除額外牙套費用。<br />
        如需重新掃描(CBCT/X光),診所將酌收重新掃描費用¥3000,這筆費用您將直接支付給診所。<br />
        讓您能獲得理想笑容,是我們的承諾與責任。
      </>
    )
  },
  {
    q: "療程中需要拔牙嗎?",
    a: (
      <>
        大多數 Bright 方案不需拔牙<br />
        Brighter 與 Brightest 方案需視患者牙齒擁擠與咬合狀況,由臨床醫師評估後決定,若需要拔牙,將在諮詢階段提前告知並協助安排。
      </>
    )
  }
];

export default function FaqsSection() {
  const [openIdxes, setOpenIdxes] = useState([0]);
  const [apiStatus, setApiStatus] = useState('');
  const { isMobile, isTablet } = useResponsive();

  const toggleFaq = (idx) => {
    setOpenIdxes(prev => {
      if (prev.includes(idx)) {
        return prev.filter(item => item !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  const testApiConnection = async () => {
    setApiStatus('Testing...');
    try {
      const result = await apiService.checkHealth();
      setApiStatus(`API Status: ${result.status} - ${result.message}`);
      console.log('API Test Result:', result);
    } catch (error) {
      setApiStatus('API Test Failed');
      console.error('API Test Error:', error);
    }
  };

  return (
    <div className="faqs-section">
      {/* 左侧标题 */}
      <div className="faqs-title-container">
        <div className="faqs-title">
          FAQs
        </div>
      </div>
      {/* 右侧列表 */}
      <div className="faqs-list-container">
        {faqList.map((item, idx) => (
          <div key={idx} className="faq-item">
            <div className="faq-content">
              <div
                onClick={() => toggleFaq(idx)}
                className="faq-question"
              >
                <span>{item.q}</span>
                <span className="faq-toggle-icon">
                  {openIdxes.includes(idx) ? "−" : "+"}
                </span>
              </div>
              {/* 展开内容 */}
              {openIdxes.includes(idx) && item.a && (
                <div className="faq-answer">
                  {item.a}
                </div>
              )}
            </div>
          </div>
        ))}

      <div className="faq-bottom-text">
        如您有進一步的疑問，建議透過 線上預約表單 提供照片與基本資料，<br />
        我們將儘速安排 顧問與專業醫師一對一回覆與解說。
      </div>
      
      {/* <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <h3>API 连接测试</h3>
        <button 
          onClick={testApiConnection}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          测试后端连接
        </button>
        {apiStatus && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: apiStatus.includes('ok') ? '#d4edda' : '#f8d7da',
            borderRadius: '4px',
            color: apiStatus.includes('ok') ? '#155724' : '#721c24'
          }}>
            {apiStatus}
          </div>
        )}
      </div> */}
      </div>
    </div>
  );
}
