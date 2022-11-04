import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './constants/firebase.const';

// Initialize Firebase
initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
