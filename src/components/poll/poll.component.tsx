import { ref, limitToLast, query, onChildAdded, onValue, getDatabase, get } from 'firebase/database';
import { useState, useEffect } from 'react';
import { db } from '../..';
import { DATABASE } from '../../constants/firebase.const';
import { Button, notification, Spin } from 'antd';
import { MultiplePoll, Result } from '../multiple-poll/multiple-poll.component';
import { userService } from '../../services/user.service';
import { addNewVote, convertOptionsFromDbToPoll, getLastKey, getUserVotedOption, removeOldVote } from '../../helpers/poll.helper';
import { IPollOption, IOption, IPools, IPoll } from '../../interfaces/poll-interface';
import { renderNotification } from '../../helpers/antd.helpers';

// Object keys may vary on the poll type (see the 'Theme options' table below)
const customTheme = {
	textColor: 'black',
	mainColor: '#00B87B',
	backgroundColor: 'rgb(255,255,255)',
	alignment: 'center',
}

export const PollComponent = () => {
	const [api, contextHolder] = notification.useNotification();

	const [isLoading, setIsLoading] = useState(true);
	const [hasPoll, setHasPoll] = useState(false);
	const [question, setQuestion] = useState('');
	const [options, setOptions] = useState<IPollOption[]>([]);
	const [showPoll, setShowPoll] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [isVoted, setIsVoted] = useState(false);
	const [isVotedId, setIsVotedId] = useState(0);
	const [pollKey, setPollKey] = useState('');



	useEffect(() => {
		const pollsRef = ref(db, DATABASE.POLLS);
		const lastPollRef = query(pollsRef, limitToLast(1)).ref;

		// When there's any kind of update on the existing database polls
		const unsubscribeOnValue = onValue(lastPollRef, (snapshot) => {
			const queriedData = snapshot.val() as IPools;
			if (queriedData) {
				// Gets last key from queried data object
				const lastKey = getLastKey(queriedData);
				const { question, options, showPoll, showResults } = queriedData[lastKey];

				// Sets question
				setQuestion(question);
				const cOptions = convertOptionsFromDbToPoll(options);
				// Sets question options
				setOptions(cOptions);
				// Sets show poll (defined from DB)
				setShowPoll(showPoll);
				// Sets show poll results
				setShowResults(showResults);
				// Found a poll, so we can show it
				setHasPoll(true);
				// Sets poll db key
				setPollKey(lastKey);

				const voteId = getUserVotedOption(queriedData[lastKey])?.id;
				if (voteId !== undefined && !isNaN(voteId)) {
					setIsVoted(true);
					setIsVotedId(voteId)
				}
			}
			setIsLoading(false);
		});

		// When there's any kind of insertion into the database
		const unsubscribeOnChildAdded = onChildAdded(lastPollRef, (snapshot) => {
			const queriedData = snapshot.val() as IPoll;
			// Sets question
			setQuestion(queriedData.question);
			// Sets question options
			setOptions(convertOptionsFromDbToPoll(queriedData.options));
			// Sets show poll (defined from DB)
			setShowPoll(queriedData.showPoll)
			// Sets show poll results
			setShowResults(queriedData.showResults);
			// Found a poll, so we can show it
			setHasPoll(true);
			// Resets is voted status
			setIsVoted(false);
			// Sets poll db key
			// check if this is working @TODO
			//setPollKey(pollKey);
			setIsLoading(false);
		});

		// This only runs when the component unmounts
		return () => {
			unsubscribeOnValue();
			unsubscribeOnChildAdded();
		}
	}, []);

	const onVote = async (item: Result, results: Result[]): Promise<void> => {
		setIsVotedId(item.id);
		setIsVoted(true);
		const db = getDatabase();
		// Check if user already voted for any of the possible options
		const pollsRef = ref(db, DATABASE.POLLS);
		const lastPollRef = query(pollsRef, limitToLast(1)).ref;
		let userVotedOption: IOption | undefined;

		try {
			const snapshot = await get(lastPollRef);
			if (snapshot.exists()) {
				const queriedData = snapshot.val() as IPools;
				const lastKey = getLastKey(queriedData);
				userVotedOption = getUserVotedOption(queriedData[lastKey]);
				const userId = userService.getUser();

				await removeOldVote(userVotedOption, pollKey);
				await addNewVote(pollKey, item, userId);
				
			} else {
				renderNotification(api, 'error', 'No options available');
			}
		} catch (e) {
			renderNotification(api, 'error', 'Error getting last poll reference');
		}
	}

	const renderLoadingSpinner = () => {
		return (
			<div className="spinner-container">
				<Spin size="large" />
			</div>
		);
	}

	const renderPoll = () => {
		return !isVoted || (isVoted && showResults) ? (
			<MultiplePoll
				// type='multiple'
				question={question || ''}
				results={options || []}
				theme={customTheme}
				onVote={onVote}
				isVoted={isVoted}
				isVotedId={isVotedId}
			/>
		) : (
			<div>
				{renderPollMessage('Please wait for the results to be shown')}
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={() => setIsVoted(false)}>Change your vote</Button>
				</div>
			</div>
		);
	}

	const renderPollMessage = (txt: string) => <p style={{ display: 'flex', justifyContent: 'center' }}>{txt}</p>;

	const renderMainContent = () => {
		if (isLoading) {
			return renderLoadingSpinner();
		} else if (!hasPoll) {
			return renderPollMessage('No poll submitted');
		} else if (!showPoll) {
			return renderPollMessage('Please wait for the poll to be shown')
		} else if (showPoll) {
			return renderPoll();
		}
	}

	return (
		<div className='poll-component'>
			{contextHolder}
			{renderMainContent()}
		</div>
	)
}
