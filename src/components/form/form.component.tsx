import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification, Switch } from 'antd';
import { NotificationType } from '../../interfaces/antd-interface';
import { push, ref, update, child, getDatabase } from 'firebase/database';
import { DATABASE } from '../../constants/firebase.const';

interface IValues {
	options: string[];
	question: string;
}

export const FormComponent: React.FC = () => {
	const [form] = Form.useForm();
	const [showResults, setShowResults] = useState(false);
	const [api, contextHolder] = notification.useNotification();

	const renderNotification = (type: NotificationType, message: string, description?: string) => {
		api[type]({
			message, description, placement: 'bottomRight'
		});
	};

	const onFinish = (values: IValues) => {
		const db = getDatabase();
		const newPollKey = push(child(ref(db), DATABASE.COLLECTION)).key;

		const updates = {
			[DATABASE.COLLECTION + '/' + DATABASE.POLL + newPollKey]: {
				question: values.question,
				options: values.options.map((option, i) => ({ id: `${newPollKey}-${i}`, text: option, votes: 0 })),
				// @TODO
				// Should be controlled by the switch
				show: true,
			}
		}
		update(ref(db), updates).then(() => {
			form.resetFields();
		}).catch((error: any) => {
			console.error('Error adding item: ', error);
		});

		renderNotification('success', 'Poll submitted');
	};

	const onFinishFailed = (errorInfo: any) => {
		renderNotification('error', 'Please fill in all of the fields');
	};

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
				initialValue={['', '']}
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
					title="Show Results"
					checked={showResults}
					onChange={setShowResults}
					checkedChildren="Showing Results"
					unCheckedChildren="Hiding Results"
					onClick={(show) => {
						console.log('here: ', show);
						// @TODO
						// Send firebase trigger that updates last poll show
					}}
				/>
			</div>
		</>
	);
};
