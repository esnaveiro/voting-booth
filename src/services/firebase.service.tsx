import { onValue, ref } from 'firebase/database';
import { db } from "../index";

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
}
