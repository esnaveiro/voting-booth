import { User } from "firebase/auth";

export class UserService {

    private isAdmin: boolean | undefined;

    private loggedIn = false;

    private user: User | undefined;

    /**
     * Returns User object
     */
    public getUser(): User | undefined {
        return this.user;
    }

    /**
     * Sets user object that is obtained from DB
     * @param user
     */
    public setUser(user: User) {
        this.user = user;
    }

    /**
     * Returns user from session storage
     */
    public getUserId(): string {
        return sessionStorage.getItem('user-id') || '';
    }

    /**
     * Sets current user into session storage
     * @param userId
     */
    public setUserId(userId: string): void {
        sessionStorage.setItem('user-id', userId)
    }

    /**
     * Clears user from session storage
     */
    public clearUser(): void {
        this.user = undefined;
        sessionStorage.clear();
    }

    /**
     * Returns true when the current user is admin
     */
    public isUserAdmin(): boolean {
        return !!this.isAdmin;
    }

    /**
     * Sets current user as admin or not
     * @param isAdmin
     */
    public setIsAdmin(isAdmin: boolean): void {
        this.isAdmin = isAdmin;
    }
}

export const userService = new UserService();