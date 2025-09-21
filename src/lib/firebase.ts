// Firebase configuration for CareerAI Advisor
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { getFirebaseConfig, validateFirebaseConfig } from './firebase-config'

// Get Firebase configuration (environment variables or fallback)
const firebaseConfig = getFirebaseConfig()

// Validate configuration
if (!validateFirebaseConfig(firebaseConfig)) {
  throw new Error('Invalid Firebase configuration. Please check your environment variables.')
}

// Log configuration status
if (process.env.NODE_ENV === 'development') {
  const isUsingEnvVars = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  console.log(`🔥 Firebase: ${isUsingEnvVars ? 'Environment variables loaded' : 'Using fallback config'}`)
}

console.log('Firebase config loaded successfully!')

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app)

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

export default app
