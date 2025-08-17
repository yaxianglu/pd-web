import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import p2 from '../asserts/2.svg';
import Introduce from './introduce';
import Step from './step';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import './index.scss';

export default function Upload() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // 生成UUID
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.floor(Math.random() * 16);
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  };

  // 将某些查詢參數寫回 URL（保留其餘參數）
  const updateQueryParams = (patch) => {
    const params = new URLSearchParams(location.search);
    Object.keys(patch).forEach((key) => {
      const value = patch[key];
      if (value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // 初始：確保存在 id，並從 URL 初始化 step
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let id = params.get('id');
    if (!id) {
      id = generateUUID();
      params.set('id', id);
    }

    const s = Math.max(1, Math.min(4, Number(params.get('step')) || 1));
    if (s !== step) {
      setStep(s);
    }

    // 可能新增了 id 或規整了 step，寫回 URL
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 當 URL 查詢中的 step 改變（例如使用瀏覽器前進/後退），同步到本地 state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = Math.max(1, Math.min(4, Number(params.get('step')) || 1));
    if (s !== step) setStep(s);
  }, [location.search, step]);

  // 封裝設置步驟：同時更新 URL
  const handleSetStep = (nextStep) => {
    const resolved = typeof nextStep === 'function' ? nextStep(step) : nextStep;
    const clamped = Math.max(1, Math.min(4, Number(resolved) || 1));
    setStep(clamped);
    updateQueryParams({ step: clamped });
  };

  return (
    <div className="upload-wrapper">
      <div className="upload-top">
        <img src={p2} alt="p2" />
        PEARL DIGITAL
      </div>
      <div className="upload-content-wrapper">
        <Introduce setStep={handleSetStep} style={{ display: step === 1 ? 'block' : 'none' }} />
        <Step step={step} />
        {step === 2 && <Step1 setStep={handleSetStep} style={{ display: step === 2 ? 'block' : 'none' }} />}
        {step === 3 && <Step2 setStep={handleSetStep} style={{ display: step === 3 ? 'block' : 'none' }} />}
        {step === 4 && <Step3 setStep={handleSetStep} style={{ display: step === 4 ? 'block' : 'none' }} />}
      </div>
      <div className="upload-bottom">
        <div className="upload-bottom-left">
          <img src={p2} alt="p2" />
          PEARL DIGITAL
        </div>
        <div className="upload-bottom-right">
          Pearl Digitalinc.<br />
          All Rights Reserved. ©2025<br />
          123 Demo StreetNew York, NY 12345<br />
          email@example.com(555)555-5555<br/>
        </div>
      </div>
    </div>
  );
}