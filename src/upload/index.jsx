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
import * as session from './uploadSession';
import './index.scss';

const clampStep = (value) => Math.max(1, Math.min(4, Number(value) || 1));

export default function Upload() {
  const { t } = useLanguage();
  // 用 ref 持有最新 t：t 每次渲染都是新函数，放进 effect 依赖会因语言自动检测重跑而卡住初始化。
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const [step, setStepState] = useState(1);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 初始化会话。核心安全规则：URL 里出现的任何 id 一律【不采纳】，
  // 只信任 localStorage；带 id/new/其它 query 的链接都清成干净的 /upload。
  useEffect(() => {
    let cancelled = false;

    const initializeUploadSession = async () => {
      const params = new URLSearchParams(location.search);
      const hasQuery = Boolean(location.search && location.search.length > 1);

      if (hasQuery) {
        // 带 id(老链接/泄漏链接) 或 new(各 CTA 入口) → 开一份全新测试，忽视 URL 里的 id
        if (params.has('id') || params.has('new')) {
          session.startNewSession();
        }
        // 无论何种 query，都把地址栏清干净；渲染逻辑留给“干净 URL”的这次重跑处理
        navigate('/upload', { replace: true });
        return;
      }

      // 干净的 /upload：从 localStorage 续填；没有则新建一份
      let current = session.getSession() || session.startNewSession();

      try {
        const result = await smileTestApi.validateSmileTestUuid(current.id);
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
          current = session.startNewSession();
          window.alert(tRef.current(result.error_code === 'uuid_inactive' ? 'upload.linkInactiveMessage' : 'upload.linkExpiredMessage'));
        }
      } catch (error) {
        // 校验失败/超时不阻塞进入（新建的 uuid 后端本就不存在，属正常）
        console.error('Failed to validate upload UUID:', error);
      }

      if (cancelled) return;
      setStepState(clampStep(current.step));
      setIsInitializing(false);
    };

    initializeUploadSession();

    return () => {
      cancelled = true;
    };
  }, [location.search, navigate]);

  // 封裝設置步驟：写入 localStorage，並在切換時觸發 touch 心跳
  const handleSetStep = (nextStep) => {
    const resolved = typeof nextStep === 'function' ? nextStep(step) : nextStep;
    const clamped = clampStep(resolved);
    setStepState(clamped);
    session.setStep(clamped);

    const current = session.getSession();
    if (current && current.id) {
      smileTestApi.touchSmileTestUuid(current.id).then((res) => {
        if (res && res.error_code === 'uuid_completed') {
          setIsCompleted(true);
        } else if (res && res.error_code === 'uuid_inactive') {
          // 15 分钟无操作失效：换新测试并重载到干净初始态
          session.startNewSession();
          window.alert(tRef.current('upload.linkInactiveMessage'));
          window.location.reload();
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
