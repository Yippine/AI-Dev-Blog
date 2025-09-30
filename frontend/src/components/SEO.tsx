// SEO Component
// SEO = MetaTags + OpenGraph + StructuredData

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  articleTags?: string[];
}

const SEO = ({
  title = 'Blog System',
  description = 'A modern blog system built with React, Node.js, and PostgreSQL',
  keywords = 'blog, articles, tech, programming',
  author = 'Blog System',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  publishedTime,
  modifiedTime,
  articleTags = [],
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Update Open Graph tags
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', image);
    updateMetaProperty('og:url', url);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:site_name', 'Blog System');

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');

    // Update article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaProperty('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        updateMetaProperty('article:modified_time', modifiedTime);
      }
      if (author) {
        updateMetaProperty('article:author', author);
      }
      articleTags.forEach(tag => {
        addMetaProperty('article:tag', tag);
      });
    }

    // Add JSON-LD structured data
    if (type === 'article' && publishedTime) {
      addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: image,
        author: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Blog System',
          logo: {
            '@type': 'ImageObject',
            url: '/logo.png',
          },
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        keywords: articleTags.join(', '),
      });
    } else {
      addStructuredData({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Blog System',
        description: description,
        url: url,
      });
    }
  }, [title, description, keywords, author, image, url, type, publishedTime, modifiedTime, articleTags]);

  return null;
};

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

// Helper function to update Open Graph meta properties
const updateMetaProperty = (property: string, content: string) => {
  updateMetaTag(property, content, 'property');
};

// Helper function to add multiple meta properties (for article tags)
const addMetaProperty = (property: string, content: string) => {
  const element = document.createElement('meta');
  element.setAttribute('property', property);
  element.setAttribute('content', content);
  document.head.appendChild(element);
};

// Helper function to add JSON-LD structured data
const addStructuredData = (data: any) => {
  // Remove existing structured data script
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

export default SEO;