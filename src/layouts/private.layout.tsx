import React from 'react';
import { BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths.const';
import { getAuth, signOut } from "firebase/auth";
import esnLogo from '../assets/images/esn-aveiro-logo.jpeg';

const { Header, Content, Footer, Sider } = Layout;

export const PrivateLayout: React.FC = () => {

	const navigate = useNavigate();

	const onLogout = () => {
		const auth = getAuth();
		signOut(auth).then(() => {
			// Sign-out successful.
			console.log('// Sign-out successful.');
			// Navigate to login page

			navigate('/login');
		}).catch((error) => {
			// An error happened.
			console.log('// An error happened. ', error);
		});
	}

	const menuItems = [
		{
			key: PATHS.POLL,
			icon: <BarChartOutlined />,
			label: 'Poll',
		}, {
			key: PATHS.ADMIN,
			icon: <UserOutlined />,
			label: 'Admin Panel',
		}, {
			key: 'Logout',
			callback: onLogout,
			icon: <LogoutOutlined />,
			label: 'Logout',
		}
	];

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
						<Menu.Item key={item.key} icon={item.icon} onClick={item.callback ? item.callback : () => null}>
							{item.label}
							{item.callback ? null : <Link to={item.key} />}
						</Menu.Item>
					))}
				</Menu>
			</Sider>
			<Layout>
				<Header style={{
					backgroundColor: '0xffffff',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
					whiteSpace: 'nowrap'
				}}>
					<h1 style={{ textAlign: 'center', color: 'white', fontSize: '23px', width: '100%' }}>Voting Booth</h1>
				</Header>
				<Content style={{ margin: '0 16px' }}>
					<Outlet />
				</Content>
				<Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
					<p>
						<span>
							<img src={esnLogo} alt="ESN Aveiro's logo" style={{ height: '13px', marginRight: '8px' }} />
						</span>
						ESN Aveiro ©2022
					</p>
				</Footer>
			</Layout>
		</Layout >
	);
}