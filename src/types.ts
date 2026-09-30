export type UserRole = 'stringer' | 'hod' | 'hr';

export type ClaimStatus =
  | 'Draf'
  | 'Menunggu Kelulusan HOD'
  | 'Disahkan HOD'
  | 'Sedia Untuk Kewangan'
  | 'Ditolak / Pembetulan';

export interface TripLog {
  id: string;
  no: number;
  date: string; // e.g. "03 Mac 2025" or "2025-03-03"
  editorialAssignment: string; // e.g. "Sidang Media Khas PMX di Jabatan Perdana Menteri"
  route: string; // e.g. "Presint 1 Putrajaya <-> Presint 8"
  distanceKm: number; // e.g. 22
  mileageAllowance: number; // KM * 0.35, e.g. 7.70
  tollRm: number; // e.g. 0.00
  parkingRm: number; // e.g. 5.00
  totalRm: number;
  receiptStatus: 'Disahkan' | 'Baru' | 'Tiada Resit' | 'Padanan AI';
  receiptImage?: string;
  receiptData?: {
    merchant: string;
    date: string;
    serialNo: string;
    amount: number;
    confidence: number;
  };
}

export interface ClaimSubmission {
  id: string; // e.g. "STR-BH-2024-048"
  stringerId: string;
  stringerName: string;
  nric: string;
  biro: string;
  month: string; // e.g. "Mac 2025"
  monthKey: string; // e.g. "2025-03"
  status: ClaimStatus;
  submissionDate?: string;
  deadlineDate: string;
  trips: TripLog[];
  totalKm: number;
  totalMileageRm: number;
  totalTollRm: number;
  totalParkingRm: number;
  grandTotalRm: number;
  stringerSignature?: string; // Data URL or SVG string
  stringerSignedAt?: string;
  stringerDeclarationAccepted?: boolean;
  auditHash?: string;
  ipAddress?: string;
  // HOD Sign-off
  hodApproverName?: string;
  hodApproverId?: string;
  hodSignature?: string;
  hodSignedAt?: string;
  hodSeal?: string;
  hodRemarks?: string;
  // HR
  hrReviewerName?: string;
  hrReviewerId?: string;
  hrReviewedAt?: string;
  voucherNo?: string;
  bankAccount?: string;
}

export interface ReceiptScanResult {
  merchant: string;
  date: string;
  time: string;
  serialNo: string;
  amount: number;
  confidence: number;
  type: 'toll' | 'parking';
  imageUrl: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  allowedRoles?: UserRole[];
  isSuperAdmin?: boolean;
  biro: string;
  nric?: string;
  phone?: string;
  bankAccount?: string;
  vehicleNo?: string;
  createdAt?: string;
}

export interface SystemLink {
  id: string;
  title: string;
  url: string;
  category: 'Pekeliling' | 'HR' | 'Resit & TNG' | 'Editorial' | 'Kewangan & Bank' | 'Lain-lain';
  description?: string;
  createdBy?: string;
  createdAt?: string;
}

