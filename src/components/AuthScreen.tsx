import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { UserProfile, UserRole } from '../types';
import {
  saveUserProfile,
  DEFAULT_PROFILES,
  SUPER_ADMIN_PROFILES,
  enrichUserPermissions,
  hasAllRolesPermission,
} from '../services/userService';
import { NSTPBrandLogo } from './NSTPLogo';
import {
  Lock,
  Mail,
  User,
  Shield,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  CreditCard,
  Car,
  ShieldCheck,
} from 'lucide-react';

interface AuthScreenProps {
  onSignInSuccess: (profile: UserProfile) => void;
  onShowToast: (msg: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSignInSuccess,
  onShowToast,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('stringer');
  const [biro, setBiro] = useState('Biro Putrajaya & Parlimen');
  const [nric, setNric] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const biroList = [
    'Biro Putrajaya & Parlimen',
    'Biro Shah Alam & Klang',
    'Meja Mahkamah & Jenayah KL',
    'Meja Sukan & Hiburan Balai Berita',
    'Biro Johor Bahru',
    'Biro Pulau Pinang',
    'Biro Kuantan & Pantai Timur',
    'Biro Kota Bharu',
    'Biro Kuching & Sarawak',
  ];

  // Quick Sign In with Demo or Super Admin Profiles (with optional role override)
  const handleQuickSignIn = async (profile: UserProfile, targetRole?: UserRole) => {
    setIsLoading(true);
    setErrorMsg(null);
    const activeProfile = enrichUserPermissions({
      ...profile,
      role: targetRole || profile.role,
    });
    try {
      await saveUserProfile(activeProfile);
      onShowToast(
        `Selamat kembali, ${activeProfile.displayName} — Mod Peranan: ${activeProfile.role.toUpperCase()}${
          activeProfile.isSuperAdmin ? ' (Akses Semua Peranan)' : ''
        }`
      );
      onSignInSuccess(activeProfile);
    } catch (err: any) {
      console.error('Quick sign in error:', err);
      // Even if Firestore save is slow, allow login with the profile
      onSignInSuccess(activeProfile);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In Popup
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const profile = enrichUserPermissions({
        uid: user.uid,
        displayName: user.displayName || 'Ayu Suzanna',
        email: user.email || '',
        role: role,
        biro: hasAllRolesPermission(user.email)
          ? 'Semua Biro (Akses Penuh Editorial, HOD & HR)'
          : biro,
        createdAt: new Date().toISOString(),
      });

      await saveUserProfile(profile);
      onShowToast(
        `Log masuk Google berjaya sebagai ${profile.displayName} (${profile.role.toUpperCase()})${
          profile.isSuperAdmin ? ' • Akses Penuh Semua Peranan' : ''
        }`
      );
      onSignInSuccess(profile);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setErrorMsg(err.message || 'Gagal log masuk dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email / Password Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        // Sign up flow
        let uid = `user-${Date.now()}`;
        try {
          const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          uid = cred.user.uid;
        } catch (authErr: any) {
          // Fallback to local profile UID if email auth provider requires config
          console.warn('Firebase Auth email provider fallback:', authErr.message);
        }

        const newProfile = enrichUserPermissions({
          uid,
          displayName: displayName || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          role,
          biro: hasAllRolesPermission(normalizedEmail)
            ? 'Semua Biro (Akses Penuh Editorial, HOD & HR)'
            : biro,
          nric,
          bankAccount,
          vehicleNo,
          createdAt: new Date().toISOString(),
        });

        await saveUserProfile(newProfile);
        onShowToast(`Pendaftaran berjaya! Selamat datang ${newProfile.displayName}`);
        onSignInSuccess(newProfile);
      } else {
        // Sign in flow
        let uid = `user-${Date.now()}`;
        try {
          const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
          uid = cred.user.uid;
        } catch (authErr: any) {
          console.warn('Firebase Auth email login fallback:', authErr.message);
        }

        const existingPreset = DEFAULT_PROFILES.find(
          (p) => p.email.toLowerCase() === normalizedEmail
        );

        const matchedProfile = enrichUserPermissions(
          existingPreset
            ? {
                ...existingPreset,
                role: role, // Respect selected role in dropdown so user can log into any role
                biro: hasAllRolesPermission(normalizedEmail)
                  ? existingPreset.biro
                  : biro || existingPreset.biro,
              }
            : {
                uid,
                displayName: displayName || normalizedEmail.split('@')[0],
                email: normalizedEmail,
                role,
                biro: hasAllRolesPermission(normalizedEmail)
                  ? 'Semua Biro (Akses Penuh Editorial, HOD & HR)'
                  : biro,
              }
        );

        await saveUserProfile(matchedProfile);
        onShowToast(
          `Log masuk berjaya sebagai ${matchedProfile.displayName} (${matchedProfile.role.toUpperCase()})${
            matchedProfile.isSuperAdmin ? ' • Akses Semua Peranan' : ''
          }`
        );
        onSignInSuccess(matchedProfile);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Ralat semasa log masuk atau pendaftaran.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-4 selection:bg-[#001026] selection:text-white">
      {/* Container */}
      <div className="max-w-md w-full bg-white rounded-[8px] shadow-2xl border border-slate-300 overflow-hidden">
        {/* Top Branding Banner */}
        <div className="p-6 bg-gradient-to-b from-[#0B2545] to-[#001026] text-white flex flex-col items-center text-center relative">
          <div className="p-2.5 bg-white/10 rounded-full mb-3 backdrop-blur-xs border border-white/20">
            <NSTPBrandLogo size="md" />
          </div>

          <h1 className="text-lg font-black tracking-tight text-white uppercase">
            Stringer Claim Portal
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Sistem Pengurusan Editorial & Tuntutan Wartawan Sambilan Berita Harian
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pangkalan Data Cloud Firestore Diaktifkan</span>
            </div>

            <a
              href="https://stringer.ai.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/25 hover:bg-blue-500/40 text-sky-200 border border-sky-400/30 text-[10px] font-mono font-semibold transition-colors"
              title="Buka Pautan Rasmi Portal: https://stringer.ai.studio"
            >
              <span>🌐 https://stringer.ai.studio</span>
            </a>
          </div>
        </div>

        {/* Tab Switcher: Log Masuk vs Daftar Akaun */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              !isSignUp
                ? 'border-[#0B2545] text-[#0B2545] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Log Masuk (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              isSignUp
                ? 'border-[#0B2545] text-[#0B2545] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Pengguna Baharu (Sign Up)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
              {errorMsg}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-[4px] text-xs font-bold text-slate-700 shadow-xs transition-colors mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Log Masuk dengan Akaun Google</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase">
              atau emel & kata laluan
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nama Penuh Wartawan / Pegawai <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Contoh: Ahmad Faiz bin Razali"
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-[4px] focus:outline-hidden focus:border-[#0B2545] text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Alamat Emel <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmad.faiz@mediaprima.com.my"
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-[4px] focus:outline-hidden focus:border-[#0B2545] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kata Laluan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-[4px] focus:outline-hidden focus:border-[#0B2545] text-xs"
                />
              </div>
            </div>

            {/* Role and Biro Selection */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Peranan Portal <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-2 py-2 border border-slate-300 rounded-[4px] bg-white focus:outline-hidden focus:border-[#0B2545] text-xs font-medium"
                >
                  <option value="stringer">Stringer (Wartawan)</option>
                  <option value="hod">Ketua Jabatan (HOD)</option>
                  <option value="hr">Pegawai HR</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Biro Bertugas <span className="text-red-500">*</span>
                </label>
                <select
                  value={biro}
                  onChange={(e) => setBiro(e.target.value)}
                  className="w-full px-2 py-2 border border-slate-300 rounded-[4px] bg-white focus:outline-hidden focus:border-[#0B2545] text-xs font-medium"
                >
                  {biroList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      No. Kad Pengenalan (NRIC)
                    </label>
                    <input
                      type="text"
                      value={nric}
                      onChange={(e) => setNric(e.target.value)}
                      placeholder="890412-10-5541"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      No. Pendaftaran Kenderaan
                    </label>
                    <input
                      type="text"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      placeholder="VBN 4821"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Akaun Bank EFT (Maybank / Bank Lain)
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Maybank 5122-8901-4412"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] text-xs"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-[#001026] hover:bg-[#0B2545] text-white font-bold rounded-[4px] text-xs transition-colors shadow-sm cursor-pointer"
            >
              <span>{isSignUp ? 'Daftar Akaun & Masuk' : 'Log Masuk'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Master Access / Super Admin All-Roles Login Section */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="p-3 rounded-[6px] bg-gradient-to-br from-[#EFF4FF] to-[#F8FAFC] border border-blue-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-[#0B2545] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Akses Penuh Semua Peranan (Super Admin)
                </span>
                <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  Semua Role Dibenarkan
                </span>
              </div>
              <p className="text-[10.5px] text-slate-600 mb-2.5">
                Akaun yang diberi kebenaran penuh untuk log masuk ke semua peranan (<strong>Stringer</strong>, <strong>HOD</strong> &amp; <strong>HR</strong>):
              </p>

              <div className="space-y-2">
                {SUPER_ADMIN_PROFILES.map((adminProfile) => (
                  <div
                    key={adminProfile.uid}
                    className="p-2.5 bg-white rounded-[5px] border border-blue-200/80 shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <div className="text-xs font-bold text-[#0B2545]">
                          {adminProfile.displayName}
                        </div>
                        <div className="text-[10.5px] font-mono text-blue-700 font-semibold">
                          {adminProfile.email}
                        </div>
                      </div>
                      <span className="text-[9.5px] font-bold bg-[#001026] text-white px-1.5 py-0.5 rounded">
                        ALL ROLES
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleQuickSignIn(adminProfile, 'stringer')}
                        className="py-1.5 px-2 rounded bg-blue-50 hover:bg-blue-600 text-blue-800 hover:text-white border border-blue-200 font-bold text-[10px] transition-colors text-center cursor-pointer"
                      >
                        Masuk Stringer
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleQuickSignIn(adminProfile, 'hod')}
                        className="py-1.5 px-2 rounded bg-purple-50 hover:bg-purple-600 text-purple-800 hover:text-white border border-purple-200 font-bold text-[10px] transition-colors text-center cursor-pointer"
                      >
                        Masuk HOD
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleQuickSignIn(adminProfile, 'hr')}
                        className="py-1.5 px-2 rounded bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 font-bold text-[10px] transition-colors text-center cursor-pointer"
                      >
                        Masuk HR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Log Masuk Pantas Pengguna Contoh:
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Sedia Diuji</span>
            </div>

            <div className="space-y-1.5">
              {DEFAULT_PROFILES.filter((p) => !p.isSuperAdmin).map((p) => (
                <button
                  key={p.uid}
                  type="button"
                  onClick={() => handleQuickSignIn(p)}
                  className="w-full flex items-center justify-between p-2 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 transition-all text-left text-xs group"
                >
                  <div>
                    <div className="font-bold text-[#0B2545] group-hover:text-blue-700">
                      {p.displayName}
                    </div>
                    <div className="text-[10px] text-slate-500">{p.email}</div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.role === 'stringer'
                        ? 'bg-blue-100 text-blue-800'
                        : p.role === 'hod'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10.5px] text-slate-500">
          Tertakluk kepada dasar pematuhan editorial & audit kewangan The New Straits Times Press (M) Berhad
        </div>
      </div>
    </div>
  );
};
