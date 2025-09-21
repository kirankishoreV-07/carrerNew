import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  User,
  UserCredential
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'

// Types
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  createdAt: any
  lastLoginAt: any
  profile?: {
    phoneNumber?: string
    dateOfBirth?: string
    location?: string
    education?: string
    interests?: string[]
    careerGoals?: string[]
  }
}

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user profile in Firestore
    await createUserProfile(userCredential.user, { displayName })
    
    return userCredential
  } catch (error: any) {
    console.error('Error signing up:', error)
    throw new Error(error.message)
  }
}

// Sign in with email and password
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Update last login time
    await updateUserProfile(userCredential.user.uid, {
      lastLoginAt: serverTimestamp()
    })
    
    return userCredential
  } catch (error: any) {
    console.error('Error signing in:', error)
    throw new Error(error.message)
  }
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider)
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    if (!userDoc.exists()) {
      await createUserProfile(userCredential.user)
    } else {
      // Update last login time
      await updateUserProfile(userCredential.user.uid, {
        lastLoginAt: serverTimestamp()
      })
    }
    
    return userCredential
  } catch (error: any) {
    console.error('Error signing in with Google:', error)
    throw new Error(error.message)
  }
}

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error('Error signing out:', error)
    throw new Error(error.message)
  }
}

// Create user profile in Firestore
export const createUserProfile = async (
  user: User, 
  additionalData?: { displayName?: string }
): Promise<void> => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: additionalData?.displayName || user.displayName || '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    }
    
    await setDoc(doc(db, 'users', user.uid), userProfile)
  } catch (error: any) {
    console.error('Error creating user profile:', error)
    throw new Error(error.message)
  }
}

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    return userDoc.exists() ? userDoc.data() as UserProfile : null
  } catch (error: any) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (
  uid: string, 
  updateData: Partial<UserProfile>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), updateData)
  } catch (error: any) {
    console.error('Error updating user profile:', error)
    throw new Error(error.message)
  }
}

// Get error message for display
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No user found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    default:
      return 'An error occurred. Please try again.'
  }
}
