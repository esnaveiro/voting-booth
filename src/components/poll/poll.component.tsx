import { ref, limitToLast, query, onChildAdded } from 'firebase/database';
import { useState, useEffect } from 'react';
import { LeafPoll, Result } from 'react-leaf-polls'
import 'react-leaf-polls/dist/index.css';
import { db } from '../..';
import { DATABASE } from '../../constants/firebase.const';
import { Spin } from 'antd';

interface IPoll {
	question: string;
	options: IOption[];
	show: boolean;
}

interface IOption {
	id: number;
	votes: number;
	text: string;
}

// Object keys may vary on the poll type (see the 'Theme options' table below)
const customTheme = {
	textColor: 'black',
	mainColor: '#00B87B',
	backgroundColor: 'rgb(255,255,255)',
	alignment: 'center',
}

const vote = (item: Result, results: Result[]): void => {
	// Here you probably want to manage
	// and return the modified data to the server.
}

export const PollComponent = () => {

	const [isLoading, setIsLoading] = useState(true);
	const [hasPoll, setHasPoll] = useState(false);
	const [question, setQuestion] = useState('');
	const [options, setOptions] = useState<IOption[]>([]);
	const [showPoll, setShowPoll] = useState(false);

	useEffect(() => {
		const pollsRef = ref(db, DATABASE.COLLECTION);
		const lastPollRef = query(pollsRef, limitToLast(1)).ref;
		// Triggers on database updates
		onChildAdded(lastPollRef, (snapshot) => {
			const queriedData = snapshot.val() as IPoll;
			// Sets question
			setQuestion(queriedData.question);
			// Sets question options
			setOptions(queriedData.options);
			// Sets show poll (defined from DB)
			setShowPoll(queriedData.show)
			// Found a poll, so we can show it
			setHasPoll(true);
		});
		// No poll found
		setIsLoading(false);
	}, []);

	return (
		<div className='poll-component'>
			{
				isLoading && !hasPoll ? (
					<div className="spinner-container">
						<Spin size="large" />
					</div>
				) : !hasPoll ? (
					<p style={{ display: 'flex', justifyContent: 'center' }}>No poll submitted</p>
				) : showPoll ? (
					<LeafPoll
						type='multiple'
						question={question}
						results={options}
						theme={customTheme}
						onVote={vote}
						isVoted={false}
					/>
				) : (
					<div>
						<h2>Please wait for the poll to be submitted</h2>
					</div>
				)
			}
		</div>
	)
}
