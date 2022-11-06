import { onValue, ref } from 'firebase/database';
import { db } from "../index";
import { DATABASE } from "../constants/firebase.const";


export class FirebaseService {
    /**
     * Queries 
     */
    public static getPoll() {
        try {
            const pollRef = ref(db, DATABASE.COLLECTION);
            console.log('lol: ', pollRef);
            onValue(pollRef, (snapshot) => {
                snapshot.val()
            });
        } catch (e) {
            console.error('Failed to fetch options', e);
        }
    }
}
