import { Space, Transfer } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import React, { useState } from 'react';

interface IListItem {
	key: string;
	name: string;
	email: string;
}

export const LobbyComponent: React.FC = () => {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [listData, setListData] = useState<IListItem[]>([
		{
			name: 'Miguel Barbosa',
			email: "wpa@esnaveiro.org",
			key: '1',
		},
		{
			name: 'Joana Andrade',
			email: "hr@esnaveiro.org",
			key: '2',
		},
	]);
	const [targetKeys, setTargetKeys] = useState<string[]>([]);

	const renderListItem = (item: IListItem) => {
		const transferItem = (
			<div className="transfer-item" key={item.key}>
				<img src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" alt="Avatar" />
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
