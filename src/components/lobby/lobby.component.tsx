import { Space, Transfer } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import { child, get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../..';
import { DATABASE } from '../../constants/firebase.const';
import { getListOfUsers } from '../../helpers/lobby.helper';
import { IUser } from '../../interfaces/lobby-interface';

export const LobbyComponent: React.FC = () => {

	useEffect(() => {
		get(child(ref(db), DATABASE.USERS)).then((snapshot) => {
			if (snapshot.exists()) {
				const onlineUsers = getListOfUsers(snapshot.val() as Record<string, IUser>);
				setListData(onlineUsers)
			}
		})
	})

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [listData, setListData] = useState<IUser[]>([]);
	const [targetKeys, setTargetKeys] = useState<string[]>([]);

	const renderListItem = (item: IUser) => {
		const transferItem = (
			<div className="transfer-item" key={item.key}>
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

	const handleChange = (
		newTargetKeys: string[],
		direction: TransferDirection,
		moveKeys: string[],
	) => {
		console.log(newTargetKeys, direction, moveKeys);
		setTargetKeys(newTargetKeys);
	};

	return (
		<Space className="lobby" direction="vertical" style={{ width: '100%' }}>
			<Transfer
				listStyle={{ width: 300 }}
				titles={['Waiting List', 'Voting List']}
				dataSource={listData}
				targetKeys={targetKeys}
				onChange={handleChange}
				render={renderListItem}
			/>
		</Space>
	)
};
