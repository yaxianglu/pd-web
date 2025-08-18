import { l as progressTitles } from "../progress";
import { useMemo, useState } from "react";
import TreatmentSelection from "../update-model";
import { useAuth } from '../../context/AuthContext';
import { message } from "antd";
const m = {
  1: {
    title: '輕度',
    subtitle: '平均週期3~9個月',
  },
  2: {
    title: '中度',
    subtitle: '平均週期9~15個月',
  },
  3: {
    title: '重度',
    subtitle: '平均週期15~22個月',
  },
  4: {
    title: '2組入',
  },
  5: {
    title: '3組入',
  },
  6: {
    title: '5組入',
  },
}
export default function InfoCardComponent({ doctorName, clinicAddress, contact, treatmentProgress, hobbies, onUpdate }) {
  console.info('treatmentProgress', treatmentProgress);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const { userInfo } = useAuth();
  const [updateId, setUpdateId] = useState(null);
  const handleUpdate = () => {
    if (!updateId) {
      message.error('請選擇治療方案');
      return;
    }
    setShowUpdateModel(false);
    setUpdateId(null);
    onUpdate && onUpdate(updateId);
  }
  const role = useMemo(() => {
    try {
      return userInfo?.role;
    } catch {
      return null;
    }
  }, [userInfo])
  return (
    <div style={{ display: "flex", gap: 22 }}>
      <div style={{
        flex: 2, background: "#78a9ee", borderRadius: "18px",
        color: "#fff", padding: 12, fontSize: 20
      }}>
        <div style={{ marginBottom: 12, borderBottom: "1px solid #fff", fontSize: 18, paddingBottom: 8 }}>主治醫師</div>
        <div style={{ fontSize: 14, margin: "10px 0 8px", textAlign: "left" }}>姓名：{doctorName || 'N/A'}</div>
        <div style={{ fontSize: 14, margin: "8px 0", textAlign: "left" }}>診所地址：{clinicAddress || 'N/A'}</div>
        <div style={{ fontSize: 14, margin: "8px 0", textAlign: "left" }}>聯繫方式：{contact || 'N/A'}</div>
      </div>
      {/* 治療方案 */}
      <div style={{
        flex: 1, background: "#b7d257", borderRadius: "18px",
        color: "#fff", padding: 12, textAlign: "center", fontSize: 20,
        position: "relative",
      }}
      onClick={() => setShowUpdateModel(true)}
      >
        <div style={{ marginBottom: 12, borderBottom: "1px solid #fff", fontSize: 18, paddingBottom: 12 }}>治療方案</div>
        <div style={{ fontSize: 29, fontWeight: "bold", margin: "12px 0 5px" }}>{m[hobbies]?.title}</div>
        <div style={{ fontSize: 16, color: "#e8f8b0" }}>{m[hobbies]?.subtitle}</div>
        {
          showUpdateModel && (role === 'hospital') && (
            <TreatmentSelection
              title={<>
                {Object.keys(m).map(item => <div style={{ marginBottom: 6, cursor: 'pointer', color: updateId === item ? '#48d2ce' : '#000' }} onClick={() => setUpdateId(item)} key={item}>{m[item].title}</div>)}
              </>}
              style={{ height: 'auto' }}
              onCancel={() => setTimeout(() => {
                setShowUpdateModel(false);
                setUpdateId(null);
              }, 0)}
              onConfirm={() => setTimeout(() => {
                handleUpdate();
              }, 0)}
            />
          )
        }
      </div>
      {/* 目前進度 */}
      <div style={{
        flex: 1, background: "#f19b43", borderRadius: "18px",
        color: "#fff", padding: 12, textAlign: "center", fontSize: 20
      }}>
        <div style={{ marginBottom: 12, borderBottom: "1px solid #fff", fontSize: 18, paddingBottom: 12 }}>目前進度</div>
        <div style={{ fontSize: 29, fontWeight: "bold", margin: "24px 0 2px" }}>{progressTitles[Number(treatmentProgress) || 0]?.title || progressTitles[0]?.title}</div>
      </div>
    </div>
  )
}