import './step.scss';

export default function Step({ step }) {
  if (step === 1) {
    return null;
  }
  return (
    <div className="step-wrapper">
      <div className={`step-content step-content-${step === 2 ? 'active' : ''}`} />
      <div className={`step-content step-content-${step === 3 ? 'active' : ''}`} />
      <div className={`step-content step-content-${step === 4 ? 'active' : ''}`} />
    </div>
  );
}
