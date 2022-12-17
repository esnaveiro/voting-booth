import { onValue, ref } from 'firebase/database';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../index";
import { promises } from 'stream';

export class FirebaseService {
    /**
     * Queries 
     */
    public static getPoll() {
        try {
            const pollRef = ref(db, 'poll/0/question');
            onValue(pollRef, (snapshot) => {
                console.log('snaaaaaP. ', snapshot.val());
                snapshot.val()
            });
        } catch (e) {
            console.error('Failed to fetch options', e);
        }
    }

    public static async isUserLoggedIn(): Promise<boolean> {
        const auth = getAuth();
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    const uid = user.uid;
                    resolve(!!uid);
                } else {
                    resolve(false);
                }
            });
        })
    }
}
