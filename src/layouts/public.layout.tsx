import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { PATHS } from '../constants/paths.const';

export const PublicLayout: React.FC = () => {

	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user?.uid) {
				navigate(PATHS.POLL);
			} else {
				// User is signed out
				navigate(PATHS.LOGIN);
			}
		});

	}, [navigate]);

	return (
		<Layout className="public-layout" style={{ minHeight: '100vh' }}>
			<Outlet />
		</Layout >
	);
}