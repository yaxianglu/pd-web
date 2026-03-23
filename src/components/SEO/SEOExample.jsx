import React from 'react';
import SEOHead from './SEOHead';
import { useSEO } from '../../hooks/useSEO';

// Example of how to use SEO in a page component
const InvisibleBracesPage = () => {
  // Option 1: Use the hook for automatic SEO
  useSEO('invisibleBraces');
  
  // Option 2: Use the SEOHead component for custom SEO
  const customSEO = {
    title: 'Custom Title for This Page',
    description: 'Custom description for this specific page',
    keywords: 'custom, keywords, for, this, page',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Custom Product Name"
    }
  };

  return (
    <div>
      {/* Option 1: Use SEOHead component */}
      <SEOHead
        title="Clear Aligners - FDA Cleared Invisible Braces | ShineSmile Digital"
        description="Discover ShineSmile clear aligners - FDA cleared, AI-powered invisible braces. Medical-grade materials, professional treatment planning, and precise tooth movement simulation for optimal orthodontic results."
        keywords="clear aligner, invisible braces, FDA cleared, AI orthodontics, transparent aligners, teeth straightening, orthodontic treatment, medical grade materials, 珍舒美，隱形牙套，隱形矯正，數位化矯正，美國品牌，AI技術，亞洲人數據庫，維持器， 美國FDA認證，台灣TFDA class II，台灣醫療器材，台灣製造工廠，國際醫療器材標準"
        url="/invisible-braces"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "ShineSmile Clear Aligners",
          "description": "FDA cleared clear aligners with AI-powered treatment planning",
          "brand": {
            "@type": "Brand",
            "name": "ShineSmile Digital"
          },
          "category": "Orthodontic Treatment",
          "offers": {
            "@type": "Offer",
            "priceRange": "$48,000 - $118,000"
          }
        }}
      />
      
      {/* Your page content */}
      <h1>Clear Aligners Page</h1>
      <p>This is an example of how to integrate SEO into your pages.</p>
    </div>
  );
};

export default InvisibleBracesPage;
