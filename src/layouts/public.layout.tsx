import React from 'react';
import 'antd/dist/antd.min.css';
import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { PATHS } from '../constants/paths.const';


const { Header, Content, Footer, Sider } = Layout;
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

export const PublicLayout: React.FC = () => {

	return (
		<Layout className="public-layout">
			<Sider
				breakpoint="lg"
				collapsedWidth="0"
				onBreakpoint={broken => {
					console.log(broken);
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type);
				}}
			>
				<div className="logo" />
				<Menu
					theme="dark"
					mode="inline"
				>
					{menuItems.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							{item.label}
							<Link to={item.key} />
						</Menu.Item>
					))}
				</Menu>
			</Sider>
			<Layout>
				<Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
				<Content style={{ margin: '24px 16px 0' }}>
					<Outlet />
				</Content>
				<Footer style={{ textAlign: 'center' }}>ESN Aveiro ©2022</Footer>
			</Layout>
		</Layout>
	);
}