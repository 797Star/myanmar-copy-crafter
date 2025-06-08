// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Add this before initializeAppCheck for local development
// @ts-ignore
self.FIREBASE_APPCHECK_DEBUG_TOKEN = "1A381BB4-E81B-4E96-92FF-52AF2F14D0F7";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: 'AIzaSyB_WpKfzO-xUrO79KaR6g7kaTSxSu5n-mc',
  authDomain: 'regal-habitat-376619.firebaseapp.com',
  projectId: 'regal-habitat-376619',
  appId: '1:836381987343:web:760c87ffdaf0773857c97a',
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LeZdFkrAAAAAFXQkhMZ1t4bu2B_GQ-15BH8iQJU'),
  isTokenAutoRefreshEnabled: true,
});
