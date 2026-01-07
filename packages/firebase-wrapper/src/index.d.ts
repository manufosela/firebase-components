import { LitElement, TemplateResult } from 'lit';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Database } from 'firebase/database';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

/**
 * Firebase configuration object
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  databaseURL?: string;
  measurementId?: string;
}

/**
 * Emulator service configuration
 */
export interface EmulatorServiceConfig {
  host: string;
  port: number;
}

/**
 * Emulator configuration object
 */
export interface EmulatorConfig {
  auth?: EmulatorServiceConfig;
  firestore?: EmulatorServiceConfig;
  database?: EmulatorServiceConfig;
  storage?: EmulatorServiceConfig;
  functions?: EmulatorServiceConfig;
}

/**
 * Firebase ready event detail
 */
export interface FirebaseReadyEventDetail {
  app: FirebaseApp;
  auth: Auth | null;
  database: Database | null;
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
}

/**
 * Firebase error event detail
 */
export interface FirebaseErrorEventDetail {
  message: string;
}

/**
 * Firebase Wrapper Web Component
 *
 * @element firebase-wrapper
 *
 * @fires firebase-ready - Fired when Firebase is initialized successfully
 * @fires firebase-error - Fired when Firebase initialization fails
 *
 * @slot - Default slot for child components that will use Firebase services
 */
export declare class FirebaseWrapper extends LitElement {
  /**
   * Firebase configuration object
   */
  config: FirebaseConfig | null;

  /**
   * Enable emulator connections
   */
  emulators: boolean;

  /**
   * Custom emulator configuration
   */
  emulatorConfig: EmulatorConfig | null;

  /**
   * Show status indicator
   */
  showStatus: boolean;

  /**
   * Get the Firebase App instance
   */
  get app(): FirebaseApp | null;

  /**
   * Get the Firebase Auth instance
   */
  get auth(): Auth | null;

  /**
   * Get the Firebase Realtime Database instance
   */
  get database(): Database | null;

  /**
   * Get the Firebase Firestore instance
   */
  get firestore(): Firestore | null;

  /**
   * Get the Firebase Storage instance
   */
  get storage(): FirebaseStorage | null;

  /**
   * Check if Firebase is ready
   */
  get isReady(): boolean;

  render(): TemplateResult;
}

declare global {
  interface HTMLElementTagNameMap {
    'firebase-wrapper': FirebaseWrapper;
  }

  interface HTMLElementEventMap {
    'firebase-ready': CustomEvent<FirebaseReadyEventDetail>;
    'firebase-error': CustomEvent<FirebaseErrorEventDetail>;
  }
}
