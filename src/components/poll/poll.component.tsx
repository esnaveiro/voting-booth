import { ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
import { LeafPoll, Result } from 'react-leaf-polls'
import 'react-leaf-polls/dist/index.css';
import { db } from '../..';
import { DATABASE } from '../../constants/firebase.const';
import { Spin } from 'antd';

interface IPoll {
	question: string;
	options: IOption[];
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
	const [question, setQuestion] = useState('');
	const [options, setOptions] = useState<IOption[]>([]);

	useEffect(() => {
		const pollRef = ref(db, DATABASE.COLLECTION);
		// Triggers on database updates
		onValue(pollRef, (snapshot) => {
			const queriedData = snapshot.val()[0] as IPoll;
			// Sets question
			setQuestion(queriedData.question);
			// Sets question options
			setOptions(queriedData.options);
			setIsLoading(false);
		});
	}, []);

	return (
		<div className='poll-component'>
			{
				isLoading ? (
					<div className="spinner-container">
						<Spin size="large" />
					</div>
				) : (
					<LeafPoll
						type='multiple'
						question={question}
						results={options}
						theme={customTheme}
						onVote={vote}
						isVoted={false}
					/>
				)
			}
		</div>
	)
}
