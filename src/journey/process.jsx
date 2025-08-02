// SmileSteps.jsx
import React from "react";
import { useResponsive } from '../components/responsive-hook';
import "./process.scss";
import DetailButton from "../components/detail-button";
import p3 from './imgs/3.svg';
import p4 from './imgs/4.svg';
import p5 from './imgs/5.svg';
import p6 from './imgs/6.jpg';
import p7 from './imgs/7.svg';
// import Bezier from '../components/bezier';
import l1 from './imgs/l1.svg';
import l2 from './imgs/l2.svg';
import l3 from './imgs/l3.svg';
import l4 from './imgs/l4.svg';
import l5 from './imgs/l5.svg';

const steps = [
  {
    label: "STEP 1",
    labelColor: "#4777FA",
    title: "預約",
    src: p3,
    desc: (
      <>
        掃QR code前往<br/>與微笑管家確認特約診所<br/>與預約時間
        <br />
        <span className="free">免費</span>
      </>
    ),
  },
  {
    label: "STEP 2",
    labelColor: "#7BD641",
    title: "評估",
    src: p4,
    desc: (
      <>
        前往特約診所進行<br/>3D口腔掃描與X光<br/>檢查個別資料評估
        <br />
        <span className="price">$3,000(此費用為診所收取)</span>
      </>
    ),
  },
  {
    label: "STEP 3",
    labelColor: "#FF7837",
    title: "計畫",
    src: p5,
    desc: (
      <>
        報告兩週內回特約診所審核<br/>並同意您的專屬美齒計畫
        <br />
        <span className="price">$48,000-$118,00(此費用為診所收取)</span>
      </>
    ),
  },
  {
    label: "STEP 4",
    labelColor: "#FF7837",
    title: "旅程",
    src: p6,
    desc: (
      <>
        隱形牙套製作完成<br/>聽取醫師說明<br/>整套牙套一次領取<br/>視情況分批發放
        <br />
        <span className="free">免費</span>
      </>
    ),
  },
  {
    label: "STEP 5",
    labelColor: "#3AD2C8",
    title: "開懷",
    src: p7,
    desc: (
      <>
        透過微笑管家持續追蹤進度<br/>聯繫開懷不間斷<br/>計畫安心不中斷
        <br />
        <span className="free">免費</span>
      </>
    ),
  },
];

export default function SmileSteps() {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <div>
      <div className="smile-steps">
        <div className="smile-steps__column smile-steps__column">
          {steps.map(
            (step, i) => (
              <>
                <div className="smile-steps__box" key={step.label}>
                  {i % 2 === 0 ? null : <img src={step.src} alt={step.title} className="smile-steps__image-placeholder" />}
                  <div className="smile-steps__content">
                    <div
                      className="smile-steps__step-label"
                      style={{ backgroundColor: step.labelColor }}
                    >
                      {step.label}
                    </div>
                    <div className="smile-steps__step-title">{step.title}</div>
                    <div className="smile-steps__step-desc">{step.desc}</div>
                  </div>
                  {i % 2 === 1 ? null : <img src={step.src} alt={step.title} className="smile-steps__image-placeholder" />}
              </div>
                </>
              )
          )}
        </div>
        <div className="smile-steps__centerline">
          <div className="smile-steps__centerline-item" style={{ backgroundImage: `url(${l1})`, backgroundPosition: '30% 70%' }}/>
          <div className="smile-steps__centerline-item" style={{ backgroundImage: `url(${l2})`, backgroundPosition: '70% 30%' }}/>
          <div className="smile-steps__centerline-item" style={{ backgroundImage: `url(${l3})`, backgroundPosition: '30% 70%' }}/>
          <div className="smile-steps__centerline-item" style={{ backgroundImage: `url(${l4})`, backgroundPosition: '70% 30%' }}/>
          <div className="smile-steps__centerline-item" style={{ backgroundImage: `url(${l5})`, backgroundPosition: '30% 70%' }}/>
        </div>
        {/* <div className="smile-steps__centerline">
          <Bezier direction="left" color="#76Aaff" circlePosition="top" />
          <Bezier direction="right" color="#7BD641" />
          <Bezier direction="left" color="#FF7837" />
          <Bezier direction="right" color="#3AD2C8" />
          <Bezier direction="left" color="#C1DF1A" circlePosition="bottom" circleColor="#C1DF1A" />
        </div> */}

      </div>
      <DetailButton text="開啟微笑旅程" />
    </div>
  );
}
