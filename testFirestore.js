const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, addDoc, collection } = require('firebase/firestore');
const dotenv = require('dotenv');

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testFirestore() {
  const email = `testuser${Date.now()}@example.com`;
  const password = 'password123';
  
  try {
    console.log('Creating user...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created:', user);

    const userDoc = {
      uid: user.uid,
      email: user.email,
      createdAt: new Date()
    };

    console.log('Adding user document to Firestore...');
    await addDoc(collection(db, 'users'), userDoc);
    console.log('User document added to Firestore:', userDoc);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Email already in use, signing in instead...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in:', user);

      const userDoc = {
        uid: user.uid,
        email: user.email,
        createdAt: new Date()
      };

      console.log('Adding user document to Firestore...');
      await addDoc(collection(db, 'users'), userDoc);
      console.log('User document added to Firestore:', userDoc);
    } else {
      console.error('Error during Firestore test:', error);
    }
  }
}

testFirestore();
