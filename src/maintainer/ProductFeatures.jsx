import React from 'react';
import './ProductFeatures.scss';
import CardWrapper from '../components/card-wrapper';
import ImageCompareWrapper from '../components/image-compare-wrapper';
import p11 from './imgs/11.svg';
import p12 from './imgs/12.svg';
import p21 from './imgs/21.svg';
import p22 from './imgs/22.svg';
import p31 from './imgs/31.svg';
import p32 from './imgs/32.svg';
import p41 from './imgs/41.svg';
import p42 from './imgs/42.svg';

export default function ProductFeatures() {
  return (
    <CardWrapper title="產品特點">
      <ImageCompareWrapper 
        title={<>
          口內貼合度高, <br />
          邊緣光滑, 佩戴舒適</>}
        description={<>
          每副維持器皆根據個人牙模精細製作, 邊緣經<br/>
          拋光處理, 減少對口腔軟組織的摩擦, 長時間<br/>
          佩戴依然貼合自然。</>}
        image1={p12}
        image2={p11}
      />
      <ImageCompareWrapper 
        title={<>
          高透明度, <br />
          幾乎看不見
        </>}
        description={<>
          採用醫療級高透明材質，即使在近距離交談<br/>
          中，也不易被察覺，讓您自信應對日常與社交<br/>
          場景。
        </>}
        image1={p22}
        image2={p21}
      />
      <ImageCompareWrapper 
        title={<>
          抗染色性強，<br />
          不易變黃
        </>}
        description={<>
          能有效抵抗咖啡、茶、紅酒等色素滲透，維持<br/>
          清透外觀與衛生感。
        </>}
        image1={p31}
        image2={p32}
      />
      <ImageCompareWrapper 
        title={<>
          高強度，穩定性好，<br />
          不易變形
        </>}
        description={<>
          具備優良彈性與回復力，即使長期配戴也不易<br/> 
          變形，確保咬合穩定與矯正成果。
        </>}
        image1={p42}
        image2={p41}
      />
    </CardWrapper>
  );
} 