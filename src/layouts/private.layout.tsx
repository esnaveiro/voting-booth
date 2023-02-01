import React, { useEffect } from 'react';
import { BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths.const';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import esnLogo from '../assets/images/esn-aveiro-logo.jpeg';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { DATABASE } from '../constants/firebase.const';
import { userService } from '../services/user.service';

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
			userService.clearUser();
		}).catch((error) => {
			// An error happened.
			console.log('// An error happened. ', error);
		});
	}

	useEffect(() => {
		const auth = getAuth();
		const db = getDatabase();

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			get(child(ref(db), `users/user-${user?.uid}`)).then((snapshot) => {
				if (snapshot.exists()) {
					console.log('exists: ', snapshot.val());
				} else {
					// Insert into DB in case it doesn't exist
					// Not sure what to do here, user might be empty
					const { uid, displayName, email } = user || { uid: '', displayName: '', email: '' };
					const updates = {
						[`${DATABASE.USERS}/user-${uid}}`]: {
							email, id: uid, name: displayName, isAdmin: false,
						}
					}
					update(ref(db), updates)
						.then(() => {
							console.log('User submitted or updated in db');
						}).catch((e) => {
							console.error('Error submitting user to db: ', e);
						});
				}

			}).catch((e) => console.error('Failed to get user info: ', e));
		});

		// This only runs when the component unmounts
		return () => unsubscribe();
	}, [navigate])

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