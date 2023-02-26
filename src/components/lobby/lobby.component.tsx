import { Space, Transfer } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import { child, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../..';
import { DATABASE } from '../../constants/firebase.const';
import { getListOfOnlineUsers, getListOfUsersOnVotingList, toggleUsersOnVotingList } from '../../helpers/lobby.helper';
import { IUser, IUserWKey } from '../../interfaces/lobby-interface';

export const LobbyComponent: React.FC = () => {

	const [onlineUsers, setOnlineUsers] = useState<IUserWKey[]>([]);
	const [votingUsers, setVotingUsers] = useState<string[]>([]);

	useEffect(() => {
		// Subscribes to updates on users data
		const unsubscribeOnValue = onValue(child(ref(db), DATABASE.USERS), (snapshot) => {
			if (snapshot.exists()) {
				const onlineUsers = getListOfOnlineUsers(snapshot.val() as Record<string, IUser>);
				setOnlineUsers(onlineUsers)
				const votingList = getListOfUsersOnVotingList(onlineUsers);
				setVotingUsers(votingList);
			}
		})

		return () => unsubscribeOnValue();
	}, [])

	/**
	 * Renders a single list item with user's details
	 * @param item
	 */
	const renderListItem = (item: IUserWKey) => {
		const transferItem = (
			<div className="transfer-item" key={item.key}>
				{/** These photos don't load locally, but will load in production */}
				<img src={item.photoURL} alt="Avatar" />
				<div className="details">
					<h4 className="title">{item.name}</h4>
					<p className="description">{item.email}</p>
				</div>
			</div>
		)

		return {
			label: transferItem,
			value: item.name,
		}
	}

	/**
	 * Handles user transfer to voting list or waiting list and updates on DB
	 * @param newTargetKeys
	 * @param direction
	 * @param moveKeys
	 */
	const handleChange = (
		newTargetKeys: string[],
		direction: TransferDirection,
		moveKeys: string[],
	) => {
		setVotingUsers(newTargetKeys);
		// Update database
		toggleUsersOnVotingList(onlineUsers, moveKeys, direction)
			.then(() => console.log('Users successfully updated'))
			.catch((e) => console.log('Failed to update users ', e.message));
	};

	return (
		<Space className="lobby" direction="vertical" style={{ width: '100%' }}>
			<Transfer
				listStyle={{ width: 300 }}
				titles={['Waiting List', 'Voting List']}
				dataSource={onlineUsers}
				targetKeys={votingUsers}
				onChange={handleChange}
				render={renderListItem}
			/>
		</Space>
	)
};
