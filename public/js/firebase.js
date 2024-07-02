// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz0iJka4FDfAZBCOdfe3nNZsJT_BOVN5Y",
  authDomain: "transformers-app.firebaseapp.com",
  projectId: "transformers-app",
  storageBucket: "transformers-app.appspot.com",
  messagingSenderId: "719832838826",
  appId: "1:719832838826:web:7aee577492bbb29fcf56d3",
  measurementId: "G-SP4BHYNQ7S",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const googleLogin = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const token = await result.user.getIdToken();
    // Send the token to the server
    const response = await fetch('/auth/login/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    const data = await response.json();
    if (data.success) {
      // If successful, redirect to main screen
      window.location.href = '/';
    } else {
      console.error('Google login failed:', data.message);
    }
  } catch (error) {
    console.error('Google login error:', error);
  }
};

const facebookLogin = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const token = await result.user.getIdToken();
    // Send the token to the server
    const response = await fetch('/auth/login/facebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    const data = await response.json();
    if (data.success) {
       // If successful, redirect to main screen
       window.location.href = '/';
    } else {
      console.error('Facebook login failed:', data.message);
    }
  } catch (error) {
    console.error('Facebook login error:', error);
  }
};

// Make functions accessible globally
window.googleLogin = googleLogin;
window.facebookLogin = facebookLogin;
