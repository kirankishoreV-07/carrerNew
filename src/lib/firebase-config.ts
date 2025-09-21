// Production Firebase Configuration
// This file provides environment-specific configurations

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Development configuration (fallback)
const developmentConfig: FirebaseConfig = {
  apiKey: "AIzaSyB1kpgcIq-TSQdSf2f3StLo9j_kiHgFd3U",
  authDomain: "career-advisor-hackathon-48c62.firebaseapp.com",
  projectId: "career-advisor-hackathon-48c62",
  storageBucket: "career-advisor-hackathon-48c62.firebasestorage.app",
  messagingSenderId: "696086181687",
  appId: "1:696086181687:web:20a26ce5957c926b1a0cb2",
  measurementId: "G-PF050WTJQ4"
}

// Get Firebase configuration based on environment
export const getFirebaseConfig = (): FirebaseConfig => {
  // Try to use environment variables first
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
  }
  
  // Fallback to development config for local development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 Firebase: Using development configuration')
    return developmentConfig
  }
  
  // Throw error in production if env vars are missing
  throw new Error('Firebase configuration missing. Please set environment variables for production.')
}

// Configuration validation
export const validateFirebaseConfig = (config: FirebaseConfig): boolean => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
  ]
  
  return requiredFields.every(field => {
    const value = config[field]
    if (!value) {
      console.error(`Firebase configuration missing: ${field}`)
      return false
    }
    return true
  })
}
