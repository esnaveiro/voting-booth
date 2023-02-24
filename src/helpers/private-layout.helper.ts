import { NotificationInstance } from "antd/es/notification/interface";
import { getAuth, signOut, User } from "firebase/auth";
import { Database, update, ref } from "firebase/database";
import { NavigateFunction } from "react-router-dom";
import { DATABASE } from "../constants/firebase.const";
import { PATHS } from "../constants/paths.const";
import { userService } from "../services/user.service";
import { renderNotification } from "./antd.helpers";

/**
 * Updates user info into the db
 * @param api
 * @param db
 * @param user
 */
export function updateUserInfo(
    api: NotificationInstance,
    db: Database,
    user: User | null,
    isLoggedIn = true,
) {
    const { uid, displayName, email, photoURL } = user || { uid: '', displayName: '', email: '', photoURL: '' };
    const updates = {
        [`${DATABASE.USERS}/user-${user?.uid}`]: {
            email,
            id: uid,
            name: displayName,
            isAdmin: userService.isUserAdmin(),
            photoURL,
            isOnVotingList: false,
            isLoggedIn
        }
    }

    return update(ref(db), updates)
        .then(() => {
            console.log('User submitted or updated in db');
        }).catch((e) => {
            renderNotification(api, 'error', 'Error updating user in db: ', e.message);
        });
}

/**
 * Handles on logout event
 * @param navigate
 * @param api
 */
export function onLogout(
    navigate: NavigateFunction,
    api: NotificationInstance,
    db: Database,
    userState: User | null,
) {
    const auth = getAuth();
    return signOut(auth).then(async () => {
        await updateUserInfo(api, db, userState, false);
        renderNotification(api, 'success', 'Sign-out successful')
        // Navigate to login page
        navigate(PATHS.LOGIN);
        userService.clearUser();
    }).catch((error) => {
        renderNotification(api, 'error', 'Error on sign-out');
    });
}