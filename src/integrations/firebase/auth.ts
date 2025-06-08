// Firebase authentication integration for Supabase
//
// IMPORTANT: The functions in this file, specifically `signInWithFirebase`, are NOT the
// primary method for standard email/password authentication in this application.
// Standard email/password authentication is handled by `AuthProvider.tsx` which
// interacts directly with Supabase.
//
// These Firebase functions might be intended for other specific purposes, such as:
//  - Handling social logins (e.g., Sign in with Google via Firebase) which then sync
//    with Supabase.
//  - Legacy code from a previous authentication setup.
//  - Specific federated identity scenarios.
//
// Please refer to `AuthProvider.tsx` for the main authentication logic.

import { firebaseAuth } from '@/integrations/firebase/client';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { supabase } from '@/integrations/supabase/client';

export async function signInWithFirebase(email: string, password: string) {
  // Sign in with Firebase
  const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await userCredential.user.getIdToken();
  // Use Firebase ID token to sign in to Supabase
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'firebase',
    token: idToken,
  });
  return { data, error };
}

export async function signOutFirebase() {
  await firebaseSignOut(firebaseAuth);
  await supabase.auth.signOut();
}
