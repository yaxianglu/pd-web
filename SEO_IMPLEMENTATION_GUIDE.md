# SEO Implementation Guide for Pearly Digital

This guide explains how to implement and use the SEO features added to the Pearly Digital website.

## Overview

The SEO implementation includes:
- Dynamic meta tags management
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Open Graph and Twitter Card support
- Multi-language support

## Files Added/Modified

### 1. SEO Components
- `src/components/SEO/SEOHead.jsx` - Main SEO component
- `src/components/SEO/seoConfig.js` - SEO configuration for all pages
- `src/hooks/useSEO.js` - Custom hooks for SEO management

### 2. SEO Files
- `public/sitemap.xml` - XML sitemap for search engines
- `public/robots.txt` - Robots.txt file for crawler instructions
- `public/index.html` - Updated with comprehensive meta tags

## How to Use

### Method 1: Using the useSEO Hook (Recommended)

```jsx
import React from 'react';
import { useSEO } from '../hooks/useSEO';

const YourPage = () => {
  // Automatically sets SEO based on page key
  useSEO('invisibleBraces');
  
  return (
    <div>
      {/* Your page content */}
    </div>
  );
};
```

### Method 2: Using the SEOHead Component

```jsx
import React from 'react';
import SEOHead from '../components/SEO/SEOHead';

const YourPage = () => {
  return (
    <div>
      <SEOHead
        title="Your Page Title"
        description="Your page description"
        keywords="keyword1, keyword2, keyword3"
        url="/your-page-url"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Your Page Name"
        }}
      />
      {/* Your page content */}
    </div>
  );
};
```

### Method 3: Custom SEO with useCustomSEO Hook

```jsx
import React from 'react';
import { useCustomSEO } from '../hooks/useSEO';

const YourPage = () => {
  const seoData = {
    title: 'Custom Title',
    description: 'Custom description',
    keywords: 'custom, keywords'
  };
  
  useCustomSEO(seoData);
  
  return (
    <div>
      {/* Your page content */}
    </div>
  );
};
```

## Available Page Keys

The following page keys are available in `seoConfig.js`:

- `home` - Homepage
- `invisibleBraces` - Clear aligners page
- `maintainer` - Retainers page
- `journey` - Treatment journey page
- `correction` - Orthodontic treatment page
- `about` - About us page
- `join` - Partner program page
- `upload` - Smile quiz page
- `faq` - FAQ page

## SEO Features

### 1. Meta Tags
- Title tags
- Meta descriptions
- Meta keywords
- Canonical URLs
- Open Graph tags (Facebook)
- Twitter Card tags

### 2. Structured Data
- MedicalBusiness schema
- Product schema
- FAQPage schema
- WebPage schema

### 3. Multi-language Support
- Hreflang tags for English, Traditional Chinese, and Simplified Chinese
- Language-specific URLs

### 4. Search Engine Optimization
- XML sitemap
- Robots.txt
- Proper URL structure
- Mobile-friendly meta tags

## Keywords Used

The SEO implementation includes comprehensive keywords related to:
- Clear aligners
- Invisible braces
- Orthodontics
- Teeth straightening
- FDA clearance
- AI orthodontics
- Medical grade materials
- Oral health
- Aesthetics
- ISO 13485
- GMP certification

## Implementation Steps

1. **Install react-helmet** (if not already installed):
   ```bash
   npm install react-helmet
   ```

2. **Import and use in your components**:
   ```jsx
   import { useSEO } from '../hooks/useSEO';
   // or
   import SEOHead from '../components/SEO/SEOHead';
   ```

3. **Update page components** to include SEO:
   ```jsx
   const YourPage = () => {
     useSEO('yourPageKey');
     return <div>Your content</div>;
   };
   ```

## Customization

### Adding New Pages
1. Add new page configuration to `seoConfig.js`
2. Use the page key in your component with `useSEO('newPageKey')`

### Custom Keywords
```jsx
import { generateKeywords } from '../components/SEO/seoConfig';

const customKeywords = generateKeywords(['custom', 'keywords'], true);
```

### Custom Structured Data
```jsx
const customStructuredData = {
  "@context": "https://schema.org",
  "@type": "YourSchemaType",
  "name": "Your Name",
  "description": "Your Description"
};
```

## Testing

1. **Google Search Console**: Submit sitemap and monitor indexing
2. **Facebook Sharing Debugger**: Test Open Graph tags
3. **Twitter Card Validator**: Test Twitter Card tags
4. **Google Rich Results Test**: Test structured data
5. **SEO Tools**: Use tools like Screaming Frog or SEMrush

## Maintenance

- Update sitemap.xml when adding new pages
- Review and update keywords regularly
- Monitor search console for errors
- Update structured data as needed
- Test all meta tags after changes

## Notes

- All URLs are configured for `https://pearl-digital.com`
- Update verification codes in `index.html` when available
- Add og-image.jpg to public folder for social sharing
- Consider adding more specific structured data for different page types
