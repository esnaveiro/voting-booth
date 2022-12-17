import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

export const PublicLayout: React.FC = () => {
	return (
		<Layout className="public-layout" style={{ minHeight: '100vh' }}>
			<Outlet />
		</Layout >
	);
}