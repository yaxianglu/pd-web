export default function InfoCardComponent() {
  return (
    <div style={{ display: "flex", gap: 22 }}>
      <div style={{
        flex: 2, background: "#78a9ee", borderRadius: "18px",
        color: "#fff", padding: 12, fontSize: 20
      }}>
        <div style={{ marginBottom: 12, borderBottom: "1px solid #fff", fontSize: 18, paddingBottom: 8 }}>主治醫師</div>
        <div style={{ fontSize: 14, margin: "10px 0 8px", textAlign: "left" }}>姓名：</div>
        <div style={{ fontSize: 14, margin: "8px 0", textAlign: "left" }}>診所地址：</div>
        <div style={{ fontSize: 14, margin: "8px 0", textAlign: "left" }}>聯繫方式：</div>
      </div>
      {/* 治療方案 */}
      <div style={{
        flex: 1, background: "#b7d257", borderRadius: "18px",
        color: "#fff", padding: 12, textAlign: "center", fontSize: 20
      }}>
        <div style={{ marginBottom: 12, borderBottom: "1px solid #fff", fontSize: 18, paddingBottom: 12 }}>治療方案</div>
        <div style={{ fontSize: 29, fontWeight: "bold", margin: "12px 0 5px" }}>輕度</div>
        <div style={{ fontSize: 16, color: "#e8f8b0" }}>(平均治療週期3~9個月)</div>
      </div>
      {/* 目前進度 */}
      <div style={{
        flex: 1, background: "#f19b43", borderRadius: "18px",
        color: "#fff", padding: 12, textAlign: "center", fontSize: 20
      }}>
        <div style={{ marginBottom: 12, borderBottom: "1px solid #fff", fontSize: 18, paddingBottom: 12 }}>目前進度</div>
        <div style={{ fontSize: 29, fontWeight: "bold", margin: "24px 0 2px" }}>等待支付</div>
      </div>
    </div>
  )
}