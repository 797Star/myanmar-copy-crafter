// Firebase authentication integration for Supabase
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
