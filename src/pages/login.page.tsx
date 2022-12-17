import { useEffect } from "react";
import { ui } from "..";
import { uiConfig } from "../constants/firebase-ui.const";
import 'firebaseui/dist/firebaseui.css';

export const LoginPage = () => {
    useEffect(() => {
        ui.start('#firebaseui-auth-container', uiConfig);
        // Set isLoading to false when the async operation is complete
    }, []);

    const centerCss = { display: 'flex', justifyContent: 'center', verticalAlign: 'middle' };
    return (
        <div style={{ ...centerCss, flexDirection: 'column', height: '80vh' }}>
            <h1 style={{ ...centerCss }}>Voting Booth</h1>
            <div id="firebaseui-auth-container"></div>
        </div>
    );

}