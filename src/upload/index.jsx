import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import p2 from '../asserts/2.svg';
import Introduce from './introduce';
import Step from './step';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { smileTestApi } from '../services/smileTestApi';
import './index.scss';

export default function Upload() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lastValidatedIdRef = useRef(null);

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

  const clampStep = (value) => Math.max(1, Math.min(4, Number(value) || 1));

  // 初始：確保存在 id，並在渲染表單前驗證是否為過期連結
  useEffect(() => {
    let cancelled = false;

    const initializeUploadSession = async () => {
      const params = new URLSearchParams(location.search);
      let id = params.get('id');
      const hadIdInUrl = Boolean(id);
      const shouldBlockRender = !id || (hadIdInUrl && lastValidatedIdRef.current !== id);

      if (shouldBlockRender) {
        setIsInitializing(true);
      }

      let shouldReplace = false;

      if (!id) {
        id = generateUUID();
        params.set('id', id);
        lastValidatedIdRef.current = id;
        shouldReplace = true;
      }

      let nextStep = clampStep(params.get('step'));
      if (params.get('step') !== String(nextStep)) {
        params.set('step', String(nextStep));
        shouldReplace = true;
      }

      if (hadIdInUrl && id && lastValidatedIdRef.current !== id) {
        try {
          const result = await smileTestApi.validateSmileTestUuid(id);
          if (cancelled) return;

          if (!result.success && result.error_code === 'uuid_completed') {
            setIsCompleted(true);
            setIsInitializing(false);
            return;
          }

          if (
            !result.success &&
            (result.error_code === 'uuid_expired' || result.error_code === 'uuid_inactive')
          ) {
            const regeneratedId = generateUUID();
            params.set('id', regeneratedId);
            params.set('step', '1');
            lastValidatedIdRef.current = regeneratedId;
            nextStep = 1;
            shouldReplace = true;
            window.alert(t(result.error_code === 'uuid_inactive' ? 'upload.linkInactiveMessage' : 'upload.linkExpiredMessage'));
          } else {
            lastValidatedIdRef.current = id;
          }
        } catch (error) {
          console.error('Failed to validate upload UUID:', error);
          lastValidatedIdRef.current = id;
        }
      }

      if (cancelled) return;

      if (step !== nextStep) {
        setStep(nextStep);
      }

      if (shouldReplace) {
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
        return;
      }

      setIsInitializing(false);
    };

    initializeUploadSession();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, navigate, step, t]);

  // 當 URL 查詢中的 step 改變（例如使用瀏覽器前進/後退），同步到本地 state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = clampStep(params.get('step'));
    if (s !== step) setStep(s);
  }, [location.search, step]);

  // 封裝設置步驟：同時更新 URL，並在切換時觸發 touch 心跳
  const handleSetStep = (nextStep) => {
    const resolved = typeof nextStep === 'function' ? nextStep(step) : nextStep;
    const clamped = clampStep(resolved);
    setStep(clamped);
    updateQueryParams({ step: clamped });

    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      smileTestApi.touchSmileTestUuid(id).then((res) => {
        if (res && res.error_code === 'uuid_completed') {
          setIsCompleted(true);
        } else if (res && res.error_code === 'uuid_inactive') {
          const regeneratedId = generateUUID();
          const next = new URLSearchParams(location.search);
          next.set('id', regeneratedId);
          next.set('step', '1');
          lastValidatedIdRef.current = regeneratedId;
          window.alert(t('upload.linkInactiveMessage'));
          navigate(`${location.pathname}?${next.toString()}`, { replace: true });
        }
      });
    }
  };

  if (isInitializing) {
    return (
      <div className="upload-wrapper">
        <div className="upload-top">
          <img src={p2} alt="p2" />
          {t('upload.brandName')}
        </div>
        <div className="upload-content-wrapper">
          <div className="step1-wrapper">
            <div className="step1-content">
              <div className="loading">{t('upload.step1Form.loading')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="upload-wrapper">
        <div className="upload-top">
          <img src={p2} alt="p2" />
          {t('upload.brandName')}
        </div>
        <div className="upload-content-wrapper">
          <div className="step1-wrapper">
            <div className="step1-content">
              <div className="loading">{t('upload.linkCompletedMessage')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-wrapper">
      <div className="upload-top">
        <img src={p2} alt="p2" />
        {t('upload.brandName')}
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
          {t('upload.brandName')}
        </div>
        <div className="upload-bottom-right">
          {t('upload.footer.company')}<br />
          {t('upload.footer.rights')}<br />
          {t('upload.footer.address')}<br />
          {t('upload.footer.contact')}<br/>
        </div>
      </div>
    </div>
  );
}
