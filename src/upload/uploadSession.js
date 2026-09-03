// 微笑测试上传会话：id(uuid) + step 存 localStorage，不再放进 URL。
// 目的：杜绝“凭 URL 里的 id 访问他人上传信息”的泄漏路径。
// 规则：URL 里出现的任何 id 一律不采纳（见 upload/index.jsx），只信任 localStorage。
const KEY = 'pd_smile_upload_session';

export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });

const clampStep = (v) => Math.max(1, Math.min(4, Number(v) || 1));

// 读取当前会话；无效/不存在返回 null
export const getSession = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s && typeof s.id === 'string' && s.id) {
      return { id: s.id, step: clampStep(s.step) };
    }
  } catch (_) { /* ignore */ }
  return null;
};

// 写入会话
export const saveSession = (id, step = 1) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ id, step: clampStep(step) }));
  } catch (_) { /* ignore */ }
};

// 仅更新步骤（保留 id）
export const setStep = (step) => {
  const s = getSession();
  if (s) saveSession(s.id, step);
};

// 开启一份全新测试（生成新 uuid + step1，覆盖旧会话）
export const startNewSession = () => {
  const id = generateUUID();
  saveSession(id, 1);
  return { id, step: 1 };
};

// 指定 id 打开（供患者面板“上傳”用：定位到自己那份测试）
export const setSessionId = (id, step = 4) => {
  saveSession(id, step);
  return { id, step: clampStep(step) };
};

// 上传完成后清除会话
export const clearSession = () => {
  try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ }
};

// 供各 step 组件读取当前 uuid（替代原来从 URL 读 id）
export const getTestUuid = () => {
  const s = getSession();
  return s ? s.id : null;
};
