
import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }

    // Listen to user's favorites in real-time
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setFavorites(userData.favorites || []);
      } else {
        setFavorites([]);
      }
    }, (error) => {
      console.error('Error listening to favorites:', error);
      setFavorites([]);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addFavorite = async (matchId: string) => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        favorites: arrayUnion(matchId),
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (matchId: string) => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        favorites: arrayRemove(matchId),
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const toggleFavorite = async (matchId: string) => {
    if (!currentUser) {
      // Show popup for non-authenticated users
      if (window.confirm('Please log in to save favorites. Would you like to go to the login page?')) {
        window.location.href = '/login';
      }
      return;
    }
    
    if (favorites.includes(matchId)) {
      await removeFavorite(matchId);
    } else {
      await addFavorite(matchId);
    }
  };

  const addToWatchHistory = (matchId: string) => {
    if (!currentUser) return;
    
    const watchHistory = JSON.parse(localStorage.getItem(`watchHistory_${currentUser.uid}`) || '[]');
    if (!watchHistory.includes(matchId)) {
      watchHistory.unshift(matchId);
      watchHistory.splice(50); // Keep only last 50 matches
      localStorage.setItem(`watchHistory_${currentUser.uid}`, JSON.stringify(watchHistory));
      
      // Update watch time (estimate 15 minutes per match)
      const currentWatchTime = parseInt(localStorage.getItem(`watchTime_${currentUser.uid}`) || '0');
      const newWatchTime = currentWatchTime + 15;
      localStorage.setItem(`watchTime_${currentUser.uid}`, newWatchTime.toString());
    }
  };

  const getWatchHistory = (): string[] => {
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(`watchHistory_${currentUser.uid}`) || '[]');
  };

  const isFavorite = (matchId: string) => favorites.includes(matchId);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    addToWatchHistory,
    getWatchHistory,
  };
}
