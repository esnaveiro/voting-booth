import { GoogleAuthProvider } from "firebase/auth";
import { PATHS } from "./paths.const";

export const uiConfig = {
    // immediateFederatedRedirect: true,
    signInSuccessUrl: PATHS.POLL,
    // signOutSuccessUrl: PATHS.LOGIN,
    signInOptions: [
        {
            provider: GoogleAuthProvider.PROVIDER_ID,
            scopes: [
                // Your requested scopes.
                'https://www.googleapis.com/auth/plus.login'
            ],
            customParameters: {
                // Forces account selection even when one account
                // is available.
                hd: 'esnaveiro.org'
            }

            // Might be useful to later restrict the access for only esnaveiro domain accounts
            // https://github.com/firebase/firebaseui-web/issues/278
        },
    ],
    // Other configuration options here...
}