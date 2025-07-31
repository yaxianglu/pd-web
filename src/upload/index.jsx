import { useState } from 'react';
import p2 from '../asserts/2.svg';
import Introduce from './introduce';
import Step from './step';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import './index.scss';

export default function Upload() {
  const [step, setStep] = useState(1);
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