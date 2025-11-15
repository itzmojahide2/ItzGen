

import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { AdminManagedUser, Payment, Plan, AdminUser, SiteSettings, PlanName, PaymentStatus, AdminRole, Gateway } from '../types';

// --- MOCK DATA ---
const initialUsers: AdminManagedUser[] = [];

const initialPayments: Payment[] = [];

const initialPlans: Plan[] = [
    { id: 'plan-1', name: PlanName.Free, price: 0, limits: { image: 5, thumbnail: 2, switch: 3 }, description: 'Default trial plan' },
    { id: 'plan-2', name: PlanName.Go, price: 49, limits: { image: 15, thumbnail: 5, switch: 8 }, description: 'Beginner creator tier' },
    { id: 'plan-3', name: PlanName.Plus, price: 99, limits: { image: 35, thumbnail: 10, switch: 15 }, description: 'Regular content maker' },
    { id: 'plan-4', name: PlanName.Pro, price: 199, limits: { image: 70, thumbnail: 20, switch: 30 }, description: 'For professionals' },
    { id: 'plan-5', name: PlanName.Ultimate, price: 349, limits: { image: 'unlimited', thumbnail: 'unlimited', switch: 'unlimited' }, description: 'Agency or business users' },
];

const initialGateways: Gateway[] = [
    { id: 'gw-1', name: 'bKash', number: '01234567890' },
    { id: 'gw-2', name: 'Nagad', number: '01234567891' },
    { id: 'gw-3', name: 'Rocket', number: '01234567892' },
];

const initialAdmins: AdminUser[] = [
    { id: 'admin-1', name: 'ItzGen Admin', email: 'id@itzgen.bd', role: AdminRole.MainAdmin, password: 'itzgen567##**' },
];

const initialSettings: SiteSettings = {
    name: 'ItzGen',
    logo: '',
    contactEmail: 'support@itzgen.bd',
    planGlow: {
        enabled: false,
        planId: '',
        color: '#A259FF',
        opacity: 75,
    }
}

// --- CONTEXT ---

interface AdminContextType {
  isLoggedIn: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  users: AdminManagedUser[];
  findUserByEmail: (email: string) => AdminManagedUser | undefined;
  addUser: (user: Omit<AdminManagedUser, 'id' | 'joinDate' | 'isBanned' | 'plan'>) => AdminManagedUser | null;
  updateUser: (userId: string, updates: Partial<AdminManagedUser>) => void;
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'date' | 'status'>) => void;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (plan: Plan) => void;
  deletePlan: (planId: string) => void;
  movePlan: (planId: string, direction: 'up' | 'down') => void;
  gateways: Gateway[];
  addGateway: (gateway: Omit<Gateway, 'id'>) => void;
  updateGateway: (gateway: Gateway) => void;
  deleteGateway: (gatewayId: string) => void;
  admins: AdminUser[];
  addAdmin: (admin: Omit<AdminUser, 'id'>) => void;
  updateAdmin: (admin: AdminUser) => void;
  deleteAdmin: (adminId: string) => void;
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [users, setUsers] = useState<AdminManagedUser[]>(initialUsers);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [gateways, setGateways] = useState<Gateway[]>(initialGateways);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  const login = useCallback((email: string, pass: string) => {
    // In a real app, this would be a secure API call.
    // Here, we just check against the mock main admin.
    if (email === initialAdmins[0].email /* && check pass */) {
        setIsAdminLoggedIn(true);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAdminLoggedIn(false);
  }, []);
  
  const updateUser = useCallback((userId: string, updates: Partial<AdminManagedUser>) => {
    setUsers(currentUsers => currentUsers.map(u => u.id === userId ? { ...u, ...updates } : u));
  }, []);

  const addUser = useCallback((userData: Omit<AdminManagedUser, 'id' | 'joinDate' | 'isBanned' | 'plan'>) => {
    if (users.some(u => u.email === userData.email)) {
        return null; // User already exists
    }
    const newUser: AdminManagedUser = {
        ...userData,
        id: `user-${crypto.randomUUID().slice(0,8)}`,
        joinDate: new Date(),
        isBanned: false,
        plan: PlanName.Free,
    };
    setUsers(currentUsers => [...currentUsers, newUser]);
    return newUser;
  }, [users]);

  const findUserByEmail = useCallback((email: string) => {
    return users.find(u => u.email === email);
  }, [users]);


  const addPayment = useCallback((payment: Omit<Payment, 'id' | 'date' | 'status'>) => {
    const newPayment: Payment = {
        ...payment,
        id: `pay-${crypto.randomUUID().slice(0,8)}`,
        date: new Date(),
        status: PaymentStatus.Pending,
    };
    setPayments(currentPayments => [newPayment, ...currentPayments]);
  }, []);

  const updatePayment = useCallback((paymentId: string, updates: Partial<Payment>) => {
    setPayments(currentPayments => {
        const newPayments = currentPayments.map(p => p.id === paymentId ? { ...p, ...updates } : p);
        
        const updatedPayment = newPayments.find(p => p.id === paymentId);
        if (updatedPayment && updates.status === PaymentStatus.Approved) {
            setUsers(currentUsers => currentUsers.map(u => 
                u.email === updatedPayment.userEmail ? { ...u, plan: updatedPayment.planName } : u
            ));
        }
        
        return newPayments;
    });
  }, []);

  const addPlan = useCallback((planData: Omit<Plan, 'id'>) => {
      const newPlan = { ...planData, id: `plan-${crypto.randomUUID()}` };
      setPlans(current => [...current, newPlan]);
  }, []);

  const updatePlan = useCallback((updatedPlan: Plan) => {
      setPlans(current => current.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  }, []);

  const deletePlan = useCallback((planId: string) => {
      setPlans(current => current.filter(p => p.id !== planId));
  }, []);

  const movePlan = useCallback((planId: string, direction: 'up' | 'down') => {
    setPlans(currentPlans => {
        const index = currentPlans.findIndex(p => p.id === planId);
        if (index === -1) return currentPlans;

        if (direction === 'up' && index > 0) {
            const newPlans = [...currentPlans];
            [newPlans[index - 1], newPlans[index]] = [newPlans[index], newPlans[index - 1]];
            return newPlans;
        }

        if (direction === 'down' && index < currentPlans.length - 1) {
            const newPlans = [...currentPlans];
            [newPlans[index + 1], newPlans[index]] = [newPlans[index], newPlans[index + 1]];
            return newPlans;
        }

        return currentPlans;
    });
  }, []);

  const addGateway = useCallback((gatewayData: Omit<Gateway, 'id'>) => {
      const newGateway = { ...gatewayData, id: `gw-${crypto.randomUUID()}` };
      setGateways(current => [...current, newGateway]);
  }, []);

  const updateGateway = useCallback((updatedGateway: Gateway) => {
      setGateways(current => current.map(g => g.id === updatedGateway.id ? updatedGateway : g));
  }, []);

  const deleteGateway = useCallback((gatewayId: string) => {
      setGateways(current => current.filter(g => g.id !== gatewayId));
  }, []);

  const addAdmin = useCallback((adminData: Omit<AdminUser, 'id'>) => {
      const newAdmin = { ...adminData, id: `admin-${crypto.randomUUID()}` };
      setAdmins(current => [...current, newAdmin]);
  }, []);

  const updateAdmin = useCallback((updatedAdmin: AdminUser) => {
      setAdmins(current => current.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
  }, []);

  const deleteAdmin = useCallback((adminId: string) => {
      setAdmins(current => current.filter(a => a.id !== adminId));
  }, []);

  const updateSettings = useCallback((newSettings: SiteSettings) => {
      setSettings(newSettings);
  }, []);

  const value = {
      isLoggedIn: isAdminLoggedIn,
      login,
      logout,
      users,
      findUserByEmail,
      addUser,
      updateUser,
      payments,
      addPayment,
      updatePayment,
      plans,
      addPlan,
      updatePlan,
      deletePlan,
      movePlan,
      gateways,
      addGateway,
      updateGateway,
      deleteGateway,
      admins,
      addAdmin,
      updateAdmin,
      deleteAdmin,
      settings,
      updateSettings
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
