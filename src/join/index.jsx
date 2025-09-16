import React from 'react';
import Header from '../components/header';
import Top from './top';
import PageWrapper from '../components/page-wrapper';
import ProductFeatures from './ProductFeatures';
import Map from './map';
import JoinInfo from './join-info';
import Footer from '../components/footer';

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