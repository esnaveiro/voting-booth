export interface IUser {
	id: string;
	name: string;
	email: string;
	isAdmin: boolean;
	isLoggedIn: boolean;
	isOnVotingList: boolean;
	photoURL: string;
	key: string;
}
