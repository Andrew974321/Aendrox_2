import { services } from './data';

// The canonical address search engines should index. aendrox.in redirects here.
export const SITE_URL = (process.env.SITE_URL && !process.env.SITE_URL.includes('localhost')
  ? process.env.SITE_URL
  : 'https://www.aendrox.in').replace(/\/$/, '');

export const SITE_NAME = 'AENDROX';
export const SITE_TAGLINE = 'Engineering the Future.';
export const SITE_DESCRIPTION =
  'AENDROX is a software engineering company building custom software, AI & automation, SaaS products, websites, mobile apps, QA test automation and cloud DevOps solutions.';
export const OG_IMAGE = { url: '/og-image.jpg', width: 1200, height: 630, alt: 'AENDROX — Engineering the Future.' };

export const KEYWORDS = [
  'AENDROX', 'software development company', 'custom software development', 'AI automation',
  'SaaS development', 'website development', 'web application development', 'mobile app development',
  'QA test automation', 'cloud DevOps', 'UI/UX design', '3D web experiences', 'Next.js development',
];

type PageSeo = { title: string; description: string; priority: number };

// One entry per route: shown as the Google title and snippet for that page.
export const PAGES: Record<string, PageSeo> = {
  '': {
    title: 'AENDROX — Software, AI & Web Development Company',
    description: SITE_DESCRIPTION,
    priority: 1,
  },
  about: {
    title: 'About Us — Intelligent Software Engineering',
    description: 'Learn about AENDROX, a software technology brand building intelligent applications, scalable digital platforms and innovative technology experiences for growing businesses.',
    priority: 0.8,
  },
  services: {
    title: 'Software Development Services — AI, SaaS, Web & Mobile',
    description: 'Custom software development, AI & intelligent automation, SaaS product development, website and mobile app development, QA test automation, cloud & DevOps and UI/UX design by AENDROX.',
    priority: 0.9,
  },
  projects: {
    title: 'Projects & Product Concepts',
    description: 'Explore AENDROX product concepts across HRMS, AI testing, workflow automation and high-performance web applications built with Next.js, React, Node.js and PostgreSQL.',
    priority: 0.7,
  },
  skills: {
    title: 'Technology Stack & Skills',
    description: 'The modern technology toolkit behind AENDROX: React, Next.js, TypeScript, Node.js, cloud platforms, Docker, AI integrations, test automation and more.',
    priority: 0.7,
  },
  experience: {
    title: 'Expertise — Software, QA, Automation & Cloud',
    description: 'AENDROX capabilities across software engineering, quality engineering, automation, product development, AI-assisted workflows and cloud deployment.',
    priority: 0.6,
  },
  contact: {
    title: 'Contact Us — Start Your Software Project',
    description: 'Have a project in mind? Contact AENDROX to discuss custom software, AI automation, SaaS, website or mobile app development and get your idea built.',
    priority: 0.9,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How AENDROX collects, uses and protects information submitted through aendrox.in.',
    priority: 0.2,
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    description: 'Terms and conditions for using the AENDROX website and services.',
    priority: 0.2,
  },
};

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}

export const organizationLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
      image: `${SITE_URL}${OG_IMAGE.url}`,
      slogan: 'Intelligence. Innovation. Beyond Limits.',
      description: SITE_DESCRIPTION,
      knowsAbout: services.map(s => s.full),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export const servicesLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AENDROX software development services',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.full,
      description: `${s.description} ${s.detail}`,
      provider: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/services`,
    },
  })),
};

export function breadcrumbLd(slug: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}/${slug}` },
    ],
  };
}
