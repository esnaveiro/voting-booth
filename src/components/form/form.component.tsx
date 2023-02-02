import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification, Switch } from 'antd';
import { ref, limitToLast, query, onValue } from 'firebase/database';
import { DATABASE } from '../../constants/firebase.const';
import { db } from '../..';
import { IValues } from '../../interfaces/form-interface';
import { IPools } from '../../interfaces/poll-interface';
import { getLastKey } from '../../helpers/poll.helper';
import { insertNewPoll, updateSwitchStatus } from '../../helpers/form.helper';
import { renderNotification } from '../../helpers/antd.helpers';

export const FormComponent: React.FC = () => {
	const [form] = Form.useForm();
	const [api, contextHolder] = notification.useNotification();
	const [pollKey, setPollKey] = useState('');
	const [showPoll, setShowPoll] = useState(false);
	const [showResults, setShowResults] = useState(false);

	// Set initial form key obtained from the last submitted form
	useEffect(() => {
		const pollsRef = ref(db, DATABASE.POLLS);
		const lastPollRef = query(pollsRef, limitToLast(1)).ref;

		const unsubscribe = onValue(lastPollRef, (snapshot) => {
			const queriedData = snapshot.val() as IPools;
			if (queriedData) {
				// Gets last key from queried data object
				const lastKey = getLastKey(queriedData);
				const { showPoll, showResults } = queriedData[lastKey];
				// Set poll key
				setPollKey(lastKey);
				setShowPoll(showPoll);
				setShowResults(showResults);
			}
		})

		// Unsubcribes to onValue listener
		return () => unsubscribe();
	})

	/**
	 * Function executed when the form is submitted
	 * @param values
	 */
	const onFinish = (values: IValues) => {
		insertNewPoll(values)
			.then((newPollKey) => {
				form.resetFields();
				setPollKey(newPollKey);
				setShowPoll(false);
				setShowResults(false);
			}).catch((error) => {
				renderNotification(api, 'error', 'Error adding item: ', error.message);
			});
		renderNotification(api, 'success', 'Poll submitted');
	};

	/**
	 * Renders a notification error when form submission failed
	 */
	const onFinishFailed = () => renderNotification(api, 'error', 'Please fill in all of the fields');

	/**
	 * Generic function that toggles switch button status
	 * @param show
	 * @param option
	 */
	const onSwitch = (show: boolean, option: string) => {
		updateSwitchStatus(show, option, pollKey);
		option === 'Results' ? setShowResults(show) : setShowPoll(show);
	}

	const renderFormOptions = () => {
		return (
			<Form.List
				name="options"
				rules={[
					{
						validator: async (_, options) => {
							if (!options || options.length < 2) {
								return Promise.reject(new Error('At least 2 options'));
							}
						},
					},
				]}
				initialValue={['In Favour', 'Against', 'Abstain']}
			>
				{(fields, { add, remove }) => (
					<>
						{
							fields.map((field, index) => (
								<Form.Item
									label={index === 0 ? 'Options' : ''}
									required={false}
									key={field.key}
								>
									<Form.Item
										{...field}
										validateTrigger={['onChange', 'onBlur']}
										rules={[
											{
												required: true,
												whitespace: true,
												message: 'Please input another option.',
											},
										]}
										noStyle
									>
										<Input placeholder="Option" />
									</Form.Item>
									{fields.length > 1 ? (
										<MinusCircleOutlined
											className="dynamic-delete-button"
											onClick={() => remove(field.name)}
										/>
									) : null}
								</Form.Item>
							))
						}
						<Form.Item>
							<Button
								type="dashed"
								onClick={() => add()}
								icon={<PlusOutlined />}
							>
								Add option
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
		);
	}

	return (
		<>
			{contextHolder}
			<h2>Poll Form</h2>
			<div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
				<Form
					name="dynamic_form_item"
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					layout="vertical"
					title="Poll Form"
				>
					<Form.Item
						label="Question"
						name="question"
						rules={[
							{
								required: true,
								whitespace: true,
								message: 'Please input a question.',
							},
						]}
					>
						<Input placeholder="Question" />
					</Form.Item>
					{renderFormOptions()}
					<Form.Item>
						<Button
							type="primary"
							htmlType='submit'
							style={{ display: 'flex' }}
						>
							Submit
						</Button>
					</Form.Item>
				</Form>
				<Switch
					style={{ marginTop: '20px', marginRight: '20px' }}
					title="Show Poll"
					checkedChildren="Showing Poll"
					unCheckedChildren="Hiding Poll"
					onClick={(show) => onSwitch(show, 'Poll')}
					onChange={setShowPoll}
					checked={showPoll}
				/>
				<Switch
					style={{ marginTop: '20px' }}
					title="Show Results"
					checkedChildren="Showing Results"
					unCheckedChildren="Hiding Results"
					onClick={(show) => onSwitch(show, 'Results')}
					onChange={setShowResults}
					checked={showResults}
				/>
			</div>
		</>
	);
};
