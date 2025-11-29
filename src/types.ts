export interface AdminPermissions {
  manageUsers?: boolean;
  manageContent?: boolean;
  viewAnalytics?: boolean;
  systemSettings?: boolean;
}

export interface FernDetails {
  commonName: string;
  scientificName: string;
  description: string;
  habitat: string;
  careRequirements: string;
  funFacts: string[];
}

export interface ScanResult {
  id: string;
  userId: string;
  image: string;
  isPlant: boolean;
  isFern: boolean;
  species?: string;
  confidence: number;
  timestamp: string;
  details?: FernDetails;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  profilePicture?: string;
  adminPermissions?: AdminPermissions;
}
