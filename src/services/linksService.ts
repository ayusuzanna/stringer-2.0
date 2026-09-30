import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { SystemLink } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

const LINKS_COLLECTION = 'links';

export const DEFAULT_SYSTEM_LINKS: SystemLink[] = [
  {
    id: 'link-portal-utama',
    title: 'Portal Rasmi Stringer Claim Berita Harian (stringer.ai.studio)',
    url: 'https://stringer.ai.studio',
    category: 'Editorial',
    description: 'Pautan utama aplikasi rasmi untuk dibuka oleh semua pengguna (Stringer, HOD & HR).',
    createdAt: '2025-01-01',
  },
  {
    id: 'link-1',
    title: 'Surat Pekeliling Kewangan MPB Bil 02/2024 (Kadar RM0.35/KM)',
    url: 'https://www.mediaprima.com.my/governance/circulars/2024-02',
    category: 'Pekeliling',
    description: 'Panduan rasmi kadar tuntutan perbatuan bagi wartawan sambilan dan staf NSTP.',
    createdAt: '2025-01-01',
  },
  {
    id: 'link-2',
    title: 'Portal Penyata e-Kewangan Touch n Go (TNG)',
    url: 'https://tngportal.touchngo.com.my/',
    category: 'Resit & TNG',
    description: 'Muat turun e-statement transaksi tol untuk lampiran perakuan tuntutan.',
    createdAt: '2025-01-05',
  },
  {
    id: 'link-3',
    title: 'Sistem Pengurusan Editorial Berita Harian (Newsdesk CMS)',
    url: 'https://newsdesk.bh.com.my/',
    category: 'Editorial',
    description: 'Semakan nombor tugasan lapangan dan direktori tajuk berita berdaftar.',
    createdAt: '2025-01-10',
  },
  {
    id: 'link-4',
    title: 'Maybank Corporate EFT Payout & Batch Portal',
    url: 'https://www.maybank2e.net/',
    category: 'Kewangan & Bank',
    description: 'Portal pembayaran baucar kelompok bagi Bahagian Kewangan NSTP.',
    createdAt: '2025-01-12',
  },
  {
    id: 'link-5',
    title: 'Portal Pematuhan Integriti SPRM (Seksyen 18)',
    url: 'https://www.sprm.gov.my/index.php/pendidikan/akta-sprm-2009',
    category: 'Pekeliling',
    description: 'Garis panduan pencegahan tuntutan palsu dan integriti perkhidmatan awam/swasta.',
    createdAt: '2025-01-15',
  },
  {
    id: 'link-6',
    title: 'Portal Sumber Manusia NSTP (HR e-Services)',
    url: 'https://hr.mediaprima.com.my/',
    category: 'HR',
    description: 'Pengesahan status kontrak wartawan sambilan dan maklumat pentadbiran biro.',
    createdAt: '2025-01-20',
  },
];

/**
 * Subscribe to real-time system links from Firestore
 */
export function subscribeToLinks(
  onData: (links: SystemLink[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, LINKS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const links: SystemLink[] = [];
      snapshot.forEach((docSnap) => {
        links.push(docSnap.data() as SystemLink);
      });
      onData(links);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, LINKS_COLLECTION);
    }
  );
}

/**
 * Fetch all links from Firestore once
 */
export async function getLinks(): Promise<SystemLink[]> {
  try {
    const colRef = collection(db, LINKS_COLLECTION);
    const snap = await getDocs(colRef);
    const links: SystemLink[] = [];
    snap.forEach((docSnap) => {
      links.push(docSnap.data() as SystemLink);
    });
    return links;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, LINKS_COLLECTION);
  }
}

/**
 * Save or update a link in Firestore
 */
export async function saveLink(link: SystemLink): Promise<void> {
  const path = `${LINKS_COLLECTION}/${link.id}`;
  try {
    const docRef = doc(db, LINKS_COLLECTION, link.id);
    await setDoc(docRef, link, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a link from Firestore
 */
export async function removeLink(linkId: string): Promise<void> {
  const path = `${LINKS_COLLECTION}/${linkId}`;
  try {
    const docRef = doc(db, LINKS_COLLECTION, linkId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Seed default links to Firestore if the collection is empty
 */
export async function seedInitialLinksIfEmpty(): Promise<SystemLink[]> {
  try {
    const existing = await getLinks();
    if (existing && existing.length > 0) {
      const hasMainPortalLink = existing.some(
        (l) => l.url === 'https://stringer.ai.studio' || l.id === 'link-portal-utama'
      );
      if (!hasMainPortalLink) {
        const portalLink = DEFAULT_SYSTEM_LINKS[0];
        await saveLink(portalLink);
        return [portalLink, ...existing];
      }
      return existing;
    }
    for (const link of DEFAULT_SYSTEM_LINKS) {
      await saveLink(link);
    }
    return DEFAULT_SYSTEM_LINKS;
  } catch (error) {
    console.warn('Fallback links loading:', error);
    return DEFAULT_SYSTEM_LINKS;
  }
}
