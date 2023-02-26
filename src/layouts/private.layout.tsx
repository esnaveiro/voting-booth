import React, { useEffect, useState } from 'react';
import { BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, notification } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths.const';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import esnLogo from '../assets/images/esn-aveiro-logo.jpeg';
import { query, get, getDatabase, ref } from 'firebase/database';
import { DATABASE } from '../constants/firebase.const';
import { userService } from '../services/user.service';
import useCollapse from '../hooks/custom.hooks';
import { onLogout, getAndUpdateUserInfo, updateUserInfo } from '../helpers/private-layout.helper';
import { IUser } from '../interfaces/lobby-interface';

const { Header, Content, Footer, Sider } = Layout;

export const PrivateLayout: React.FC = () => {

	const navigate = useNavigate();
	const location = useLocation();
	const [api, contextHolder] = notification.useNotification();

	const { reference, isCollapsed, setIsCollapsed } = useCollapse(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const auth = getAuth();
		const db = getDatabase();

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user?.uid) {
				userService.setUser(user);
				get(query(ref(db, `${DATABASE.USERS}/user-${user?.uid}`))).then(async (snapshot) => {
					// Keeps the is admin flag set
					if (snapshot.exists()) {
						userService.setIsAdmin(snapshot.val().isAdmin);
						await getAndUpdateUserInfo(api, user, true);
						// It inserts a new user when it doesn't exist in the database
					} else {
						// Not sure what to do here, user might be empty
						if (user?.uid && user?.displayName && user?.email && user?.uid && user?.photoURL) {
							const { uid, displayName, email, photoURL } = user;
							const userData = {
								email,
								id: uid,
								name: displayName,
								isAdmin: userService.isUserAdmin(),
								photoURL,
								isOnVotingList: false,
							} as IUser;
							await updateUserInfo(api, userData, user.uid, true);
						}
					}

				}).catch(() => {
					setTimeout(async () => onLogout(navigate, api), 5000);
				});
			}
		});

		/**
		 * Updates user logged in info to logged off when the tab is closed
		 * @param event
		 */
		const handleTabClose = async (event: { preventDefault: () => void; type: any; }) => {
			// Prevents default behavior of immediately closing the tab and this way we can override its behavior
			event.preventDefault();
			return await onLogout(navigate, api);
		};

		window.addEventListener('unload', handleTabClose);

		// This only runs when the component unmounts, it prevents memory leaks
		return () => {
			unsubscribe();
			window.removeEventListener('unload', handleTabClose);
		};
	}, [api, navigate]);

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
			callback: onLogout.bind(this, navigate, api),
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
				collapsed={isMobile ? isCollapsed : false}
				onCollapse={(collapse) => setIsCollapsed(collapse)}
				onBreakpoint={(broken) => setIsMobile(broken)}
			>
				<Menu theme="dark" mode="vertical" defaultSelectedKeys={[location.pathname]}>
					{menuItems.map((item) => (
						item.show ? (
							<Menu.Item key={item.key} icon={item.icon} onClick={item.callback ? item.callback : () => null}>
								{item.label}
								{item.callback ? null : <Link to={item.key} onClick={() => isMobile ? setIsCollapsed(true) : null} />}
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
						ESN Aveiro ©2023
					</p>
				</Footer>
			</Layout>
		</Layout >
	);
}