import React from 'react';
import './ProductFeatures.scss';
import p8 from './imgs/8.svg';
import p9 from './imgs/9.svg';
import p10 from './imgs/10.svg';
import CardWrapper from '../components/card-wrapper';
import Grid from '../components/grid';

export default function ProductFeatures() {
  return (
    <CardWrapper title="微笑旅程中會有什麼額外費用嗎？">
      <div className="product-features-content">
        <div className="product-features-item product-features-item-1">
          隱形牙套不但全台均一價，更真正做到價格公開透明，絕無隱藏收費！為了讓你獲得預期中的全新笑容，我們的專業合作醫師將會進行口腔<br/>
          相關檢查與掃描。這些費用或是掛號費等額外支出，是不包括在我們的隱形牙套費用當中，將由診所取這些可能的額外費用。
        </div>
        <div className="product-features-item product-features-item-2">
          以下是在微笑旅程中，可能會遇到的額外費用：
        </div>
        <Grid>
          <div className="product-features-item-3-wrapper-item">
            <div className="product-features-item-3-wrapper-item-content">
              <div className="product-features-item-3-wrapper-item-content-title">牙醫諮詢費用</div>
              <div className="product-features-item-3-wrapper-item-content-price">$3,000*</div>
              <div className="product-features-item-3-wrapper-item-content-description">
                包括3D口腔掃描、<br/>
                X光及口腔檢查
              </div>
            </div>
            <div className="product-features-item-3-wrapper-item-image">
              <img src={p8} alt="p8" />
            </div>
          </div>
          <div className="product-features-item-3-wrapper-item">
            <div className="product-features-item-3-wrapper-item-content">
              <div className="product-features-item-3-wrapper-item-content-title">
                精緻微調<br/>
                再次口描費用
              </div>
              <div className="product-features-item-3-wrapper-item-content-price">$1,000*</div>
              <div className="product-features-item-3-wrapper-item-content-description">
              如果進行微調才需要
              </div>
            </div>
            <div className="product-features-item-3-wrapper-item-image">
              <img src={p9} alt="p8" />
            </div>
          </div>
          <div className="product-features-item-3-wrapper-item">
            <div className="product-features-item-3-wrapper-item-content">
              <div className="product-features-item-3-wrapper-item-content-title">透明維持器費用</div>
              {/* <div className="product-features-item-3-wrapper-item-content-price">$3,000*</div> */}
              <div className="product-features-item-3-wrapper-item-content-description">
                $11,500** 2副組<br/>
                $14,500** 3副組<br/>
                $18,000** 5副組
              </div>
            </div>
            <div className="product-features-item-3-wrapper-item-image">
              <img src={p10} alt="p8" />
            </div>
          </div>
        </Grid>
        <div className="product-features-item product-features-item-3">
        *任何與診所有關的治療或服務等，其費用會直接由診所收取。網站所示價格或有所更動，不代表為最終實際收費金額，請依診所最新收費資訊為主。<br/>
        ** 回診時主治醫師會根據口內情況，評估使用最後一副牙套齒列，或是重新口掃製作維持器。維持器價格將會依市場變動而有所調整，實際價格請聯繫客服。
        </div>
      </div>
    </CardWrapper>
  );
} 