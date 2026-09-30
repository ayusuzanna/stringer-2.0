import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, UserRole } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

const USERS_COLLECTION = 'users';

export const ALL_ROLES: UserRole[] = ['stringer', 'hod', 'hr'];

export const ALL_ROLES_AUTHORIZED_EMAILS = [
  'ayusuzanna7k@gmail.com',
  'ayusuzanna@mediaprima.com.my',
];

export function hasAllRolesPermission(email?: string | null): boolean {
  if (!email) return false;
  return ALL_ROLES_AUTHORIZED_EMAILS.includes(email.trim().toLowerCase());
}

export function enrichUserPermissions(profile: UserProfile): UserProfile {
  if (hasAllRolesPermission(profile.email) || profile.isSuperAdmin) {
    return {
      ...profile,
      allowedRoles: ALL_ROLES,
      isSuperAdmin: true,
    };
  }
  return {
    ...profile,
    allowedRoles: profile.allowedRoles || [profile.role],
  };
}

export const SUPER_ADMIN_PROFILES: UserProfile[] = [
  {
    uid: 'user-master-ayusuzanna-mp',
    displayName: 'Ayu Suzanna (Media Prima)',
    email: 'ayusuzanna@mediaprima.com.my',
    role: 'hod',
    allowedRoles: ALL_ROLES,
    isSuperAdmin: true,
    biro: 'Semua Biro (Akses Penuh Editorial, HOD & HR)',
    nric: '880715-14-5210',
    phone: '+60 12-309 8821',
    bankAccount: 'Maybank 5140-1192-8834',
    vehicleNo: 'WYY 7788',
  },
  {
    uid: 'user-master-ayusuzanna-gmail',
    displayName: 'Ayu Suzanna',
    email: 'ayusuzanna7k@gmail.com',
    role: 'hod',
    allowedRoles: ALL_ROLES,
    isSuperAdmin: true,
    biro: 'Semua Biro (Akses Penuh Editorial, HOD & HR)',
    nric: '880715-14-5210',
    phone: '+60 12-309 8821',
    bankAccount: 'Maybank 5140-1192-8834',
    vehicleNo: 'WYY 7788',
  },
];

export const DEFAULT_PROFILES: UserProfile[] = [
  ...SUPER_ADMIN_PROFILES,
  {
    uid: 'user-stringer-01',
    displayName: 'Ahmad Faiz bin Razali',
    email: 'ahmad.faiz@mediaprima.com.my',
    role: 'stringer',
    allowedRoles: ALL_ROLES,
    biro: 'Biro Putrajaya & Parlimen',
    nric: '890412-10-5541',
    phone: '+60 12-384 9912',
    bankAccount: 'Maybank 5122-8901-4412',
    vehicleNo: 'VBN 4821',
  },
  {
    uid: 'user-hod-01',
    displayName: 'Puan Zaiton Ishak',
    email: 'zaiton.ishak@mediaprima.com.my',
    role: 'hod',
    allowedRoles: ALL_ROLES,
    biro: 'Semua Biro (Editor Berita Tempatan)',
    phone: '+60 19-223 8810',
  },
  {
    uid: 'user-hr-01',
    displayName: 'Encik Zulkifli Hassan',
    email: 'zulkifli.h@mediaprima.com.my',
    role: 'hr',
    allowedRoles: ALL_ROLES,
    biro: 'Bahagian Sumber Manusia (HR) NSTP',
    phone: '+60 13-991 4455',
  },
];

/**
 * Get user profile from Firestore by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${uid}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return enrichUserPermissions(snap.data() as UserProfile);
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Save or update user profile in Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const enriched = enrichUserPermissions(profile);
  const path = `${USERS_COLLECTION}/${enriched.uid}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, enriched.uid);
    await setDoc(docRef, enriched, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
