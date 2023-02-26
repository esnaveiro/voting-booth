import { NotificationInstance } from "antd/es/notification/interface";
import { getAuth, signOut, User } from "firebase/auth";
import { update, ref, get, query } from "firebase/database";
import { NavigateFunction } from "react-router-dom";
import { db } from "..";
import { DATABASE } from "../constants/firebase.const";
import { PATHS } from "../constants/paths.const";
import { IUser } from "../interfaces/lobby-interface";
import { userService } from "../services/user.service";
import { renderNotification } from "./antd.helpers";

/**
 * Updates user info into the db
 * @param api
 * @param user
 */
export function getAndUpdateUserInfo(
    api: NotificationInstance,
    user: User | undefined,
    isLoggedIn: boolean,
) {
    if (user?.uid) {
        return get(query(ref((db), `${DATABASE.USERS}/user-${user.uid}`)))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return snapshot.val() as IUser;
                } else {
                    throw new Error('Failed to fetch snapshot');
                }
            })
            .then(async (dbUser) => await updateUserInfo(api, dbUser, user.uid, isLoggedIn))
            .catch((e) => renderNotification(api, 'error', 'Error fetching user data: ', e.message));
    }
}

/**
 * Updates a single user DB data
 * @param api
 * @param user
 * @param uid
 * @param isLoggedIn
 */
export function updateUserInfo(
    api: NotificationInstance,
    user: IUser,
    uid: string,
    isLoggedIn: boolean,
) {
    return update(ref(db, `${DATABASE.USERS}/user-${uid}`), { ...user, isLoggedIn })
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
) {
    const auth = getAuth();
    return signOut(auth).then(async () => {
        if (userService.getUserId()) {
            await getAndUpdateUserInfo(api, userService.getUser(), false);
        }

        renderNotification(api, 'success', 'Sign-out successful')
        // Navigate to login page
        navigate(PATHS.LOGIN);
        userService.clearUser();
    }).catch((error) => {
        renderNotification(api, 'error', 'Error on sign-out: ', error.message);
    });
}