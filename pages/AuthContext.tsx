import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User, PlanName } from '../types';
import { useAdmin } from '../hooks/useAdmin';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateUserPlan: (newPlan: PlanName) => void;
  updateUserName: (name: string) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { users, findUserByEmail, addUser, updateUser } = useAdmin();

  useEffect(() => {
    if (user) {
      const latestUserData = users.find(u => u.email === user.email);
      if (latestUserData) {
        // Avoid infinite loops by checking if an update is needed.
        if (JSON.stringify(latestUserData) !== JSON.stringify(user)) {
          setUser(latestUserData);
        }
      } else {
        // User might have been deleted from admin panel
        logout();
      }
    }
  }, [users, user]);

  const signup = useCallback((name: string, email: string, password: string) => {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = addUser({ name, email, password });
    if (newUser) {
      setUser(newUser);
      return { success: true, message: 'Signup successful!' };
    }
    return { success: false, message: 'An error occurred during signup.' };
  }, [findUserByEmail, addUser]);

  const login = useCallback((email: string, password: string) => {
    const foundUser = findUserByEmail(email);
    
    if (!foundUser || foundUser.password !== password) {
      return { success: false, message: 'Invalid email or password.' };
    }
    
    if (foundUser.isBanned) {
      return { success: false, message: 'This account has been banned.' };
    }
    
    setUser(foundUser);
    return { success: true, message: 'Login successful!' };
  }, [findUserByEmail]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUserPlan = useCallback((newPlan: PlanName) => {
    if (user) {
        const managedUser = findUserByEmail(user.email);
        if (managedUser) {
            updateUser(managedUser.id, { plan: newPlan });
        }
    }
  }, [user, findUserByEmail, updateUser]);

  const updateUserName = useCallback((newName: string) => {
    if (user) {
        const managedUser = findUserByEmail(user.email);
        if (managedUser) {
            updateUser(managedUser.id, { name: newName });
        }
    }
  }, [user, findUserByEmail, updateUser]);

  const changePassword = useCallback((oldPass: string, newPass: string) => {
    if (user) {
        const managedUser = findUserByEmail(user.email);
        if (managedUser) {
            if (managedUser.password !== oldPass) {
                return { success: false, message: 'Current password is incorrect.' };
            }
            updateUser(managedUser.id, { password: newPass });
            return { success: true, message: 'Password updated successfully!' };
        }
    }
    return { success: false, message: 'User not found or an error occurred.' };
  }, [user, findUserByEmail, updateUser]);

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, login, signup, logout, updateUserPlan, updateUserName, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
