import { contactInfoStyle } from "../../contants";
import { message, Tooltip } from "antd";

export default function ContactInfo({
  id,
  phone,
  email,
}) {
  const handleCopy = async (text) => {
    if (!text || text === 'N/A') return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      message.info({ content: '複製成功', duration: 1 });
    } catch (e) {
      message.error('複製失敗');
      console.warn('Copy failed:', e);
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <Tooltip title={id || ''}>
        <div
          style={{ ...contactInfoStyle, cursor: id && id !== 'N/A' ? 'pointer' : 'default' }}
          onClick={() => handleCopy(id)}
        >
          用戶ID：{id}
        </div>
      </Tooltip>
      <Tooltip title={phone || ''}>
        <div style={contactInfoStyle} onClick={() => handleCopy(phone)}>聯繫方式：{phone}</div>
      </Tooltip>
      <Tooltip title={email || ''}>
        <div style={contactInfoStyle} onClick={() => handleCopy(email)}>信箱：{email}</div>
      </Tooltip>
    </div>
  )
}