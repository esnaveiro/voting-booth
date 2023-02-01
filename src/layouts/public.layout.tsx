import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { PATHS } from '../constants/paths.const';
import { userService } from '../services/user.service';

export const PublicLayout: React.FC = () => {

	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user?.uid) {
				userService.setUser(user.uid)
				navigate(PATHS.POLL);
			} else {
				// User is signed out
				navigate(PATHS.LOGIN);
			}
		});

		// Unsubscribes to authentication state change listener
		// This only runs when the component unmounts
		return () => unsubscribe();
	}, [navigate]);

	return (
		<Layout className="public-layout" style={{ minHeight: '100vh' }}>
			<Outlet />
		</Layout >
	);
}