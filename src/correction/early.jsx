import React from 'react';
import './early.scss';
import CardWrapper from '../components/card-wrapper';

export default function Early() {
  return (
    <CardWrapper title="早期矯正對青少年帶來的幫助">
      <div className="early-content">
        {/* <div className="early-content-title">
          預防牙齒擁擠與規劃恆齒齒列
        </div>
        <div className="early-content-subtitle">
          乳牙與恆齒交替(混合齒列)階段，可提早發現反咬、深咬或開咬等咬合異常問題
        </div> */}
        <div className="early-content-benefits">
        預防牙齒擁擠與未來齒列問題<br />
        促進正常顎骨發育，減少需外科手術機會<br />
        改善清潔死角，降低蛀牙與牙周風險<br />
        提升笑容自信與自我形象，有助校園生活與社交互動
        </div>
      </div>
    </CardWrapper>
  );
};
