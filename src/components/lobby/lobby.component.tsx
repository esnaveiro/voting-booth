import { List, Avatar, Space, Transfer, Table } from 'antd';
import React, { } from 'react';
import { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import { TransferItem, TransferProps } from 'antd/es/transfer';
import difference from 'lodash/difference';

interface RecordType {
	key: string;
	title: string;
	description: string;
	disabled: boolean;
	tag: string;
}

interface DataType {
	key: string;
	title: string;
	description: string;
	disabled: boolean;
	tag: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
	dataSource: DataType[];
	leftColumns: ColumnsType<DataType>;
	rightColumns: ColumnsType<DataType>;
}

export const LobbyComponent: React.FC = () => {

	const renderWaitingList = () => {
		return (
			<List
				/**
				 * From authenticated users list
				 */
				dataSource={[
					{
						id: 1,
						name: 'Miguel Barbosa',
						email: "wpa@esnaveiro.org"
					},
					{
						id: 2,
						name: 'Joana Andrade',
						email: "hr@esnaveiro.org"
					},
				]}
				bordered
				renderItem={(item) => (
					<List.Item key={item.id}>
						<List.Item.Meta
							avatar={
								<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
							}
							title={<a href="https://ant.design/index-cn">{item.name}</a>}
							description={item.email}
						/>
					</List.Item>
				)}
			/>
		);
	}

	const renderVotingList = () => {
		return (
			<List
				/**
				 * From authenticated users list
				 */
				dataSource={[
					{
						id: 1,
						name: 'Carolina Rodrigues',
						email: "president@esnaveiro.org"
					},
					{
						id: 2,
						name: 'Francisco Lameira',
						email: "grandes-fotos-no-sal@esnaveiro.org"
					},
				]}
				bordered
				renderItem={(item) => (
					<List.Item key={item.id}>
						<List.Item.Meta
							avatar={
								<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
							}
							title={<a href="https://ant.design/index-cn">{item.name}</a>}
							description={item.email}
						/>
					</List.Item>
				)}
			/>
		);
	}

	// const TableTransfer = ({
	// 	leftColumns,
	// 	rightColumns,
	// 	...restProps
	// }: TableTransferProps) => (
	// 	<Transfer>
	// 		{({
	// 			direction,
	// 			filteredItems,
	// 			onItemSelectAll,
	// 			onItemSelect,
	// 			selectedKeys: listSelectedKeys,
	// 			disabled: listDisabled
	// 		}) => {
	// 			const columns = direction === "left" ? leftColumns : rightColumns;

	// 			const rowSelection: TableRowSelection<TransferItem> = {
	// 				getCheckboxProps: (item) => ({
	// 					disabled: listDisabled || item.disabled
	// 				}),
	// 				onSelectAll(selected, selectedRows) {
	// 					const treeSelectedKeys = selectedRows
	// 						.filter((item) => !item.disabled)
	// 						.map(({ key }) => key);
	// 					const diffKeys = selected
	// 						? difference(treeSelectedKeys, listSelectedKeys)
	// 						: difference(listSelectedKeys, treeSelectedKeys);
	// 					onItemSelectAll(diffKeys as string[], selected);
	// 				},
	// 				onSelect({ key }, selected) {
	// 					onItemSelect(key as string, selected);
	// 				},
	// 				selectedRowKeys: listSelectedKeys
	// 			};

	// 			return (
	// 				<Table
	// 					rowSelection={rowSelection}
	// 					columns={columns}
	// 					dataSource={filteredItems}
	// 					size="small"
	// 					style={{ pointerEvents: listDisabled ? "none" : undefined }}
	// 					onRow={({ key, disabled: itemDisabled }) => ({
	// 						onClick: () => {
	// 							if (itemDisabled || listDisabled) return;
	// 							onItemSelect(
	// 								key as string,
	// 								!listSelectedKeys.includes(key as string)
	// 							);
	// 						}
	// 					})}
	// 				/>
	// 			);
	// 		}}
	// 	</Transfer>
	// );

	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<Transfer>
				{() => renderWaitingList()}
			</Transfer>
		</Space>
	)
};
