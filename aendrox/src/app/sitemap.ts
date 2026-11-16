import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap {const base=process.env.SITE_URL||'http://localhost:3000';return ['','about','services','projects','skills','experience','contact','privacy-policy','terms-and-conditions'].map(path=>({url:`${base}/${path}`}))}
