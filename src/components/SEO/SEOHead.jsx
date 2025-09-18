import React, { useEffect } from 'react';

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  canonical,
  noindex = false
}) => {
  const baseUrl = 'https://pearl-digital.com';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/og-image.jpg`;

  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
      }
    }

    // Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        metaKeywords.content = keywords;
        document.head.appendChild(metaKeywords);
      }
    }

    // Update robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');
    } else {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      metaRobots.content = noindex ? 'noindex, nofollow' : 'index, follow';
      document.head.appendChild(metaRobots);
    }

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = canonical;
        document.head.appendChild(canonicalLink);
      }
    }

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:type', content: type },
      { property: 'og:url', content: fullUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: fullImage },
      { property: 'og:site_name', content: 'Pearly Digital' },
      { property: 'og:locale', content: 'en_US' }
    ];

    ogTags.forEach(tag => {
      if (tag.content) {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (metaTag) {
          metaTag.setAttribute('content', tag.content);
        } else {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', tag.property);
          metaTag.setAttribute('content', tag.content);
          document.head.appendChild(metaTag);
        }
      }
    });

    // Update Twitter tags
    const twitterTags = [
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: fullUrl },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: fullImage }
    ];

    twitterTags.forEach(tag => {
      if (tag.content) {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (metaTag) {
          metaTag.setAttribute('content', tag.content);
        } else {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', tag.property);
          metaTag.setAttribute('content', tag.content);
          document.head.appendChild(metaTag);
        }
      }
    });

    // Update structured data
    if (structuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, image, url, type, structuredData, canonical, noindex, fullUrl, fullImage]);

  return null; // This component doesn't render anything
};

export default SEOHead;
