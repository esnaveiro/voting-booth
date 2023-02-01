export interface IPools {
	[key: string]: IPoll
}

export interface IPoll {
	question: string;
	options: IOption[];
	showPoll: boolean;
	showResults: boolean;
}

export interface IOption {
	id: number;
	votes: Record<string, string>;
	text: string;
}

export interface IPollOption extends Omit<IOption, 'votes'> {
	votes: number;
}