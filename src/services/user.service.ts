export class UserService {

    private userId: string | undefined;

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
}

export const userService = new UserService();