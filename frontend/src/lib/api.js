const BASE_URL = 'https://mbcrushings-api.onrender.com';

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
      address: 'House No 1783, Baliya Kheda, Omaxe City 1, Indore, Madhya Pradesh'
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
