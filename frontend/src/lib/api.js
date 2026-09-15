export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Returns a complete URL for displaying an image.
 * If the image path is already a full URL (e.g. from Cloudinary), it is returned directly.
 * If it is a relative path (e.g. /uploads/...), it prepends BASE_URL.
 */
export function getImageUrl(path) {
  if (!path) return '';
  if (typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const cleanBase = BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export async function getSettings() {
  try {
    const res = await fetch(`${BASE_URL}/api/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (error) {
    console.error(error);
    // Fallback if backend is down
    return {
      company_name: 'ABHIRISHI INFRA PRIVATE LIMITED',
      phone: '+91 88782 29637',
      email: 'info@abhirishiinfra.com',
      address: 'House No 1783, Baliya Kheda, Omaxe City 1, Indore, Madhya Pradesh',
      about_title: 'About Us',
      about_lead: 'We are industry leaders in providing robust infrastructure support through our state-of-the-art crushing plants.',
      about_text_1: 'At ABHIRISHI INFRA PRIVATE LIMITED, we believe in laying the strongest foundations. We specialize in the operation and management of advanced 200/300 TPH crushing plants, delivering high-quality aggregates for mega infrastructure projects across the nation.',
      about_text_2: 'Our operations are deeply rooted in ethical practices, ensuring transparency, environmental consciousness, and unwavering reliability for our partners.',
      about_image: ''
    };
  }
}

export async function getTeamMembers() {
  try {
    const res = await fetch(`${BASE_URL}/api/team`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch team');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEquipments() {
  try {
    const res = await fetch(`${BASE_URL}/api/equipments`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch equipments');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCaseStudies() {
  try {
    const res = await fetch(`${BASE_URL}/api/projects/case-studies`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch case studies');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPartners() {
  try {
    const res = await fetch(`${BASE_URL}/api/projects/partners`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch partners');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRentals() {
  try {
    const res = await fetch(`${BASE_URL}/api/rentals`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch rentals');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

