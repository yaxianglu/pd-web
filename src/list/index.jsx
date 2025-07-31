import React, { useState } from "react";

const ROWS = [
  {
    id: "01",
    name: "蔣权",
    location: "台南",
    ip: "台南",
    download: "壓縮包",
    detail: "詳細描述：於2025.06.30日測試，於06.30下午已聯繫患者。",
    status: "已閱",
    action: "創建患者信息",
    expanded: true,
  },
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `0${i + 2}`,
    name: "蔣权",
    location: "台南",
    ip: "台南",
    download: "壓縮包",
    detail: "",
    status: "未讀",
    action: "創建患者信息",
    expanded: false,
  })),
];

export default function SmileTestTable() {
  const [expandedIdx, setExpandedIdx] = useState(0);

  return (
    <div style={{
      background: "#fff",
      borderRadius: "18px",
      padding: "32px 0 32px 0",
      boxSizing: "border-box",
      width: "90vw",
      maxWidth: 1100,
      margin: "40px auto",
      minHeight: "660px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0 42px 12px 42px",
        fontSize: "20px",
        color: "#7d868d",
        fontWeight: 500
      }}>
        <span>微笑測試</span>
        <span>業務ID：32012310010</span>
      </div>
      <hr style={{ border: "none", borderTop: "1.5px solid #e3eaf0", margin: "6px 0 12px"}} />
      {/* Table */}
      <div style={{ margin: "0 18px" }}>
        <table style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: "17px"
        }}>
          <thead>
            <tr style={{ background: "#b7e3e3" }}>
              <th style={th}>編號</th>
              <th style={th}>患者名稱</th>
              <th style={th}>IP</th>
              <th style={th}>資料下載</th>
              <th style={th}>對應</th>
              <th style={th}>狀態</th>
              <th style={{ ...th, width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, idx) => (
              <React.Fragment key={row.id}>
                <tr
                  style={{
                    background: idx % 2 === 0 ? "#d7f2f0" : "#b7e3e3",
                    cursor: "pointer",
                  }}
                >
                  <td style={td}>{row.id}</td>
                  <td style={td}>{row.name}</td>
                  <td style={td}>{row.location}</td>
                  <td style={{ ...td, color: "#156f7d", fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}>
                    {row.download}
                  </td>
                  <td style={{ ...td, color: "#495357" }}>{row.action}</td>
                  <td style={{ ...td, color: row.status === "已閱" ? "#2ca956" : "#888" }}>{row.status}</td>
                  <td
                    style={{ ...td, textAlign: "center", width: 50, fontSize: 19, padding: 0 }}
                    onClick={() => setExpandedIdx(idx === expandedIdx ? -1 : idx)}
                  >
                    {expandedIdx === idx ? "▾" : "▸"}
                  </td>
                </tr>
                {/* 展开行 */}
                {expandedIdx === idx && row.detail && (
                  <tr>
                    <td colSpan={7} style={{
                      background: "#f5f6f6",
                      color: "#444",
                      fontSize: "16px",
                      padding: "20px",
                      borderBottomLeftRadius: "8px",
                      borderBottomRightRadius: "8px"
                    }}>
                      {row.detail}
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
}

const th = {
  textAlign: "left",
  padding: "14px 8px 14px 18px",
  color: "#000",
  fontWeight: "bold",
  fontSize: "17px"
};

const td = {
  padding: "13px 8px 13px 18px",
  background: "inherit",
  fontSize: "17px"
};
