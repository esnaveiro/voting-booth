import { ref, limitToLast, query, onChildAdded, onValue, update, getDatabase } from 'firebase/database';
import { useState, useEffect } from 'react';
import { LeafPoll, Result } from 'react-leaf-polls'
import 'react-leaf-polls/dist/index.css';
import { db } from '../..';
import { DATABASE } from '../../constants/firebase.const';
import { Spin, Switch } from 'antd';

interface IPools {
	[key: string]: IPoll
}

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

export const PollComponent = () => {

	const [isLoading, setIsLoading] = useState(true);
	const [hasPoll, setHasPoll] = useState(false);
	const [question, setQuestion] = useState('');
	const [options, setOptions] = useState<IOption[]>([]);
	const [showPoll, setShowPoll] = useState(false);
	const [isVoted, setIsVoted] = useState(false);
	const [pollKey, setPollKey] = useState('');

	useEffect(() => {
		const pollsRef = ref(db, DATABASE.COLLECTION);
		const lastPollRef = query(pollsRef, limitToLast(1)).ref;

		// When there's any kind of update on the existing database polls
		onValue(lastPollRef, (snapshot) => {
			const queriedData = snapshot.val() as IPools;
			if (queriedData) {
				// Gets last key from queried data object
				const lastKey = Object.keys(queriedData).slice(-1)[0];
				const { question, options, show } = queriedData[lastKey];

				// Sets question
				setQuestion(question);
				// Sets question options
				setOptions(options);
				// Sets show poll (defined from DB)
				setShowPoll(show);
				// Found a poll, so we can show it
				setHasPoll(true);
				// Set poll key
				setPollKey(lastKey);
			}
			setIsLoading(false);
		});

		// When there's any kind of insertion into the database
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
			// Set poll key ??
			// setPollKey(queriedData);
			setIsLoading(false);
		});
	}, []);

	const onSwitch = (show: boolean) => {
		const db = getDatabase();
		const updates = {
			[DATABASE.COLLECTION + '/' + pollKey + '/show']: show,
		}
		update(ref(db), updates).then(() => {
			setPollKey(pollKey);
			setShowPoll(show);
		}).catch((error: any) => {
			console.error('Error switching: ', error);
		});
	}

	const onVote = (item: Result, results: Result[]): void => {
		// TODO - this is not working as intended
		setIsVoted(true);
		console.log('here: ', isVoted, item, results);
	}

	const renderLoadingSpinner = () => {
		return (
			<div className="spinner-container">
				<Spin size="large" />
			</div>
		);
	}

	const renderPoll = () => {
		return (
			<LeafPoll
				type='multiple'
				question={question || ''}
				results={options || []}
				theme={customTheme}
				onVote={onVote}
				isVoted={isVoted}
			/>
		);
	}

	const renderPollMessage = (txt: string) => <p style={{ display: 'flex', justifyContent: 'center' }}>{txt}</p>;

	const renderMainContent = () => {
		if (isLoading) {
			return renderLoadingSpinner();
		} else if (!isLoading && !hasPoll) {
			return renderPollMessage('No poll submitted');
		} else if (!isLoading && hasPoll && showPoll) {
			return renderPoll();
		} else if (!isLoading && hasPoll && !showPoll) {
			return renderPollMessage('Please wait for the poll to be shown')
		}
	}
	return (
		<div className='poll-component'>
			<Switch
				style={{ marginTop: '20px' }}
				title="Show Results"
				checked={showPoll}
				// onChange={setSwitchShowResults}
				checkedChildren="Showing Results"
				unCheckedChildren="Hiding Results"
				onClick={(show) => onSwitch(show)}
			/>
			{renderMainContent()}
		</div>
	)
}
