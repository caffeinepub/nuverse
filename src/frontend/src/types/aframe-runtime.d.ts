declare global {
  interface Window {
    AFRAME?: {
      version: string;
      [key: string]: any;
    };
  }
}

export {};
