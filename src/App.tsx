/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, ClaimSubmission, UserProfile, SystemLink } from './types';
import { INITIAL_CLAIMS } from './data/mockData';
import {
  subscribeToClaims,
  saveClaim,
  seedInitialClaimsIfEmpty,
} from './services/claimsService';
import {
  subscribeToLinks,
  seedInitialLinksIfEmpty,
} from './services/linksService';
import {
  getUserProfile,
  saveUserProfile,
  enrichUserPermissions,
  hasAllRolesPermission,
  SUPER_ADMIN_PROFILES,
} from './services/userService';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { StringerDashboard } from './components/StringerDashboard';
import { HODApprovalView } from './components/HODApprovalView';
import { HRVerificationView } from './components/HRVerificationView';
import { AnalyticsReportingView } from './components/AnalyticsReportingView';
import { PrintMemoModal } from './components/PrintMemoModal';
import { PrintLedgerModal } from './components/PrintLedgerModal';
import { RateGuideModal } from './components/RateGuideModal';
import { NewClaimModal } from './components/NewClaimModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { SystemLinksModal } from './components/SystemLinksModal';
import { AuthScreen } from './components/AuthScreen';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'bh_stringer_claims_v5';
const USER_STORAGE_KEY = 'bh_active_user_v5';

export default function App() {
  // Current user state (null on first visit or when signed out)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return enrichUserPermissions(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load user from storage', e);
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser?.role || 'stringer';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return currentUser?.role || 'stringer';
  });

  const [isFirebaseSynced, setIsFirebaseSynced] = useState(false);

  // System Links state (synced with Firebase Firestore)
  const [links, setLinks] = useState<SystemLink[]>([]);
  const [showLinksModal, setShowLinksModal] = useState(false);

  // Load claims from localStorage or use initial mock data
  const [claims, setClaims] = useState<ClaimSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load claims from storage', e);
    }
    return INITIAL_CLAIMS;
  });

  // Modals state
  const [printMemoClaim, setPrintMemoClaim] = useState<ClaimSubmission | null>(null);
  const [showPrintLedger, setShowPrintLedger] = useState(false);
  const [showRateGuide, setShowRateGuide] = useState(false);
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReadmeModal, setShowReadmeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const PUBLIC_PORTAL_URL = 'https://stringer.ai.studio';

  const handleCopyPortalLink = () => {
    navigator.clipboard.writeText(PUBLIC_PORTAL_URL);
    showToast(`Pautan rasmi ${PUBLIC_PORTAL_URL} telah disalin untuk dikongsi kepada semua!`);
  };

  // Firebase Auth State Listener & Super Admin Profile Seeding
  useEffect(() => {
    // Ensure both authorized super-admin profiles exist in Firestore
    SUPER_ADMIN_PROFILES.forEach((adminProf) => {
      saveUserProfile(adminProf).catch((err) =>
        console.warn('Super admin seed check:', err)
      );
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const existingProfile = await getUserProfile(firebaseUser.uid);
          const savedLocal = localStorage.getItem(USER_STORAGE_KEY);
          const parsedLocal: UserProfile | null = savedLocal
            ? JSON.parse(savedLocal)
            : null;

          // Preserve role chosen during login if local session matches
          const preferredRole: UserRole =
            parsedLocal?.role || existingProfile?.role || 'hod';

          const profile = enrichUserPermissions(
            existingProfile
              ? {
                  ...existingProfile,
                  email: firebaseUser.email || existingProfile.email,
                  role: preferredRole,
                }
              : {
                  uid: firebaseUser.uid,
                  displayName:
                    firebaseUser.displayName ||
                    (hasAllRolesPermission(firebaseUser.email)
                      ? 'Ayu Suzanna'
                      : 'Pengguna Berita Harian'),
                  email: firebaseUser.email || '',
                  role: preferredRole,
                  biro: hasAllRolesPermission(firebaseUser.email)
                    ? 'Semua Biro (Akses Penuh Editorial, HOD & HR)'
                    : 'Biro Putrajaya & Parlimen',
                }
          );

          setCurrentUser(profile);
          setCurrentRole(profile.role);
          setActiveTab(profile.role);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
        } catch (err) {
          console.warn('User profile sync:', err);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Real-time Firestore Claims Sync
  useEffect(() => {
    seedInitialClaimsIfEmpty()
      .then((seeded) => {
        if (seeded && seeded.length > 0) {
          setClaims(seeded);
          setIsFirebaseSynced(true);
        }
      })
      .catch((err) => {
        console.warn('Seeding check:', err);
      });

    const unsubscribe = subscribeToClaims(
      (liveClaims) => {
        if (liveClaims && liveClaims.length > 0) {
          setClaims(liveClaims);
          setIsFirebaseSynced(true);
        }
      },
      (err) => {
        console.warn('Firestore subscription status:', err.message);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Real-time Firestore Links Sync
  useEffect(() => {
    seedInitialLinksIfEmpty()
      .then((seededLinks) => {
        if (seededLinks && seededLinks.length > 0) {
          setLinks(seededLinks);
        }
      })
      .catch((err) => {
        console.warn('Links seed error:', err);
      });

    const unsubLinks = subscribeToLinks(
      (liveLinks) => {
        if (liveLinks && liveLinks.length > 0) {
          setLinks(liveLinks);
        }
      },
      (err) => {
        console.warn('Links subscription status:', err.message);
      }
    );

    return () => {
      unsubLinks();
    };
  }, []);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed to persist claims', e);
    }
  }, [claims]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const handleSignInSuccess = (profile: UserProfile) => {
    const enriched = enrichUserPermissions(profile);
    setCurrentUser(enriched);
    setCurrentRole(enriched.role);
    setActiveTab(enriched.role);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(enriched));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error', e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Anda telah berjaya log keluar dari sistem.');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'stringer') setActiveTab('stringer');
    else if (role === 'hod') setActiveTab('hod');
    else if (role === 'hr') setActiveTab('hr');

    if (currentUser) {
      const updatedUser = enrichUserPermissions({
        ...currentUser,
        role,
      });
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      } catch (e) {
        console.error(e);
      }
      saveUserProfile(updatedUser).catch((err) =>
        console.warn('Role switch save warning:', err)
      );
    }
  };

  // Stringer claim update
  const handleUpdateClaim = (updatedClaim: ClaimSubmission) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === updatedClaim.id ? updatedClaim : c))
    );
    saveClaim(updatedClaim).catch((err) => console.warn('Save claim error:', err));
  };

  // HOD approve claim
  const handleApproveHOD = (claimId: string, remarks?: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updated: ClaimSubmission = {
            ...c,
            status: 'Disahkan HOD',
            hodApproverName: currentUser?.displayName || 'Puan Zaiton Ishak',
            hodApproverId: currentUser?.uid || 'EMP-MP-8831',
            hodSignedAt: new Date().toLocaleString('ms-MY', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            hodSeal: 'ZAITON_ISHAK_EDITORIAL_SEAL_VERIFIED',
            hodRemarks: remarks,
          };
          saveClaim(updated).catch((err) => console.warn('Approve HOD error:', err));
          return updated;
        }
        return c;
      })
    );
  };

  // HOD reject claim
  const handleRejectHOD = (claimId: string, reason: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updated: ClaimSubmission = {
            ...c,
            status: 'Ditolak / Pembetulan',
            hodRemarks: reason,
          };
          saveClaim(updated).catch((err) => console.warn('Reject HOD error:', err));
          return updated;
        }
        return c;
      })
    );
  };

  // HOD batch approve
  const handleBatchApproveHOD = () => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.status === 'Menunggu Kelulusan HOD') {
          const updated: ClaimSubmission = {
            ...c,
            status: 'Disahkan HOD',
            hodApproverName: currentUser?.displayName || 'Puan Zaiton Ishak',
            hodApproverId: currentUser?.uid || 'EMP-MP-8831',
            hodSignedAt: new Date().toLocaleString('ms-MY', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            hodSeal: 'ZAITON_ISHAK_EDITORIAL_SEAL_VERIFIED',
          };
          saveClaim(updated).catch((err) => console.warn('Batch approve HOD error:', err));
          return updated;
        }
        return c;
      })
    );
  };

  // HR batch approve and send to finance
  const handleBatchApproveHR = () => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.status === 'Disahkan HOD' || c.status === 'Menunggu Kelulusan HOD') {
          const updated: ClaimSubmission = {
            ...c,
            status: 'Sedia Untuk Kewangan',
            hrReviewerName: currentUser?.displayName || 'Zulkifli Hassan',
            hrReviewerId: currentUser?.uid || 'HR-NSTP-8821',
            hrReviewedAt: new Date().toLocaleString('ms-MY', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            voucherNo: 'VCHR-2025-MPB-03912',
          };
          saveClaim(updated).catch((err) => console.warn('Batch approve HR error:', err));
          return updated;
        }
        return c;
      })
    );
  };

  // Create new claim folder
  const handleCreateNewClaim = (month: string, biro: string) => {
    const newId = `STR-BH-2025-${Math.floor(100 + Math.random() * 900)}`;
    const newClaim: ClaimSubmission = {
      id: newId,
      stringerId: currentUser?.uid || newId,
      stringerName: currentUser?.displayName || 'Ahmad Faiz bin Razali',
      nric: currentUser?.nric || '890412-10-5541',
      biro: biro || currentUser?.biro || 'Biro Putrajaya & Parlimen',
      month,
      monthKey: '2025-04',
      status: 'Draf',
      deadlineDate: '30 April 2025 (11:59 PM)',
      trips: [],
      totalKm: 0,
      totalMileageRm: 0,
      totalTollRm: 0,
      totalParkingRm: 0,
      grandTotalRm: 0,
    };

    setClaims([newClaim, ...claims]);
    saveClaim(newClaim).catch((err) => console.warn('Create claim error:', err));
    setCurrentRole('stringer');
    setActiveTab('stringer');
    showToast(`Folder tuntutan baharu ${newId} (${month}) berjaya dibuka.`);
  };

  // Top Public URL & GitHub README Banner (visible on all screens)
  const PublicAccessBanner = () => (
    <div className="bg-[#001026] text-white px-4 py-2 border-b border-slate-800 text-xs">
      <div className="max-w-[1520px] mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Akses Umum Semua Role
          </span>
          <span className="text-slate-300 text-[11px]">
            Pautan Rasmi Portal &amp; GitHub README:
          </span>
          <a
            href={PUBLIC_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-bold text-sky-300 hover:text-white underline text-xs"
          >
            {PUBLIC_PORTAL_URL}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyPortalLink}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Salin Link
          </button>
          <button
            type="button"
            onClick={() => setShowReadmeModal(true)}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
          >
            📄 Lihat README GitHub
          </button>
          <a
            href={PUBLIC_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
          >
            Buka Portal ↗
          </a>
        </div>
      </div>
    </div>
  );

  // GitHub README Modal
  const ReadmeGitHubModal = () => {
    const readmeSnippet = `# Stringer Claim Portal (Berita Harian / NSTP Media Prima)

[![Portal Rasmi - stringer.ai.studio](https://img.shields.io/badge/🌐_Buka_Portal_Rasmi-https%3A%2F%2Fstringer.ai.studio-0B2545?style=for-the-badge)](https://stringer.ai.studio)
[![Status Sistem](https://img.shields.io/badge/Status-Aktif_(Cloud_Firestore)-10B981?style=for-the-badge)](https://stringer.ai.studio)

## 🌐 Pautan Akses Umum (Untuk Semua Orang Buka)
👉 **URL Rasmi Portal:** **[https://stringer.ai.studio](https://stringer.ai.studio)**

Klik pautan di atas untuk membuka **Stringer Claim Portal — Berita Harian (NSTP Media Prima)** secara terus dari pelayar web bagi semua peranan:
- **Stringer (Wartawan Sambilan)**
- **Ketua Jabatan (HOD)**
- **Pegawai Sumber Manusia (HR & Kewangan)**

### 🔐 Akses Penuh Semua Peranan (Super Admin)
- \`ayusuzanna7k@gmail.com\` (Semua Role: Stringer, HOD, HR & Analitik)
- \`ayusuzanna@mediaprima.com.my\` (Semua Role: Stringer, HOD, HR & Analitik)`;

    return (
      <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center overflow-y-auto">
        <div className="bg-white rounded-[8px] max-w-2xl w-full p-6 shadow-2xl border border-slate-300 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-[#0B2545]">
                📄 Fail README.md GitHub (Dikemaskini)
              </h2>
              <p className="text-xs text-slate-500">
                Pautan rasmi https://stringer.ai.studio telah dimasukkan ke dalam fail /README.md untuk semua pengguna buka.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReadmeModal(false)}
              className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
            >
              ✕ Tutup
            </button>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#EFF4FF] border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-[#0B2545] uppercase">
                Pautan Rasmi Untuk Semua Orang Buka:
              </div>
              <a
                href={PUBLIC_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono font-extrabold text-blue-700 hover:underline"
              >
                {PUBLIC_PORTAL_URL}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPortalLink}
                className="px-3 py-1.5 bg-[#001026] hover:bg-[#0B2545] text-white rounded text-xs font-bold cursor-pointer"
              >
                Salin URL
              </button>
              <a
                href={PUBLIC_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
              >
                Buka Sekarang ↗
              </a>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">
                Kandungan Markdown (/README.md):
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(readmeSnippet);
                  showToast('Kod Markdown README.md berjaya disalin!');
                }}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Salin Markdown README
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-[6px] text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64">
              {readmeSnippet}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  // If user is not signed in (first visit or after signing out), show the Auth Screen
  if (!currentUser) {
    return (
      <>
        <PublicAccessBanner />
        {showReadmeModal && <ReadmeGitHubModal />}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#001026] text-white px-4 py-3 rounded-[6px] shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-slide-up">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AuthScreen
          onSignInSuccess={handleSignInSuccess}
          onShowToast={showToast}
        />
      </>
    );
  }

  // Active stringer claim (prefer matching logged-in user or first active claim)
  const currentStringerClaim =
    claims.find(
      (c) =>
        (currentUser && c.stringerName.toLowerCase() === currentUser.displayName.toLowerCase()) ||
        (currentUser && c.stringerId === currentUser.uid)
    ) ||
    claims.find((c) => c.stringerName === 'Ahmad Faiz bin Razali') ||
    claims[0];

  const pendingHODCount = claims.filter(
    (c) => c.status === 'Menunggu Kelulusan HOD'
  ).length;

  const pendingHRCount = claims.filter(
    (c) => c.status === 'Disahkan HOD'
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#001026] selection:text-white">
      {/* Top Always-Visible Public Link & GitHub README Bar */}
      <PublicAccessBanner />
      {showReadmeModal && <ReadmeGitHubModal />}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#001026] text-white px-4 py-3 rounded-[6px] shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenNewClaim={() => setShowNewClaim(true)}
        onOpenRateGuide={() => setShowRateGuide(true)}
        isFirebaseSynced={isFirebaseSynced}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenLinks={() => setShowLinksModal(true)}
        linksCount={links.length}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-[1520px] w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingHODCount={pendingHODCount}
          pendingHRCount={pendingHRCount}
          onOpenRateGuide={() => setShowRateGuide(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenLinks={() => setShowLinksModal(true)}
          linksCount={links.length}
          currentBiro={currentUser?.biro || 'Biro Putrajaya & Parlimen'}
          onSubmitMonthlyClaim={() => {
            handleUpdateClaim({
              ...currentStringerClaim,
              status: 'Menunggu Kelulusan HOD',
            });
            showToast('Tuntutan bulanan berjaya dihantar kepada Ketua Jabatan.');
          }}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'stringer' && (
            <StringerDashboard
              claim={currentStringerClaim}
              onUpdateClaim={handleUpdateClaim}
              onOpenPrintMemo={(c) => setPrintMemoClaim(c)}
              onShowSuccessToast={showToast}
            />
          )}

          {activeTab === 'hod' && (
            <HODApprovalView
              claims={claims}
              onApproveClaim={handleApproveHOD}
              onRejectClaim={handleRejectHOD}
              onBatchApprove={handleBatchApproveHOD}
              onOpenPrintMemo={(c) => setPrintMemoClaim(c)}
              onShowSuccessToast={showToast}
            />
          )}

          {activeTab === 'hr' && (
            <HRVerificationView
              claims={claims}
              onOpenPrintMemo={(c) => setPrintMemoClaim(c)}
              onOpenPrintLedger={() => setShowPrintLedger(true)}
              onApproveBatchHR={handleBatchApproveHR}
              onShowSuccessToast={showToast}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsReportingView
              claims={claims}
              onOpenPrintMemo={(c) => setPrintMemoClaim(c)}
              onShowSuccessToast={showToast}
            />
          )}
        </main>
      </div>

      {/* System Links Modal (All links saved in Firebase Firestore) */}
      {showLinksModal && (
        <SystemLinksModal
          links={links}
          onClose={() => setShowLinksModal(false)}
          onShowToast={showToast}
          canManage={true}
        />
      )}

      {/* Printable Modals */}
      {printMemoClaim && (
        <PrintMemoModal
          claim={printMemoClaim}
          onClose={() => setPrintMemoClaim(null)}
        />
      )}

      {showPrintLedger && (
        <PrintLedgerModal
          onClose={() => setShowPrintLedger(false)}
        />
      )}

      {/* Rate Guide Modal (RM0.35/KM SOP) */}
      {showRateGuide && (
        <RateGuideModal onClose={() => setShowRateGuide(false)} />
      )}

      {/* New Claim Modal */}
      {showNewClaim && (
        <NewClaimModal
          onClose={() => setShowNewClaim(false)}
          onCreateClaim={handleCreateNewClaim}
        />
      )}

      {/* Account Settings Modal */}
      {showSettings && (
        <AccountSettingsModal
          onClose={() => setShowSettings(false)}
          onShowSuccessToast={showToast}
        />
      )}
    </div>
  );
}
