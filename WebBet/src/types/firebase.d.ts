import { FirebaseOptions } from 'firebase/app';

declare module 'firebase/app' {
  interface FirebaseOptions {
    measurementId?: string;
  }
}
