export class UserService {

    private userId: string | undefined;

    private isAdmin: boolean;

    constructor() {
        this.userId = '';
        this.isAdmin = false;
    }

    /**
     * Sets current user into localstorage
     * @param userId
     */
    public setUser(userId: string): void {
        this.userId = userId;
        localStorage.setItem('user-id', userId)
    }

    /**
     * Returns user from localstorage
     */
    public getUser(): string {
        return localStorage.getItem('user-id') || '';
    }

    /**
     * Clears user from localstorage
     */
    public clearUser(): void {
        this.userId = undefined;
        localStorage.clear();
    }

    /**
     * Returns true when the current user is admin
     */
    public isUserAdmin(): boolean {
        return this.isAdmin;
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