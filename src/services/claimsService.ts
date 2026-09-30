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
import { ClaimSubmission } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { INITIAL_CLAIMS } from '../data/mockData';

const CLAIMS_COLLECTION = 'claims';

/**
 * Subscribe to real-time updates from Firestore claims collection
 */
export function subscribeToClaims(
  onData: (claims: ClaimSubmission[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, CLAIMS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const claims: ClaimSubmission[] = [];
      snapshot.forEach((docSnap) => {
        claims.push(docSnap.data() as ClaimSubmission);
      });
      onData(claims);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.GET, CLAIMS_COLLECTION);
    }
  );
}

/**
 * Fetch all claims once
 */
export async function getClaims(): Promise<ClaimSubmission[]> {
  try {
    const colRef = collection(db, CLAIMS_COLLECTION);
    const snap = await getDocs(colRef);
    const claims: ClaimSubmission[] = [];
    snap.forEach((docSnap) => {
      claims.push(docSnap.data() as ClaimSubmission);
    });
    return claims;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, CLAIMS_COLLECTION);
  }
}

/**
 * Create or save a claim
 */
export async function saveClaim(claim: ClaimSubmission): Promise<void> {
  const path = `${CLAIMS_COLLECTION}/${claim.id}`;
  try {
    const docRef = doc(db, CLAIMS_COLLECTION, claim.id);
    await setDoc(docRef, claim, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a claim
 */
export async function removeClaim(claimId: string): Promise<void> {
  const path = `${CLAIMS_COLLECTION}/${claimId}`;
  try {
    const docRef = doc(db, CLAIMS_COLLECTION, claimId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Seed initial claims to Firestore if the collection is empty
 */
export async function seedInitialClaimsIfEmpty(): Promise<ClaimSubmission[]> {
  try {
    const existing = await getClaims();
    if (existing.length > 0) {
      return existing;
    }

    // Seed INITIAL_CLAIMS
    for (const claim of INITIAL_CLAIMS) {
      await saveClaim(claim);
    }
    return INITIAL_CLAIMS;
  } catch (error) {
    console.warn('Initial seeding fallback to local cache:', error);
    return INITIAL_CLAIMS;
  }
}
