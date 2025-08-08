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

  useEffect(() => {
    // 生成UUID
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    // 检查URL中是否已经有id参数
    const urlParams = new URLSearchParams(location.search);
    const existingId = urlParams.get('id');

    // 如果没有id参数，生成一个新的UUID并添加到URL
    if (!existingId) {
      const newId = generateUUID();
      const newUrl = `${location.pathname}?id=${newId}`;
      navigate(newUrl, { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="upload-wrapper">
      <div className="upload-top">
        <img src={p2} alt="p2" />
        PEARL DIGITAL
      </div>
      <div className="upload-content-wrapper">
        <Introduce setStep={setStep} style={{ display: step === 1 ? 'block' : 'none' }} />
        <Step step={step} />
        <Step1 setStep={setStep} style={{ display: step === 2 ? 'block' : 'none' }} />
        <Step2 setStep={setStep} style={{ display: step === 3 ? 'block' : 'none' }} />
        <Step3 setStep={setStep} style={{ display: step === 4 ? 'block' : 'none' }} />
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