import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signOut,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  userStats: any;
  updateProfileName: (name: string) => Promise<void>;
  resetUserStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          await syncUserProfile(user);
        } else {
          setUserStats(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const syncUserProfile = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const initialData = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        xp: 0,
        level: 1,
        totalGames: 0,
        totalMoves: 0,
        bestTime: 0,
        updatedAt: serverTimestamp()
      };
      await setDoc(userDocRef, initialData);
      setUserStats(initialData);
    } else {
      setUserStats(userDoc.data());
    }
  };

  const updateProfileName = async (name: string) => {
    if (!user) return;
    try {
      await firebaseUpdateProfile(user, { displayName: name });
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { displayName: name, updatedAt: serverTimestamp() }, { merge: true });
      setUserStats((prev: any) => ({ ...prev, displayName: name }));
    } catch (error) {
      console.error("Update profile name error:", error);
      throw error;
    }
  };

  const resetUserStats = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const resetData = {
        xp: 0,
        level: 1,
        totalGames: 0,
        totalMoves: 0,
        bestTime: 0,
        updatedAt: serverTimestamp()
      };
      await setDoc(userDocRef, resetData, { merge: true });
      setUserStats((prev: any) => ({ ...prev, ...resetData }));
    } catch (error) {
      console.error("Reset user stats error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      // Note: This requires Facebook App setup in Firebase Console
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Facebook Sign-In Error", error);
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithFacebook, logout, userStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
