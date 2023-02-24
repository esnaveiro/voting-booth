import { IUser } from "../interfaces/lobby-interface";

export function getListOfUsers(users: Record<string, IUser>): IUser[] {
    return Object.keys(users)
        .map((key) => ({ ...users[key], key }))
        .filter((user) => user.isLoggedIn);
}