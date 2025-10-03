
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEq0oDnFmiqriXz4KrzFGUSMjGo9M5GtM",
  authDomain: "vipstreamed-feaf1.firebaseapp.com",
  projectId: "vipstreamed-feaf1",
  storageBucket: "vipstreamed-feaf1.firebasestorage.app",
  messagingSenderId: "637728944100",
  appId: "1:637728944100:web:b14c5ac6cbffdac275e1f1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
