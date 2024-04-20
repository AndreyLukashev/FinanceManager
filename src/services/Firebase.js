import { initializeApp } from "firebase/app";

export class Firebase {
  constructor() {
    this._app = initializeApp({
      apiKey: import.meta.env.VITE_API_KEY,
      authDomain: "fd2-final-project.firebaseapp.com",
      projectId: "fd2-final-project",
      storageBucket: "fd2-final-project.appspot.com",
      messagingSenderId: "1029122091312",
      appId: "1:1029122091312:web:45861d467b577b835640f5"
    });
  }

  get app() {
    return this._app;
  }
}

export const firebaseService = new Firebase();