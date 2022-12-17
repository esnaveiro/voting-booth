import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const PublicLayout: React.FC = () => {

	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				// User is signed out
				navigate('/login');
			}
		});

	}, [navigate]);

	return (
		<Layout className="public-layout" style={{ minHeight: '100vh' }}>
			<Outlet />
		</Layout >
	);
}