import { ref, update } from "firebase/database";
import { db } from "..";
import { DATABASE } from "../constants/firebase.const";
import { IUser, IUserWKey } from "../interfaces/lobby-interface";

/**
 * Returns a list of logged in users
 * @param users
 */
export function getListOfOnlineUsers(users: Record<string, IUser>): IUserWKey[] {
    return Object.keys(users)
        .map((key) => ({ ...users[key], key }))
        .filter((user) => user.isLoggedIn);
}

/**
 * Given an array of users, it returns an array of voting users' keys
 * @param users
 */
export function getListOfUsersOnVotingList(users: IUserWKey[]) {
    return users.reduce((acc, user) => {
        if (user.isOnVotingList) {
            acc.push(user.key)
        }
        return acc;
    }, [] as string[]);
}

/**
 * Sets an array of users on voting list or removes them out of it
 * @param users
 * @param moveKeys
 * @param direction
 */
export async function toggleUsersOnVotingList(users: IUserWKey[], moveKeys: string[], direction: 'right' | 'left'): Promise<void> {
    const updates = users.reduce((acc, { key, ...user }) => ({
        ...acc,
        ...{
            [key]: {
                ...user,
                ...(moveKeys.find((k) => k === key) && (
                    (direction === 'right' && { isOnVotingList: true }) ||
                    (direction === 'left' && { isOnVotingList: false }))
                )
            }
        }
    }), {});

    return await update(ref(db, DATABASE.USERS), updates);
}