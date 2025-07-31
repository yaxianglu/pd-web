import React from 'react';
import './ProductFeatures.scss';
import CardWrapper from '../components/card-wrapper';
import p14 from './imgs/14.png';
import p15 from './imgs/15.png';
import p16 from './imgs/16.png';
import p17 from './imgs/17.png';
import p18 from './imgs/18.png';
import Grid from '../components/grid';

export default function ProductFeatures() {
  return (
    <CardWrapper>
      <Grid>
        <div className="correction-dkfjsl-wrapper-item correction-dkfjsl-wrapper-item-tttt">
          因亞洲人的基因表現與顱顏<br/>
          特徵,常有以下牙齒排列與<br/>
          骨性咬合問題,進而影響整<br/>
          體臉型的外貌:
        </div>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p14} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">

            <div className="correction-dkfjsl-wrapper-item-title">
            上前牙突出（俗稱龅牙）
            </div>
            <div className="correction-dkfjsl-wrapper-item-description">
            導致嘴唇無法自然閉合、<br/>
            嘴型過度外凸。
            </div>
          </div>
        </div>
      </Grid>
      <Grid style={{ marginTop: '24px' }}>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p17} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
            下巴後縮（骨性二類）
            </div>
            <div className="correction-dkfjsl-wrapper-item-description">
            造成臉型比例失衡，視覺<br/>
            上顯得無神
            </div>
          </div>
        </div>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p18} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
          牙弓狹窄／擁擠
          </div>
          <div className="correction-dkfjsl-wrapper-item-description">
          讓臉型偏尖，易顯老態
          </div>
          </div>
        </div>
      </Grid>
      <Grid style={{ marginTop: '24px' }}>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p15} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
          <div className="correction-dkfjsl-wrapper-item-title">
            開咬
          </div>
          <div className="correction-dkfjsl-wrapper-item-description">
          影響發音與咀嚼效率，也<br/>
          使下半臉比例不協調
          </div>
          </div>
        </div>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p16} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
            深咬
          </div>
          <div className="correction-dkfjsl-wrapper-item-description">
            影響發音與咀嚼效率，也<br/>
            使下半臉比例不協調
          </div>
          </div>
        </div>
      </Grid>
    </CardWrapper>
  );
} 