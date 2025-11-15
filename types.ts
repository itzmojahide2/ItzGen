

export enum PlanName {
  Free = 'Free',
  Go = 'Go',
  Plus = 'Plus',
  Pro = 'Pro',
  Ultimate = 'Ultimate',
}

export interface Plan {
  id: string;
  name: PlanName;
  price: number;
  limits: {
    image: number | 'unlimited';
    thumbnail: number | 'unlimited';
    switch: number | 'unlimited';
  };
  description: string;
}

export interface User {
  name: string;
  email: string;
  plan: PlanName;
}

export interface Generation {
  id: string;
  type: 'Image' | 'Thumbnail' | 'Switch';
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

export interface Usage {
  image: number;
  thumbnail: number;
  switch: number;
}

export enum GeneratorType {
  Image = 'image',
  Thumbnail = 'thumbnail',
  Switch = 'switch',
}

export enum SwitchMode {
    Face = 'face',
    Background = 'background',
    Merge = 'merge',
    Style = 'style',
    Thumbnail = 'thumbnail',
    All = 'all',
}


// Admin Panel Specific Types
export interface AdminManagedUser extends User {
    id: string;
    joinDate: Date;
    isBanned: boolean;
    password?: string;
}

export enum PaymentStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  planName: PlanName;
  amount: number;
  method: string;
  transactionId: string;
  senderNumber: string;
  status: PaymentStatus;
  date: Date;
}

export enum AdminRole {
  MainAdmin = 'Main Admin',
  Moderator = 'Moderator',
  Support = 'Support',
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
}

export interface Gateway {
    id: string;
    name: string;
    number: string;
}

export interface SiteSettings {
    name: string;
    logo: string; // For now, a placeholder
    contactEmail: string;
    planGlow: {
        enabled: boolean;
        planId: string;
        color: string;
        opacity: number; // 0-100
    };
}