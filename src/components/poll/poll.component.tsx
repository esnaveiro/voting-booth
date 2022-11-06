import { LeafPoll, Result } from 'react-leaf-polls'
import 'react-leaf-polls/dist/index.css';
import { db } from '../../index';
import { useEffect, useState } from 'react';
import { DATABASE } from '../../constants/firebase.const';
import { ref, onValue } from 'firebase/database';

// Persistent data array (typically fetched from the server)
const resData = [
	{ id: 0, text: 'At least 2', votes: 0 },
	{ id: 1, text: 'Over 9000', votes: 0 },
	{ id: 2, text: 'Yes', votes: 0 }
]

// Object keys may vary on the poll type (see the 'Theme options' table below)
const customTheme = {
	textColor: 'black',
	mainColor: '#00B87B',
	backgroundColor: 'rgb(255,255,255)',
	alignment: 'center'
}

const vote = (item: Result, results: Result[]): void => {
	// Here you probably want to manage
	// and return the modified data to the server.
}

interface IPoll {
	questions: string;
	options: IOption[];
}

interface IOption {
	id: number;
	votes: number;
	text: string;
}

export const PollComponent = () => {
	const [poll, setPoll] = useState({ question: '', options: []});
	
	useEffect(() => {
		const pollRef = ref(db, DATABASE.COLLECTION);
            console.log('lol: ', pollRef);
            onValue(pollRef, (snapshot) => {
                console.log('snap: ', snapshot.val());
				setPoll(snapshot.val());
            });
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, { question: '', options: []} as any);

	return (
		<LeafPoll
			type='multiple'
			question='How many girls did Miguel Barbosa vacuum cleaned?'
			results={resData}
			theme={customTheme}
			onVote={vote}
			isVoted={false}
		/>
	)
}
