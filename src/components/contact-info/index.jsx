import { contactInfoStyle } from "../../contants";

export default function ContactInfo({
  id,
  phone,
  email,
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <div style={contactInfoStyle}>用戶ID：{id}</div>
      <div style={contactInfoStyle}>聯繫方式：{phone}</div>
      <div style={contactInfoStyle}>信箱：{email}</div>
    </div>
  )
}