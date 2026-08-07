'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { FIREBASE } from './konfigurasi';

export const app = getApps().length ? getApp() : initializeApp(FIREBASE);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const google = new GoogleAuthProvider();
