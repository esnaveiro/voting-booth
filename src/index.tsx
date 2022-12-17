import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { firebaseConfig } from './constants/firebase.const';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import * as firebaseui from "firebaseui";
import { getAuth } from 'firebase/auth';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getDatabase(app);

// Initialize the FirebaseUI Widget using Firebase.
const auth = getAuth();
export const ui = new firebaseui.auth.AuthUI(auth);

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
