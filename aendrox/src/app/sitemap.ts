import type { MetadataRoute } from 'next';
import { SITE_URL, PAGES } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return Object.entries(PAGES).map(([path, page]) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified,
    changeFrequency: page.priority >= 0.8 ? 'weekly' : 'monthly',
    priority: page.priority,
  }));
}
