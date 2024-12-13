// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// 주어진 Firebase 설정 값을 아래에 넣습니다.
const firebaseConfig = {
  apiKey: "AIzaSyD6Cf11bxtmbIg7llUMjLOlFF-Qy4AusSo",
  authDomain: "yoonxjoong.firebaseapp.com",
  projectId: "yoonxjoong",
  storageBucket: "yoonxjoong.firebasestorage.app",
  messagingSenderId: "1027531958330",
  appId: "1:1027531958330:web:f8d010c6f5a230eb432d03",
  measurementId: "G-GV66Y24F53"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
getAnalytics(app);

export default app;
