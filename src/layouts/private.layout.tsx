import React, { useEffect, useState } from 'react';
import { BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, notification } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths.const';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import esnLogo from '../assets/images/esn-aveiro-logo.jpeg';
import { query, get, getDatabase, ref, update } from 'firebase/database';
import { DATABASE } from '../constants/firebase.const';
import { userService } from '../services/user.service';
import useCollapse from '../hooks/custom.hooks';
import { renderNotification } from '../helpers/antd.helpers';

const { Header, Content, Footer, Sider } = Layout;

export const PrivateLayout: React.FC = () => {

	const navigate = useNavigate();
	const location = useLocation();
	const [api, contextHolder] = notification.useNotification();

	const [isAdmin, setIsAdmin] = useState(false);
	const { reference, isCollapsed, setIsCollapsed } = useCollapse(true);

	const onLogout = () => {
		const auth = getAuth();
		signOut(auth).then(() => {
			renderNotification(api, 'success', 'Sign-out successful')
			// Navigate to login page
			navigate('/login');
			userService.clearUser();
		}).catch((error) => {
			renderNotification(api, 'error', 'Error on sign-out');
		});
	}

	useEffect(() => {
		const auth = getAuth();
		const db = getDatabase();

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			get(query(ref(db, `${DATABASE.USERS}/user-${user?.uid}`))).then((snapshot) => {
				// Keeps the is admin flag set
				if (snapshot.exists()) {
					setIsAdmin(snapshot.val().isAdmin);
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
								renderNotification(api, 'error', 'Error submitting user to db: ', e.message);
							});
					}
				}

			}).catch((e) => renderNotification(api, 'error', e.message));
		});

		// This only runs when the component unmounts
		return () => unsubscribe();
	}, [api, navigate])

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
			show: isAdmin,
		}, {
			key: 'Logout',
			callback: onLogout,
			icon: <LogoutOutlined />,
			label: 'Logout',
			show: true,
		}
	];

	return (
		<Layout className="public-layout" style={{ minHeight: '100vh' }} hasSider={true}>
			{contextHolder}
			<Sider
				ref={reference}
				breakpoint="lg"
				collapsedWidth="0"
				defaultCollapsed={true}
				collapsed={isCollapsed}
				onCollapse={(collapse) => setIsCollapsed(collapse)}
			>
				<Menu theme="dark" mode="vertical" defaultSelectedKeys={[location.pathname]}>
					{menuItems.map((item) => (
						item.show ? (
							<Menu.Item key={item.key} icon={item.icon} onClick={item.callback ? item.callback : () => null}>
								{item.label}
								{item.callback ? null : <Link to={item.key} onClick={() => setIsCollapsed(true)} />}
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