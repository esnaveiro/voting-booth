import React from 'react';
import 'antd/dist/antd.min.css';
import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, PageHeader } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { PATHS } from '../constants/paths.const';
import logo from '../assets/images/esn-aveiro-logo.jpeg';

const { Content, Footer, Sider } = Layout;
const menuItems = [
	{
		key: PATHS.POLL,
		icon: <BarChartOutlined />,
		label: 'Poll',
	}, {
		key: PATHS.ADMIN,
		icon: <UserOutlined />,
		label: 'Admin Panel',
	}
];

export const PrivateLayout: React.FC = () => {
	return (
		<Layout className="public-layout" style={{ minHeight: '100vh' }}>
			<Sider
				breakpoint="lg"
				collapsedWidth="0"
				onBreakpoint={broken => {
					console.log(broken);
				}}
			>
				<Menu theme="dark" mode="vertical" defaultSelectedKeys={[PATHS.POLL]}>
					{menuItems.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							{item.label}
							<Link to={item.key} />
						</Menu.Item>
					))}
				</Menu>
			</Sider>
			<Layout>
				<PageHeader
					title="ESN Aveiro's Voting Booth"
					avatar={{ src: logo }}
					style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
				/>
				<Content style={{ margin: '0 16px' }}>
					<Outlet />
				</Content>
				<Footer style={{ textAlign: 'center' }}>ESN Aveiro ©2022</Footer>
			</Layout>
		</Layout >
	);
}