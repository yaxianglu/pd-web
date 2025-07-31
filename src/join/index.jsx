import React from 'react';
import Header from '../components/header';
import ProductFeatures from './ProductFeatures';
import Footer from '../components/footer';
import Map from './map';

import PageWrapper from '../components/page-wrapper';
import Top from './top';
import JoinInfo from './join-info';

export default function PageCom() {
  return (
    <>
      <Header />
      <Top />
      <PageWrapper>
        <ProductFeatures />
        <Map />
      </PageWrapper>
      <JoinInfo />
      <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', paddingTop: 80 }}>
        <Footer style={{ backgroundColor: 'transparent', marginTop: 0 }} />
      </div>
      </>
  );
} 