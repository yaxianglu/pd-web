import React from 'react';
import Header from '../components/header';
import ProductFeatures from './ProductFeatures';
import ApplicableObjects from './ApplicableObjects';
import Footer from '../components/footer';
import FAQ from '../components/FAQ';
import PageWrapper from '../components/page-wrapper';
import Thumbnail from '../components/thumbnail';
import p14 from '../asserts/14.svg';
import Sketch from '../components/sketch';

export default function PageCom() {
  return (
    <>
      <Header />
      <PageWrapper>
        <Thumbnail
          title={<>穩定，<br />矯正成果</>}
          subtitle={<>矯正完成後，維持成果同樣關鍵。</>}
          button1="微笑測試"
          image={p14}
        />
        <Sketch
          title="穩定您的笑容升級成果"
          subtitle={<>
            珍舒美維持器專為穩定矯正後的牙齒而設計，無論您接受的是傳統矯正器或隱形矯正牙套<br/>療程，皆可有效防止牙齒再度變亂、保持咬合穩定，延續整齊笑容的成果。
            </>}
        />
        <ProductFeatures />
        <ApplicableObjects />
        <FAQ />
      </PageWrapper>
      <Footer />
    </>
  )
} 