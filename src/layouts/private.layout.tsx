import React, { useEffect } from 'react';
import { BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths.const';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import esnLogo from '../assets/images/esn-aveiro-logo.jpeg';
import { query, get, getDatabase, limitToLast, ref, update } from 'firebase/database';
import { DATABASE } from '../constants/firebase.const';
import { userService } from '../services/user.service';

const { Header, Content, Footer, Sider } = Layout;

export const PrivateLayout: React.FC = () => {

	const navigate = useNavigate();
	const location = useLocation();

	const onLogout = () => {
		const auth = getAuth();
		signOut(auth).then(() => {
			// Sign-out successful.
			console.log('// Sign-out successful.');
			// Navigate to login page
			navigate('/login');
			userService.clearUser();
		}).catch((error) => {
			console.log('// An error happened. ', error);
		});
	}

	useEffect(() => {
		const auth = getAuth();
		const db = getDatabase();

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			get(query(ref(db, `${DATABASE.USERS}/user-${user?.uid}`))).then((snapshot) => {

				// Keeps the is admin flag set
				if (snapshot.exists()) {
					userService.setIsAdmin(snapshot.val().isAdmin);
					// It inserts a new user when it doesn't exist in the database
				} else {
					// Not sure what to do here, user might be empty
					const { uid, displayName, email } = user || { uid: '', displayName: '', email: '' };
					if (uid && displayName && email) {
						const updates = {
							[`${DATABASE.USERS}/user-${uid}`]: {
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
			show: true,
		}, {
			key: PATHS.ADMIN,
			icon: <UserOutlined />,
			label: 'Admin Panel',
			show: userService.isUserAdmin(),
		}, {
			key: 'Logout',
			callback: onLogout,
			icon: <LogoutOutlined />,
			label: 'Logout',
			show: true,
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
				<Menu theme="dark" mode="vertical" defaultSelectedKeys={[location.pathname]}>
					{menuItems.map((item) => (
						item.show ? (
							<Menu.Item key={item.key} icon={item.icon} onClick={item.callback ? item.callback : () => null}>
								{item.label}
								{item.callback ? null : <Link to={item.key} />}
							</Menu.Item>
						) : null
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