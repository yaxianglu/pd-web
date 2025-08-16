import { contactInfoStyle } from "../../contants";
import { message, Tooltip, Modal } from "antd";


export default function ContactInfo({
  list = [],
  style = {}
}) {
  const [messageApi, messageCtx] = message.useMessage();
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
      messageApi.success({ content: '複製成功', duration: 1 });
      try { Modal.success({ title: '提示', content: '已複製到剪貼簿', centered: true }); } catch {}
    } catch (e) {
      messageApi.error('複製失敗');
      console.warn('Copy failed:', e);
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, ...style }}>
      {messageCtx}
      {
        list.map((item, index) => {
          return (
            <Tooltip title={item.value || ''}>
              <div style={{ ...contactInfoStyle, cursor: item.value && item.value !== 'N/A' ? 'pointer' : 'default' }} onClick={() => handleCopy(item.value)}>
                {item.label}：{item.value}
              </div>
            </Tooltip>
          )
        })
      }
    </div>
  )
}